const axios = require('axios');
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const turndownPluginGfm = require('turndown-plugin-gfm');
const fs = require('fs');

const turndownService = new TurndownService({ headingStyle: 'atx' });
const gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);

const BASE_URL = 'https://pestcontrolbengaluru.in/blog/';

async function scrape() {
  try {
    console.log('Fetching blog index...');
    const { data: html } = await axios.get(BASE_URL);
    const $ = cheerio.load(html);
    
    const articleLinks = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('https://pestcontrolbengaluru.in/') && href !== 'https://pestcontrolbengaluru.in/' && href !== BASE_URL) {
        if (!href.includes('/category/') && !href.includes('/author/') && !href.includes('/about-us/') && !href.includes('/services/') && !href.includes('/contact') && !href.includes('/faq') && !href.includes('/pest-control-franchise')) {
           const services = ['/termite-treatment/', '/bed-bugs-treatment/', '/ticks-fleas-treatment/', '/cockroach-treatment/', '/rodent-treatment/', '/honey-bee-treatment/', '/wood-borer-treatment/', '/mosquito-treatment/', '/ask-us/'];
           let isService = false;
           for (const s of services) {
             if (href.endsWith(s)) isService = true;
           }
           if (!isService && !articleLinks.includes(href)) {
             articleLinks.push(href);
           }
        }
      }
    });

    console.log(`Found ${articleLinks.length} articles.`);
    
    const blogs = [];
    
    // Only scrape a few for testing or all if we have time. Let's just scrape all.
    for (let i = 0; i < articleLinks.length; i++) {
      const url = articleLinks[i];
      console.log(`Scraping ${i+1}/${articleLinks.length}: ${url}`);
      try {
        const { data: postHtml } = await axios.get(url);
        const $post = cheerio.load(postHtml);
        
        const title = $post('h1').first().text().trim() || $post('title').text().trim();
        const metaDesc = $post('meta[name="description"]').attr('content') || '';
        const metaKeywords = $post('meta[name="keywords"]').attr('content') || '';
        
        let image = $post('meta[property="og:image"]').attr('content') || '';
        let imageAlt = '';
        
        const $img = $post('.wp-post-image').first();
        if ($img.length) {
          if (!image) image = $img.attr('src');
          imageAlt = $img.attr('alt') || '';
        }
        
        // Find the main content
        const $content = $post('.elementor-widget-theme-post-content').length ? $post('.elementor-widget-theme-post-content').first() : $post('main, article, .elementor-location-single').first();
        $content.find('script, style, form, .sharedaddy').remove();
        
        // Fix lazy-loaded images
        $content.find('img').each((i, el) => {
          const dataSrc = $(el).attr('data-src') || $(el).attr('data-lazy-src') || $(el).attr('data-opt-src');
          if (dataSrc) {
            $(el).attr('src', dataSrc);
          }
        });
        
        let contentHtml = $content.html() || '';
        let markdown = turndownService.turndown(contentHtml);
        
        // Sometimes turndown generates a lot of empty links or weird divs if it's elementor.
        // Let's just do basic cleanup.
        markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();
        
        const slug = url.replace('https://pestcontrolbengaluru.in/', '').replace(/\//g, '');
        
        blogs.push({
          id: 'BLG-' + Math.random().toString(36).slice(2,9).toUpperCase(),
          title,
          slug,
          excerpt: metaDesc || markdown.substring(0, 150).replace(/\n/g, ' ') + '...',
          content: markdown,
          status: 'published',
          date: new Date().toISOString(),
          image,
          imageAlt,
          metaDesc,
          metaKeywords
        });
      } catch (err) {
        console.error(`Error scraping ${url}:`, err.message);
      }
    }
    
    fs.writeFileSync('src/admin/blogsData.json', JSON.stringify(blogs, null, 2));
    console.log('Successfully saved to src/admin/blogsData.json');
    
  } catch (err) {
    console.error('Error:', err);
  }
}

scrape();
