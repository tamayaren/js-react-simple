import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { articles, groups } from './content';
import './style.css';

const oldRoutes = { introduction: 'welcome', 'quick-start': 'first-steps' };

function getRoute() {
  const route = location.hash.slice(1).split('/')[0] || 'welcome';
  return oldRoutes[route] || route;
}

function CodeBlock({ children }) {
  const [copyLabel, setCopyLabel] = useState('Copy code');

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(children);
      setCopyLabel('Copied!');
      window.setTimeout(() => setCopyLabel('Copy code'), 1600);
    } catch {
      setCopyLabel('Select and copy');
    }
  }

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>Example</span>
        <button onClick={copyCode}>{copyLabel}</button>
      </div>
      <pre><code>{children}</code></pre>
    </div>
  );
}

function Demo({ type }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Maya');

  if (type === 'counter') {
    return (
      <div className="demo" aria-label="Interactive counter example">
        <p className="demo-label">LIVE EXAMPLE</p>
        <p className="demo-value">You clicked <strong>{count}</strong> {count === 1 ? 'time' : 'times'}.</p>
        <div className="demo-actions">
          <button className="button-primary" onClick={() => setCount(value => value + 1)}>Add one</button>
          <button className="button-quiet" onClick={() => setCount(0)}>Reset</button>
        </div>
      </div>
    );
  }

  return (
    <div className="demo" aria-label="Interactive input example">
      <p className="demo-label">LIVE EXAMPLE</p>
      <label htmlFor="name-demo">Type your name</label>
      <input id="name-demo" value={name} onChange={event => setName(event.target.value)} />
      <p className="demo-value">Hello, <strong>{name || 'friend'}</strong>!</p>
    </div>
  );
}

