function formatText(text: string) {
  // LaTeX ko saaf karna \[ \] \( \) hatana
  let clean = text
    .replace(/\\\[/g, '').replace(/\\\]/g, '')
    .replace(/\\\(/g, '').replace(/\\\)/g, '')
    .replace(/\\mathbb\{N\}/g, 'N')
    .replace(/\\mathbb\{R\}/g, 'R')
    .replace(/\\mathbb\{C\}/g, 'C')
    .replace(/\\to/g, '→')
    .replace(/\\in/g, '∈');

  return clean.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    let l = line.replace(/^###\s*/, '').replace(/^\#\#\s*/, '');
    const parts = l.split(/(\*\*.*?\*\*)/g);
    return (
      <div key={i} style={{ marginBottom: 6, lineHeight: '1.7' }}>
        {parts.map((p, j) => p.startsWith('**') ? <b key={j}>{p.slice(2,-2)}</b> : <span key={j}>{p.replace(/\*/g,'')}</span>)}
      </div>
    );
  });
}
