import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { articles, groups } from './content';
import './style.css';

const getRoute = () => location.hash.slice(1).split('/')[0] || 'introduction';
function Code({ children }) {
  const [status, setStatus] = useState('Copy');
  async function copy() {
    try { await navigator.clipboard.writeText(children); setStatus('Copied!'); }
    catch { setStatus('Select to copy'); }
  }
  return <div className="code"><div className="code-bar"><span>JavaScript <span className="muted">/ JSX where shown</span></span><button onClick={copy} aria-live="polite">{status}</button></div><pre><code>{children.split('\n').map((line, i) => <span key={i} className={line.trim().startsWith('//') ? 'comment' : ''}>{line}{'\n'}</span>)}</code></pre></div>;
}
function Demo({ type }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Alex');
  return <div className="demo"><span className="eyebrow">LIVE EXAMPLE</span>{type === 'counter' ? <><p>Each click queues an update. React renders the new count.</p><button className="primary" onClick={() => setCount(c => c + 1)}>Count: {count} <span>+</span></button><button className="text-button" onClick={() => setCount(0)}>Reset</button></> : <><label htmlFor="demo-name">Your name</label><input id="demo-name" value={name} onChange={e => setName(e.target.value)} /><p>Hello, {name || 'friend'}!</p></>}</div>;
}
function App() {
  const [route, setRoute] = useState(getRoute);
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('Python');
  const [menu, setMenu] = useState(false);
  const searchRef = useRef(null);
  const articleRef = useRef(null);
  const article = articles.find(a => a.id === route);
  const index = articles.indexOf(article);
  const results = articles.filter(a => JSON.stringify(a).toLowerCase().includes(query.toLowerCase().trim()));
  useEffect(() => {
    function navigate() { setRoute(getRoute()); setMenu(false); setQuery(''); window.scrollTo(0, 0); articleRef.current?.focus(); }
    function shortcut(e) { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); searchRef.current?.focus(); } if (e.key === 'Escape') { setQuery(''); setMenu(false); } }
    addEventListener('hashchange', navigate); addEventListener('keydown', shortcut);
    return () => { removeEventListener('hashchange', navigate); removeEventListener('keydown', shortcut); };
  }, []);
  useEffect(() => { document.title = `${article?.title || 'Page not found'} — Fieldnotes`; }, [article]);
  return <><a className="skip" href="#main-content" onClick={e => { e.preventDefault(); articleRef.current?.focus(); }}>Skip to content</a>
    <header><a href="#introduction" className="brand"><span className="brand-icon">f.</span>fieldnotes<span className="brand-divider">/</span><span className="brand-sub">JavaScript & React</span></a><div className="search-wrap"><span className="search-icon">⌕</span><input ref={searchRef} type="search" placeholder="Search the docs…" aria-label="Search documentation" value={query} onChange={e => setQuery(e.target.value)} /><kbd>Ctrl K</kbd>{query.trim() && <div className="search-results" aria-label="Search results"><div className="search-summary" role="status">{results.length} result{results.length !== 1 ? 's' : ''}</div>{results.map(a => <a key={a.id} href={`#${a.id}`} onClick={() => setQuery('')}><small>{a.group}</small><strong>{a.title}</strong><span>{a.desc}</span></a>)}{!results.length && <p>No matches. Try “state”, “arrays”, or “props”.</p>}</div>}</div><a className="header-link" href="https://github.com/tamayaren/js-react-simple">GitHub ↗</a><button className="mobile-toggle" aria-expanded={menu} aria-controls="sidebar" onClick={() => setMenu(!menu)}>Menu</button></header>
    <div className="layout"><aside id="sidebar" className={`sidebar ${menu ? 'open' : ''}`}><div className="edition"><span className="status-dot"/> THE BEGINNER’S REFERENCE</div><nav aria-label="Documentation">{groups.map(group => <div className="nav-group" key={group}><h2>{group === 'JavaScript' ? <span className="language-icon js">JS</span> : group === 'React' ? <span className="language-icon react">⚛</span> : null}{group}</h2>{articles.filter(a => a.group === group).map(a => <a key={a.id} href={`#${a.id}`} aria-current={route === a.id ? 'page' : undefined} onClick={() => setMenu(false)}>{a.title}{a.tag === 'Watch out' && <span className="quirk-dot" title="Common pitfalls"/>}</a>)}</div>)}</nav><div className="sidebar-note"><span>Small steps. Solid foundations.</span><p>You don’t need to memorize everything. That’s what a reference is for.</p></div></aside>
      <main id="main-content" ref={articleRef} tabIndex={-1}>{!article ? <><h1>Page not found</h1><p>This article does not exist.</p><a href="#introduction">Back to introduction →</a></> : <><div className="breadcrumb">Docs <span>/</span> {article.group} <span>/</span> <b>{article.title}</b></div><div className="article-meta"><span className={`tag ${article.tag === 'Watch out' ? 'warning-tag' : ''}`}>{article.tag}</span><span>{Math.max(2, Math.ceil(JSON.stringify(article).split(' ').length / 180))} min read</span></div><h1>{article.title}</h1><p className="subtitle">{article.desc}</p><p className="intro">{article.intro}</p>
      {article.id === 'introduction' && <div className="start-cards"><a href="#variables"><span className="language-icon js">JS</span><h3>Learn JavaScript <span>↗</span></h3><p>The language underneath it all.</p><small>9 focused references →</small></a><a href="#components"><span className="language-icon react">⚛</span><h3>Understand React <span>↗</span></h3><p>Turn your data into an interface.</p><small>8 concepts & patterns →</small></a></div>}
      <section id="mental-model"><div className="analogy"><span className="analogy-icon">◈</span><div><h2>A way to think about it</h2><p>{article.analogy}</p></div></div></section>
      {article.diagram && <figure className="diagram"><div>{article.diagram.map((step, i) => <React.Fragment key={step}>{i > 0 && <span className="arrow" aria-hidden="true">→</span>}<span className="diagram-step"><small>0{i + 1}</small>{step}</span></React.Fragment>)}</div><figcaption>{article.id === 'objects' ? 'Two outer objects can share a nested object.' : 'Follow the idea, one step at a time.'}</figcaption></figure>}
      <section id="syntax"><h2>{article.id === 'introduction' ? 'A first look' : 'Syntax & example'}</h2><p className="section-lead">{article.id === 'introduction' ? 'Same language. A different job.' : 'A small example to make the idea concrete.'}</p><Code key={`code-${article.id}`} >{article.syntax}</Code>{article.demo && <Demo key={`demo-${article.id}`} type={article.demo}/>}</section>
      <section id="reference"><h2>{article.id === 'introduction' ? 'Know the pieces' : 'At a glance'}</h2><div className="reference-table">{article.details.map(([name, desc]) => <div key={name}><h3>{name}</h3><p>{desc}</p></div>)}</div></section>
      <section id="comparison"><div className="section-heading"><h2>Coming from {language}?</h2><label><span className="sr-only">Comparison language</span><select value={language} onChange={e => setLanguage(e.target.value)}>{['Python', 'Ren’Py', 'C#'].map(l => <option key={l}>{l}</option>)}</select></label></div><div className="comparison"><span className="comparison-label">A FAMILIAR CONNECTION</span><p>{article.compare[language]}</p><small>Useful parallels, not exact equivalents.</small></div></section>
      <section id="pitfalls" className="pitfall"><span className="pitfall-icon">!</span><div><h2>The part that trips people up</h2><p>{article.pitfall}</p></div></section>
      <section id="further-reading" className="further"><span>Go a little deeper</span><a href={article.source} target="_blank" rel="noreferrer">{article.group === 'React' || article.id === 'introduction' ? 'React documentation' : 'MDN Web Docs'} ↗</a>{language === 'Ren’Py' && <a href="https://www.renpy.org/doc/html/screens.html" target="_blank" rel="noreferrer">Ren’Py screens reference ↗</a>}</section><div className="pagination">{index > 0 ? <a href={`#${articles[index - 1].id}`}><small>← Previous</small><strong>{articles[index - 1].title}</strong></a> : <span/>}{index < articles.length - 1 && <a href={`#${articles[index + 1].id}`}><small>Up next →</small><strong>{articles[index + 1].title}</strong></a>}</div><footer><span>fieldnotes <span className="footer-dot">·</span> Built for the learning curve.</span><span>An independent beginner’s reference.</span></footer></>}</main>
      <aside className="toc" aria-label="On this page"><h2>On this page</h2>{[['mental-model','Mental model'],['syntax','Syntax & example'],['reference','At a glance'],['comparison','Language comparison'],['pitfalls','Common pitfalls'],['further-reading','Further reading']].map(([id, text]) => <a key={id} href={`#${route}/${id}`} onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'start'}); }}>{text}</a>)}<div className="toc-note"><span>LEARN AT YOUR PACE</span><p>Read a little.<br/>Try an example.<br/>Make it your own.</p></div><div className="version">Modern JavaScript<br/>React function components</div></aside></div></>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