function Sidebar({ route, menuOpen, closeMenu }) {
  return (
    <aside id="lesson-menu" className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="sidebar-heading">
        <span>LEARNING PATH</span>
        <p>Start at the top, or pick what you need.</p>
      </div>
      <nav aria-label="Lessons">
        {groups.map(group => (
          <div className="nav-group" key={group.name}>
            <p className="nav-group-title">{group.name}</p>
            <p className="nav-group-label">{group.label}</p>
            {articles.filter(article => article.group === group.name).map(article => {
              const lessonNumber = articles.indexOf(article) + 1;
              return (
                <a
                  href={`#${article.id}`}
                  key={article.id}
                  aria-current={route === article.id ? 'page' : undefined}
                  onClick={closeMenu}
                >
                  <span>{String(lessonNumber).padStart(2, '0')}</span>
                  {article.title}
                </a>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="sidebar-note">
        <span aria-hidden="true">☕</span>
        <p>Take your time.<br />Small steps still move you forward.</p>
      </div>
    </aside>
  );
}

function Search({ query, setQuery, inputRef }) {
  const cleanQuery = query.trim().toLowerCase();
  const results = cleanQuery
    ? articles.filter(article => [article.title, article.desc, ...article.intro].join(' ').toLowerCase().includes(cleanQuery))
    : [];

  return (
    <div className="search">
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input
        ref={inputRef}
        type="search"
        aria-label="Search lessons"
        placeholder="Search lessons"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <kbd>⌘ K</kbd>
      {cleanQuery && (
        <div className="search-results">
          <p>{results.length ? `${results.length} ${results.length === 1 ? 'lesson' : 'lessons'}` : 'No lessons found'}</p>
          {results.map(article => (
            <a href={`#${article.id}`} key={article.id} onClick={() => setQuery('')}>
              <span>{article.group}</span>
              <strong>{article.title}</strong>
              <small>{article.desc}</small>
            </a>
          ))}
          {!results.length && <small>Try “variables”, “click”, or “React”.</small>}
        </div>
      )}
    </div>
  );
}

function WelcomeCards() {
  return (
    <div className="path-cards" aria-label="Learning paths">
      <a href="#variables">
        <span className="path-icon js-icon">JS</span>
        <div><strong>Learn JavaScript</strong><small>Start with variables and functions</small></div>
        <span aria-hidden="true">→</span>
      </a>
      <a href="#dom">
        <span className="path-icon web-icon">⌁</span>
        <div><strong>Make a web page work</strong><small>Change the page and handle clicks</small></div>
        <span aria-hidden="true">→</span>
      </a>
      <a href="#components">
        <span className="path-icon react-icon">⚛</span>
        <div><strong>Try React</strong><small>Build components after the basics</small></div>
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

function Lesson({ article }) {
  const index = articles.indexOf(article);
  const previous = articles[index - 1];
  const next = articles[index + 1];

  return (
    <>
      <div className="lesson-topline">
        <span>{article.group}</span>
        <span>Lesson {index + 1} of {articles.length}</span>
      </div>
      <div className="progress" aria-label={`Lesson ${index + 1} of ${articles.length}`}>
        <span style={{ width: `${((index + 1) / articles.length) * 100}%` }} />
      </div>

      <article>
        <header className="article-header">
          <p className="eyebrow">LESSON {String(index + 1).padStart(2, '0')}</p>
          <h1>{article.title}</h1>
          <p className="subtitle">{article.desc}</p>
          <div className="intro">
            {article.intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </header>

        {article.id === 'welcome' && <WelcomeCards />}

        <section className="analogy" aria-labelledby="analogy-title">
          <span className="analogy-icon" aria-hidden="true">✦</span>
          <div>
            <p className="section-label">REAL-LIFE EXAMPLE</p>
            <h2 id="analogy-title">{article.analogy.title}</h2>
            <p>{article.analogy.text}</p>
          </div>
        </section>

        <section aria-labelledby="example-title">
          <p className="section-label">SEE IT IN CODE</p>
          <h2 id="example-title">A small example</h2>
          <p className="section-intro">Read it once from top to bottom. You do not need to understand every symbol yet.</p>
          <CodeBlock>{article.syntax}</CodeBlock>
          {article.demo && <Demo type={article.demo} />}
        </section>

        <section aria-labelledby="breakdown-title">
          <p className="section-label">STEP BY STEP</p>
          <h2 id="breakdown-title">What the important parts do</h2>
          <div className="breakdown">
            {article.breakdown.map(([code, explanation], itemIndex) => (
              <div key={code}>
                <span>{itemIndex + 1}</span>
                <div><code>{code}</code><p>{explanation}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="try-it" aria-labelledby="try-title">
          <span className="try-number" aria-hidden="true">▶</span>
          <div>
            <p className="section-label">YOUR TURN</p>
            <h2 id="try-title">Try one small change</h2>
            <p>{article.tryIt}</p>
          </div>
        </section>

        <section className="remember" aria-labelledby="remember-title">
          <p className="section-label">ONE THING TO REMEMBER</p>
          <h2 id="remember-title">{article.remember}</h2>
        </section>

        <a className="source-link" href={article.source} target="_blank" rel="noreferrer">
          Read more in the official docs <span aria-hidden="true">↗</span>
        </a>
      </article>

      <nav className="pagination" aria-label="Lesson navigation">
        {previous ? (
          <a href={`#${previous.id}`}>
            <small>← Previous</small>
            <strong>{previous.title}</strong>
          </a>
        ) : <span />}
        {next && (
          <a href={`#${next.id}`}>
            <small>Next lesson →</small>
            <strong>{next.title}</strong>
          </a>
        )}
      </nav>
    </>
  );
}

function App() {
  const [route, setRoute] = useState(getRoute);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const mainRef = useRef(null);
  const article = articles.find(item => item.id === route);

  useEffect(() => {
    function navigate() {
      setRoute(getRoute());
      setMenuOpen(false);
      setQuery('');
      window.scrollTo(0, 0);
      mainRef.current?.focus();
    }

    function handleKeydown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === 'Escape') {
        setQuery('');
        setMenuOpen(false);
      }
    }

    addEventListener('hashchange', navigate);
    addEventListener('keydown', handleKeydown);
    return () => {
      removeEventListener('hashchange', navigate);
      removeEventListener('keydown', handleKeydown);
    };
  }, []);

  useEffect(() => {
    document.title = `${article?.title || 'Lesson not found'} — Tiny Steps`;
  }, [article]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to lesson</a>
      <header className="site-header">
        <a className="brand" href="#welcome" aria-label="Tiny Steps home">
          <span className="brand-mark">{'{ }'}</span>
          <span><strong>Tiny Steps</strong><small>JavaScript for beginners</small></span>
        </a>
        <Search query={query} setQuery={setQuery} inputRef={searchRef} />
        <button
          className="menu-button"
          aria-controls="lesson-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(value => !value)}
        >
          {menuOpen ? 'Close' : 'Lessons'}
        </button>
      </header>

      <div className="page-layout">
        <Sidebar route={route} menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
        {menuOpen && <button className="menu-backdrop" aria-label="Close lesson menu" onClick={() => setMenuOpen(false)} />}
        <main id="main-content" ref={mainRef} tabIndex="-1">
          {article ? <Lesson article={article} /> : (
            <div className="not-found">
              <p className="eyebrow">404</p>
              <h1>That lesson is not here.</h1>
              <p>It may have moved while the site was being simplified.</p>
              <a className="button-primary" href="#welcome">Go to the first lesson</a>
            </div>
          )}
          <footer>
            <strong>Tiny Steps</strong>
            <span>Made for curious beginners.</span>
          </footer>
        </main>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
