import { useState, useRef, useEffect } from 'react';
import '../../views/BlogPostPage.css';

// Basic Markdown to HTML converter for legacy blogs
function markdownToHtml(md) {
  if (!md) return '';
  let html = md;
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
  html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
  html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />");
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>");
  
  // paragraph wrapping for blocks separated by double newlines
  html = html.split('\n\n').map(p => {
    if (p.trim() === '') return '';
    if (p.startsWith('<h') || p.startsWith('<block') || p.startsWith('<iframe') || p.startsWith('<img') || p.startsWith('<p>')) return p;
    return `<p>${p.replace(/\n/g, '<br />')}</p>`;
  }).join('\n');
  return html;
}

export default function BlogWYSIWYG({ initialContent, onChange }) {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({});
  const contentInitialized = useRef(false);

  useEffect(() => {
    if (editorRef.current && !contentInitialized.current) {
      // If content is markdown (doesn't start with HTML tags), convert it
      let content = initialContent || '';
      if (content && !content.trim().startsWith('<') && (content.includes('**') || content.includes('##') || content.includes('\n\n'))) {
        content = markdownToHtml(content);
        onChange(content); // Update parent state with HTML
      }
      editorRef.current.innerHTML = content;
      contentInitialized.current = true;
    }
  }, [initialContent, onChange]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const checkFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      h1: document.queryCommandValue('formatBlock') === 'h1',
      h2: document.queryCommandValue('formatBlock') === 'h2',
      h3: document.queryCommandValue('formatBlock') === 'h3',
      p: document.queryCommandValue('formatBlock') === 'p',
    });
  };

  const execCommand = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    setTimeout(checkFormats, 10);
    handleInput();
  };

  const toggleHeading = (tag) => {
    const current = document.queryCommandValue('formatBlock');
    if (current.toLowerCase() === tag.toLowerCase()) {
      execCommand('formatBlock', 'P');
    } else {
      execCommand('formatBlock', tag);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px', border: '1px solid var(--a-border)', borderRadius: '10px', background: 'var(--a-card2)' }}>
      {/* Toolbar */}
      <div style={{ position: 'sticky', top: '-1.25rem', zIndex: 100, padding: '0.5rem 0.75rem', background: '#0d1511', borderBottom: '1px solid rgba(34, 197, 94, 0.22)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
        
        {/* Text Styles */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', gap: '1px' }}>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }} style={{ width: '24px', height: '24px', fontWeight: 'bold', cursor: 'pointer', background: activeFormats.bold ? '#16a34a' : 'transparent', color: '#fff', border: 'none', borderRadius: '4px' }}>B</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }} style={{ width: '24px', height: '24px', fontStyle: 'italic', cursor: 'pointer', background: activeFormats.italic ? '#16a34a' : 'transparent', color: '#fff', border: 'none', borderRadius: '4px' }}>I</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('underline'); }} style={{ width: '24px', height: '24px', textDecoration: 'underline', cursor: 'pointer', background: activeFormats.underline ? '#16a34a' : 'transparent', color: '#fff', border: 'none', borderRadius: '4px' }}>U</button>
        </div>

        {/* Headings */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', gap: '1px' }}>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); toggleHeading('H1'); }} style={{ width: '26px', height: '24px', cursor: 'pointer', background: activeFormats.h1 ? '#16a34a' : 'transparent', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>H1</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); toggleHeading('H2'); }} style={{ width: '26px', height: '24px', cursor: 'pointer', background: activeFormats.h2 ? '#16a34a' : 'transparent', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>H2</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); toggleHeading('H3'); }} style={{ width: '26px', height: '24px', cursor: 'pointer', background: activeFormats.h3 ? '#16a34a' : 'transparent', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>H3</button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('formatBlock', 'P'); }} style={{ width: '22px', height: '24px', cursor: 'pointer', background: activeFormats.p ? '#16a34a' : 'transparent', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>P</button>
        </div>

        {/* Lists */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', gap: '1px' }}>
          <button type="button" title="Bullet List" onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }} style={{ width: '24px', height: '24px', cursor: 'pointer', background: 'transparent', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px' }}>•</button>
          <button type="button" title="Numbered List" onMouseDown={(e) => { e.preventDefault(); execCommand('insertOrderedList'); }} style={{ width: '24px', height: '24px', cursor: 'pointer', background: 'transparent', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>1.</button>
        </div>

        <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />

        {/* Clear & Code */}
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('removeFormat'); }} style={{ height: '24px', padding: '0 8px', cursor: 'pointer', background: 'rgba(239, 68, 68, 0.12)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '5px', fontSize: '11px', fontWeight: 600 }}>Clear Format</button>
      </div>

      {/* Editor Content Area */}
      <div 
        className="blog-post-page"
        style={{ flex: 1, overflowY: 'auto', background: 'var(--clr-bg-alt)', padding: 0, minHeight: '0' }}
      >
        <div 
          ref={editorRef}
          className="blog-markdown-content"
          contentEditable
          onInput={handleInput}
          onKeyUp={checkFormats}
          onMouseUp={checkFormats}
          style={{
            minHeight: '100%',
            padding: '2rem',
            outline: 'none',
            color: 'var(--clr-text)',
          }}
        />
      </div>
    </div>
  );
}
