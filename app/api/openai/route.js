import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import https from 'https';

// Initialize Firebase Admin
function getFirebaseAdmin() {
  const apps = admin.apps || (admin.getApps ? admin.getApps() : []);
  if (apps.length === 0) {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
    } else {
      console.warn("Firebase Admin missing credentials in .env");
    }
  }
  return admin;
}

async function uploadToFirebaseStorage(imageUrl, fileName) {
  try {
    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();
    
    const safeFileName = (fileName || 'image.png').replace(/[^a-z0-9.-]/gi, '') || 'image.png';
    const uniqueFileName = `${Date.now()}-${safeFileName}`;
    
    const bucket = getFirebaseAdmin().storage().bucket();
    const file = bucket.file(`blogs/${uniqueFileName}`);
    
    await file.save(Buffer.from(buffer), {
      metadata: { contentType: 'image/png' },
      public: true
    });
    
    return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
  } catch (error) {
    console.error("Firebase Storage Upload Error:", error);
    return imageUrl; 
  }
}

async function uploadBase64ToFirebaseStorage(b64_json, fileName) {
  // Guard: must be a non-empty string
  if (!b64_json || typeof b64_json !== 'string' || b64_json.length === 0) {
    console.error('uploadBase64ToFirebaseStorage: b64_json is missing or empty.');
    return null;
  }

  const safeFileName = (fileName || 'image.png').replace(/[^a-z0-9.-]/gi, '') || 'image.png';
  const uniqueFileName = `${Date.now()}-${safeFileName}`;

  try {
    const buffer = Buffer.from(b64_json, 'base64');
    const bucket = getFirebaseAdmin().storage().bucket();
    const file = bucket.file(`blogs/${uniqueFileName}`);
    
    await file.save(buffer, {
      metadata: { contentType: 'image/png' },
      public: true
    });
    
    return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
  } catch (error) {
    console.error('Firebase Storage Upload Error:', error.message);
    // Fallback: return data URL so image still shows
    return `data:image/png;base64,${b64_json}`;
  }
}

const key = () => process.env.OPENAI_API_KEY;

async function callOpenAI(body) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key()}`
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

function httpsPost(url, headers, bodyObj) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(bodyObj);
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        ...headers,
        'Content-Length': Buffer.byteLength(bodyStr),
      },
    };
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        try {
          const raw = Buffer.concat(chunks).toString('utf8');
          const data = JSON.parse(raw);
          resolve(data);
        } catch (e) {
          reject(new Error('Failed to parse API response: ' + e.message));
        }
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function callDallE(prompt) {
  console.log('[callDallE] Requesting dall-e-2 for prompt:', prompt.slice(0, 80));
  let data;
  try {
    data = await httpsPost(
      'https://api.openai.com/v1/images/generations',
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key()}`,
      },
      { model: 'dall-e-2', prompt, n: 1, size: '512x512', response_format: 'b64_json' }
    );
  } catch (fetchErr) {
    throw new Error('Image API request failed: ' + fetchErr.message);
  }

  if (data.error) {
    console.error('[callDallE] API error:', data.error);
    throw new Error(data.error.message || JSON.stringify(data.error));
  }
  if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
    console.error('[callDallE] Unexpected response keys:', Object.keys(data));
    throw new Error('Image API returned no image data. Keys: ' + Object.keys(data).join(', '));
  }
  const item = data.data[0];
  const b64 = item.b64_json || item.b64 || null;
  if (!b64) {
    console.error('[callDallE] Image item keys:', Object.keys(item));
    throw new Error('No b64_json field in image item. Keys: ' + Object.keys(item).join(', '));
  }
  console.log('[callDallE] Got b64 image, length:', b64.length);
  return { ...data, data: [{ ...item, b64_json: b64 }] };
}

// SSE helper
function sseEvent(type, data) {
  return `data: ${JSON.stringify({ type, ...data })}\n\n`;
}

function markdownToHtml(md) {
  if (!md) return '';
  let html = md;

  // Tables
  html = html.replace(/^\|(.+)\|\s*\n\|[-| :]+\|\s*\n((?:\|.+\|\s*\n?)+)/gm, (_, header, rows) => {
    const ths = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
    const trs = rows.trim().split('\n').map(row => {
      const tds = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }).join('');
    return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
  });

  html = html.replace(/^### (.+)$/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gim, '<h1>$1</h1>');
  html = html.replace(/^\> (.+)$/gim, '<blockquote><p>$1</p></blockquote>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />');
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  // Lists
  html = html.replace(/((?:^\d+\..+\n?)+)/gm, (match) => {
    const items = match.trim().split('\n').map(l => `<li>${l.replace(/^\d+\.\s*/, '')}</li>`).join('');
    return `<ol>${items}</ol>`;
  });
  html = html.replace(/((?:^[-*+] .+\n?)+)/gm, (match) => {
    const items = match.trim().split('\n').map(l => `<li>${l.replace(/^[-*+] /, '')}</li>`).join('');
    return `<ul>${items}</ul>`;
  });

  html = html.split('\n\n').map(p => {
    p = p.trim();
    if (!p) return '';
    if (/^<(h[1-6]|ul|ol|li|table|blockquote|img|p)/.test(p)) return p;
    return `<p>${p.replace(/\n/g, ' ')}</p>`;
  }).join('\n');

  return html;
}

export async function POST(req) {
  if (!key()) {
    return NextResponse.json({ error: { message: "OPENAI_API_KEY is not set in environment variables." } }, { status: 500 });
  }

  const body = await req.json();

  // ─── Legacy single-call types (image only now) ──────────────────
  if (body.type === 'image') {
    try {
      const data = await callDallE(
        body.prompt + ' Photorealistic, cinematic, no text or words in image.'
      );
      const finalImageUrl = await uploadBase64ToFirebaseStorage(data.data[0].b64_json, 'generated-image.png');
      return NextResponse.json({ url: finalImageUrl, usage: 1 });
    } catch (err) {
      return NextResponse.json({ error: { message: err.message } }, { status: 500 });
    }
  }

  // ─── Calendar Plan Generation ────────────────────────────────────
  if (body.type === 'calendar_plan') {
    const { year, month } = body; 
    const monthName = new Date(year, month - 1, 1).toLocaleString('en', { month: 'long' });
    const daysInMonth = new Date(year, month, 0).getDate();

    const scheduledDates = [];
    for (let d = 1; d <= daysInMonth; d++) {
      scheduledDates.push(`${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`);
    }

    try {
      const data = await callOpenAI({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an elite SEO Content Strategist specializing in local service businesses in India.
Your task is to generate a monthly blog content calendar for a professional pest control company (A to Z Pest Control) based in Bangalore, India.

For each scheduled posting date, provide:
- "keyword": A high-ranking, commercially valuable primary keyword (must have search intent of "informational" or "commercial investigation")  
- "category": One of: How-To Guide | Comparison | Cost Guide | Seasonal | Local SEO | FAQ Article | Prevention Tips
- "estimated_difficulty": low / medium / high
- "estimated_volume": low / medium / high / very-high
- "notes": 1 sentence on the unique angle or data point to include

Rules:
- Consider seasonality for ${monthName} ${year} in Bangalore (monsoon season Jul-Sep, summer Mar-May, etc.)
- Mix keyword difficulty: 40% low, 40% medium, 20% high
- Use long-tail, geo-targeted keywords where appropriate (e.g. "pest control whitefield bangalore")
- No duplicate topics
- Cover diverse pest types: termites, cockroaches, bed bugs, mosquitoes, rats, ants, lizards, bees
- Include at least 2 "cost guide" keywords and 2 "how-to" keywords
- Output strictly as JSON: { "month": "${monthName} ${year}", "days": { "YYYY-MM-DD": { "keyword": "...", "category": "...", "estimated_difficulty": "...", "estimated_volume": "...", "notes": "..." } } }`
          },
          {
            role: 'user',
            content: `Generate the content calendar for ${monthName} ${year}.
Total posts this month: ${scheduledDates.length} (Daily posts)
Scheduled dates: ${scheduledDates.join(', ')}

Generate high-quality, diverse, SEO-optimized keyword assignments for every single date.`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.6,
        max_tokens: 4000
      });
      return NextResponse.json({ plan: JSON.parse(data.choices[0].message.content), usage: data.usage });
    } catch (err) {
      return NextResponse.json({ error: { message: err.message } }, { status: 500 });
    }
  }


  // ─── Full 5-Stage Pipeline (Streaming SSE) ───────────────────────
  if (body.type === 'pipeline') {
    let { primary_keyword, lsi_keywords, instructions, includeImage } = body;
    let totalTokens = 0;
    let imageTokenCost = 0;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (type, data) => {
          controller.enqueue(encoder.encode(sseEvent(type, data)));
        };

        try {
          // ───────────────────────────────────────────────────────
          // STEP 0 (Auto): AI Picks the Best Keyword
          // ───────────────────────────────────────────────────────
          if (!primary_keyword || !primary_keyword.trim()) {
            send('progress', { step: 1, status: 'running', message: 'AI is selecting the highest-ranking keyword for today...' });
            const today = new Date();
            const month = today.toLocaleString('en', { month: 'long' });
            
            const pests = ['termites', 'cockroaches', 'bed bugs', 'mosquitoes', 'rodents', 'ants'];
            const randomPest = pests[Math.floor(Math.random() * pests.length)];

            const kwData = await callOpenAI({
              model: 'gpt-4o',
              messages: [
                { role: 'system', content: `You are an expert SEO strategist for A to Z Pest Control, a professional pest control company in Bangalore, India. Pick the single BEST primary keyword to write a blog post about today. Consider: current season in Bangalore (${month}), high commercial intent + high search volume, local Bangalore angles. Focus specifically on this pest for today's article: ${randomPest}. Output strictly in JSON: { "keyword": "the chosen keyword", "reason": "1 sentence why this keyword was picked" }` },
                { role: 'user', content: `Pick the best keyword for today: ${month} ${today.getDate()}, ${today.getFullYear()}.` }
              ],
              response_format: { type: 'json_object' },
              temperature: 0.9, // increased temperature for more variety
              max_tokens: 500
            });
            totalTokens += kwData.usage?.total_tokens || 0;
            const kwJson = JSON.parse(kwData.choices[0].message.content);
            primary_keyword = kwJson.keyword;
            send('keyword_selected', { keyword: primary_keyword, reason: kwJson.reason });
          }

          // ───────────────────────────────────────────────────────
          // STEP 1: Web-Grounded Keyword & SERP Analysis
          // ───────────────────────────────────────────────────────
          send('progress', { step: 1, status: 'running', message: `Analyzing "${primary_keyword}" & fetching SERP context...` });

          const serpSystemPrompt = `You are an expert SEO Content Strategist. Analyze the given primary keyword and generate:
1. A list of 8-12 strong LSI/semantic secondary keywords
2. A list of 5-7 realistic "People Also Ask" questions from Google SERP
3. Key current statistics or facts relevant to this topic (make them realistic and specific)
4. Top search intent category (informational/commercial/transactional)

Output strictly in JSON with keys: "lsi_keywords", "paa_questions", "key_stats", "search_intent"`;


          const serpData = await callOpenAI({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: serpSystemPrompt },
              { role: 'user', content: `Primary Keyword: ${primary_keyword}\nUser-provided LSI: ${lsi_keywords || 'none'}` }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3,
            max_tokens: 1500
          });

          totalTokens += serpData.usage?.total_tokens || 0;
          const serpJson = JSON.parse(serpData.choices[0].message.content);
          send('progress', { step: 1, status: 'done', message: 'SERP analysis complete', data: serpJson });

          // ───────────────────────────────────────────────────────
          // STEP 2: Generate Outline & JSON Schema
          // ───────────────────────────────────────────────────────
          send('progress', { step: 2, status: 'running', message: 'Generating structured outline & FAQ schema...' });
          
          let internalLinksContext = "[]";
          try {
            const blogsPath = path.join(process.cwd(), 'src/admin/blogsData.json');
            if (fs.existsSync(blogsPath)) {
              const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
              const mapped = blogs.filter(b => b.status === 'published').slice(0, 25).map(b => ({ title: b.title, url: `/${b.slug}/` }));
              internalLinksContext = JSON.stringify(mapped);
            }
          } catch(e) {
            console.error("Failed to read blogsData for internal links", e);
          }

          const outlineSystemPrompt = `You are an expert SEO Content Strategist. Generate a highly structured article outline and FAQ schema.
Output strictly in JSON with keys:
- "h1_title": catchy title including primary keyword
- "meta_description": 150-160 char SEO meta description
- "bluf_answer": 40-60 word direct answer block
- "sections": array of objects with "heading_level" (h2/h3), "heading_text", "target_keywords", "word_target" (250-500)
- "faq_schema": array of 4-5 objects with "question" and "answer" (2-3 sentences each)
- "table_section_index": which section index (0-based) should contain a comparison table

Rules:
- NO generic headings like "Introduction" or "Conclusion"
- Use intent-driven, keyword-rich headings
- Include exactly 12-18 sections total to achieve a 2500-3500 word article length.
- Ensure the final section is ALWAYS an FAQ section with the heading_text "Frequently Asked Questions" (or similar).
- Ensure FAQ maps to real user questions from PAA`;

          const outlineData = await callOpenAI({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: outlineSystemPrompt },
              { role: 'user', content: `Primary Keyword: ${primary_keyword}
LSI Keywords: ${[...(serpJson.lsi_keywords || []), ...(lsi_keywords ? lsi_keywords.split(',') : [])].join(', ')}
PAA Questions: ${serpJson.paa_questions?.join(', ')}
Key Stats Available: ${serpJson.key_stats?.join(', ')}
Search Intent: ${serpJson.search_intent}
Additional Instructions: ${instructions || 'none'}
Generate a comprehensive outline.` }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.4,
            max_tokens: 4000
          });

          totalTokens += outlineData.usage?.total_tokens || 0;
          const outline = JSON.parse(outlineData.choices[0].message.content);
          send('progress', { step: 2, status: 'done', message: `Outline ready — ${outline.sections?.length} sections`, data: outline });

          // ───────────────────────────────────────────────────────
          // STEP 3: Section-by-Section Drafting
          // ───────────────────────────────────────────────────────
          send('progress', { step: 3, status: 'running', message: `Drafting ${outline.sections?.length} sections...` });

          const sectionSystemPrompt = `You are an expert copywriter and SEO specialist. Write a comprehensive section for a blog post based on the provided heading and context.

Rules:
1. Write in Markdown format. Output ONLY the text for this section (do NOT output the heading itself, as it is added automatically).
2. Write between 250 and 500 words. Be highly detailed, authoritative, and actionable. 
3. STRICTLY DO NOT use AI fluff phrases (e.g., "In today's fast-paced world", "delve into", "testament to", "it's important to note", "crucial", "vital"). Use a direct, factual tone.
4. Use short paragraphs (2-4 sentences max) and bold key phrases organically.
5. If the section index matches the table_section_index, you MUST include a Markdown table.
6. **Internal Links**: You are provided with a JSON list of available internal blogs. You MUST contextually inject 1-2 internal markdown links (e.g. [Link Text](/slug/)) into this section IF relevant.
7. **External Links**: Over the course of the article, we need 4-5 high-authority external links. If appropriate for this section, embed a markdown link to a reputable external source (e.g., CDC, EPA, WHO, major news).

Available Internal Links to choose from:
${internalLinksContext}`;

          const sectionContents = [];
          for (let i = 0; i < outline.sections.length; i++) {
            const section = outline.sections[i];
            send('progress', { step: 3, status: 'running', message: `Writing section ${i + 1}/${outline.sections.length}: "${section.heading_text}"` });

            const isTable = i === outline.table_section_index;
            const isFaq = section.heading_text?.toLowerCase().includes('faq') || section.heading_text?.toLowerCase().includes('question');

            const sectionData = await callOpenAI({
              model: 'gpt-4o',
              messages: [
                { role: 'system', content: sectionSystemPrompt },
                { role: 'user', content: `Article Title: ${outline.h1_title}
Section Heading: ${section.heading_text} (${section.heading_level})
Keywords to include: ${Array.isArray(section.target_keywords) ? section.target_keywords.join(', ') : (section.target_keywords || '')}
Target word count: ~${section.word_target || 200} words
${isTable ? 'IMPORTANT: Include a well-formatted markdown comparison table in this section.' : ''}
${isFaq ? `FAQ Questions to answer:\n${outline.faq_schema?.map(f => `- Q: ${f.question}\n  A: ${f.answer}`).join('\n')}` : ''}
Key stats to weave in if relevant: ${Array.isArray(serpJson.key_stats) ? serpJson.key_stats.join('; ') : (serpJson.key_stats || '')}

Write the complete markdown content for this section only.` }
              ],
              temperature: 0.7,
              max_tokens: 1200
            });

            totalTokens += sectionData.usage?.total_tokens || 0;
            const content = sectionData.choices[0].message.content;
            sectionContents.push({ heading: section.heading_text, level: section.heading_level, content });
            send('section', { index: i, heading: section.heading_text, level: section.heading_level, content: markdownToHtml(content) });
          }

          send('progress', { step: 3, status: 'done', message: 'All sections drafted successfully' });

          // ───────────────────────────────────────────────────────
          // STEP 4: Image Prompt Generation & DALL-E 3
          // ───────────────────────────────────────────────────────
          if (includeImage) {
            send('progress', { step: 4, status: 'running', message: 'Generating cinematic image prompts & rendering...' });

            const imgPromptData = await callOpenAI({
              model: 'gpt-4o',
              messages: [
                { role: 'system', content: `You are a visual SEO specialist. Generate image assets data strictly in JSON with keys: "cover_prompt" (highly detailed description, photorealistic, cinematic, no text), "cover_alt" (descriptive, includes primary keyword), "cover_filename" (lowercase, hyphen-separated, ending in .webp), "inline_prompt" (educational, infographic or scene, photorealistic, no text), "inline_alt" (descriptive, secondary keyword), "inline_filename" (lowercase, hyphen-separated, ending in .webp).` },
                { role: 'user', content: `Article Title: ${outline.h1_title}\nPrimary Topic: ${primary_keyword}\nGenerate the image assets data.` }
              ],
              response_format: { type: 'json_object' },
              temperature: 0.5,
              max_tokens: 1500
            });

            totalTokens += imgPromptData.usage?.total_tokens || 0;
            const imgAssets = JSON.parse(imgPromptData.choices[0].message.content);
            send('progress', { step: 4, status: 'running', message: 'Calling gpt-image-2 for Cover and Inline images (this takes ~15s)...' });

            try {
              const coverPromise = callDallE(imgAssets.cover_alt + '. Photorealistic, cinematic, no text or words in image, ultra HD, suitable for a professional home services blog.');
              const inlinePromise = callDallE(imgAssets.inline_alt + '. Photorealistic, educational, no text or words in image, ultra HD, suitable for an article.');
              
              const [coverData, inlineData] = await Promise.all([coverPromise, inlinePromise]);
              imageTokenCost = 2; // 2 images
              
              send('progress', { step: 4, status: 'running', message: 'Saving images to Firebase Storage...' });
              const coverFileName = imgAssets.cover_filename ? imgAssets.cover_filename.replace('.webp', '.png') : 'cover.png';
              const inlineFileName = imgAssets.inline_filename ? imgAssets.inline_filename.replace('.webp', '.png') : 'inline.png';
              
              const [coverUrl, inlineUrl] = await Promise.all([
                uploadBase64ToFirebaseStorage(coverData.data[0].b64_json, coverFileName),
                uploadBase64ToFirebaseStorage(inlineData.data[0].b64_json, inlineFileName)
              ]);
              
              send('image', { url: coverUrl, alt: imgAssets.cover_alt, fileName: coverFileName });
              
              // Inject inline image into the middle section
              const midIdx = Math.floor(sectionContents.length / 2);
              if (sectionContents[midIdx]) {
                const imgMarkdown = `\n\n![${imgAssets.inline_alt}](${inlineUrl})\n\n`;
                sectionContents[midIdx].content += imgMarkdown;
                // Re-send section update to frontend
                send('section', { index: midIdx, heading: sectionContents[midIdx].heading, level: sectionContents[midIdx].level, content: markdownToHtml(sectionContents[midIdx].content) });
              }
              
              send('progress', { step: 4, status: 'done', message: 'Cover & Inline images rendered and saved to Firebase' });
            } catch (imageError) {
              console.error("DALL-E image generation failed:", imageError.message);
              send('progress', { step: 4, status: 'error', message: `Image generation failed: ${imageError.message}` });
              throw imageError;
            }
          } else {
            send('progress', { step: 4, status: 'skipped', message: 'Image generation skipped' });
          }

          // ───────────────────────────────────────────────────────
          // STEP 5: SEO Quality Evaluation & Pre-Publishing Gate
          // ───────────────────────────────────────────────────────
          send('progress', { step: 5, status: 'running', message: 'Running Pre-Publishing SEO & Ranking Evaluator...' });

          const fullMarkdown = sectionContents.map(s => `${'#'.repeat(s.level === 'h2' ? 2 : 3)} ${s.heading}\n\n${s.content}`).join('\n\n');
          let finalMarkdownWithH1 = `# ${outline.h1_title}\n\n${fullMarkdown}`;
          let seoScores;

          const runEvaluator = async (markdown) => {
            const res = await callOpenAI({
              model: 'gpt-4o',
              messages: [
                { role: 'system', content: `You are an expert SEO Quality Assurance Engine and Senior Content Auditor (similar to SurferSEO, Clearscope, and RankYak). 
Your task is to conduct a strict, objective pre-publishing audit of an article against target search intent, technical on-page rules, and Google Search Quality Evaluator Guidelines (E-E-A-T & Helpful Content).

Evaluate the article across 4 core pillars and compute a final weighted SEO Score (0 to 100):

1. Keyword & Entity Optimization (30 Points):
   - Primary keyword in H1 and first 100 words (BLUF block).
   - Natural keyword density (target: 0.8% to 1.5%). Penalty for keyword stuffing (>2%) or under-optimization (<0.5%).
   - Inclusion and contextual relevance of provided secondary/LSI keywords.

2. Structure, Scannability & Rich Media (25 Points):
   - Strict heading hierarchy (exactly one H1, proper H2/H3 nesting).
   - At least 1 markdown table (| Header |) summarizing core takeaways.
   - At least 2 structured bullet/numbered lists.
   - Verified presence of descriptive image tags (Markdown or HTML) with alt attributes.
   - FAQ section with 3+ clear questions.

3. Search Intent, E-E-A-T & Information Gain (25 Points):
   - BLUF compliance: Does the first paragraph answer the core search query directly?
   - Zero AI conversational filler (e.g., "In today's fast-paced world", "delve into", "testament to"). Determine if NO fluff phrases were used.
   - Unique data points, concrete examples, or specific benchmarks (preventing "scaled content abuse").
   - **Interlinking**: Penalize heavily if the article contains fewer than 3 internal links to other blogs, or fewer than 3 high-authority external links.

4. Readability & Engagement (20 Points):
   - Paragraph length: No walls of text (paragraphs should be 2-4 sentences max).
   - Tone: Authoritative, direct, and actionable.

OUTPUT FORMAT:
Output strictly valid JSON matching this schema:
{
  "seo_overall_score": 0,
  "publishing_verdict": "PASSED_READY_TO_PUBLISH | NEEDS_MINOR_PATCHES | FAILED_REGENERATE",
  "category_scores": {
    "keyword_optimization_score": 0,
    "structure_and_media_score": 0,
    "intent_and_eeat_score": 0,
    "readability_score": 0
  },
  "checklist_booleans": {
    "keyword_in_h1": false,
    "keyword_in_bluf": false,
    "table_present": false,
    "lists_present": false,
    "faq_present": false,
    "images_with_alt_present": false,
    "no_fluff_phrases_used": false
  },
  "calculated_metrics": {
    "estimated_word_count": 0,
    "keyword_density_percent": 0.0,
    "reading_grade_level": "",
    "lsi_keywords_found": [],
    "lsi_keywords_missing": []
  },
  "critical_flaws": [],
  "patch_recommendations": [
    {
      "target_section": "",
      "issue": "",
      "suggested_fix": ""
    }
  ]
}` },
                { role: 'user', content: `Primary Target Keyword: ${primary_keyword}
Target Search Intent: ${serpJson.search_intent}
Required LSI / Semantic Entities: ${serpJson.lsi_keywords?.join(', ')}
Target Word Count Range: 2500 - 3500 words

Assembled Article Markdown to Audit:
---
${markdown}
---

Perform the complete audit, calculate the scores, and return the diagnostic JSON.` }
              ],
              response_format: { type: 'json_object' },
              temperature: 0.2,
              max_tokens: 3000
            });
            totalTokens += res.usage?.total_tokens || 0;
            return JSON.parse(res.choices[0].message.content);
          };

          // Strip huge Base64 data strings to prevent TPM rate limit crashes
          // Match both HTML src="data:image..." and Markdown !(data:image...)
          const safeMarkdown = finalMarkdownWithH1
            .replace(/src="data:image\/[^"]+"/g, 'src="[IMAGE_BASE64_REMOVED]"')
            .replace(/\]\(data:image\/[^)]+\)/g, ']([IMAGE_BASE64_REMOVED])');
          
          seoScores = await runEvaluator(safeMarkdown);

          if (seoScores.seo_overall_score < 70) {
            throw new Error(`Article failed strict quality audit (Score: ${seoScores.seo_overall_score}/100). Critical Flaws: ${seoScores.critical_flaws?.join('; ')}`);
          } else if (seoScores.seo_overall_score < 85) {
            send('progress', { step: 5, status: 'running', message: `Score ${seoScores.seo_overall_score}/100. Activating Self-Healing Patch Engine...` });
            
            const patchRes = await callOpenAI({
              model: 'gpt-4o',
              messages: [
                { role: 'system', content: `You are an SEO Content Optimizer and Editor. Your role is to take an existing draft, review the failed audit checklist items and patch recommendations, and output updated markdown sections that achieve a 95+ SEO score.

Rules:
1. Fix all missing LSI entities, keyword placements, and structural elements identified in the audit.
2. Ensure the BLUF answer is clear, direct, and under 60 words.
3. If a markdown table or bulleted list is missing, create one.
4. Eliminate any detected AI fluff phrases.
5. If internal or external links are missing or insufficient, inject contextual markdown links to fulfill the requirements.
6. Return ONLY the corrected full markdown article, ready for instant publication.` },
                { role: 'user', content: `Primary Keyword: ${primary_keyword}
Audit SEO Score: ${seoScores.seo_overall_score} / 100
Identified Critical Flaws:
${seoScores.critical_flaws?.join('\n')}

Specific Patch Recommendations:
${JSON.stringify(seoScores.patch_recommendations, null, 2)}

Original Draft:
---
${safeMarkdown}
---

Apply all corrections and output the optimized, publication-ready markdown article.` }
              ],
              temperature: 0.5,
              max_tokens: 4000
            });
            totalTokens += patchRes.usage?.total_tokens || 0;
            const patchedMarkdown = patchRes.choices[0].message.content.replace(/^```markdown|```$/g, '').trim();
            finalMarkdownWithH1 = patchedMarkdown; // Since we don't need to restore base64 to re-evaluate or save to db as base64, we can just leave it removed or let the user fix it. 
            // If it must be restored, a more robust matching strategy is needed. But for Vercel, we actually shouldn't return base64 at all because it crashes the browser.

            send('progress', { step: 5, status: 'running', message: 'Re-evaluating patched article (Gate 2)...' });
            
            const safePatchedMarkdown = finalMarkdownWithH1
              .replace(/src="data:image\/[^"]+"/g, 'src="[IMAGE_BASE64_REMOVED]"')
              .replace(/\]\(data:image\/[^)]+\)/g, ']([IMAGE_BASE64_REMOVED])');
            seoScores = await runEvaluator(safePatchedMarkdown);
            if (seoScores.seo_overall_score < 70) {
              throw new Error(`Article still failed quality audit after patch (Score: ${seoScores.seo_overall_score}/100).`);
            }
          }

          // Final assembly
          const assembledHtml = markdownToHtml(finalMarkdownWithH1);
          const faqJsonLd = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": outline.faq_schema?.map(f => ({
              "@type": "Question",
              "name": f.question,
              "acceptedAnswer": { "@type": "Answer", "text": f.answer }
            }))
          };

          send('progress', { step: 5, status: 'done', message: 'SEO audit complete' });
          send('complete', {
            outline,
            assembledHtml,
            faqJsonLd,
            seoScores,
            serpJson,
            totalTokens,
            imageTokenCost,
            estimatedCostUsd: ((totalTokens / 1000) * 0.005).toFixed(4)
          });

        } catch (err) {
          send('error', { message: err.message });
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });
  }

  return NextResponse.json({ error: { message: 'Invalid request type' } }, { status: 400 });
}
