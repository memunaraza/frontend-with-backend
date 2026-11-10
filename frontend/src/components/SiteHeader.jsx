import { useState } from 'react'

export default function SiteHeader({ user, cartCount, theme, onToggleTheme, onNavigate, onOpenCart, onSignOut }) {
  const [query, setQuery] = useState(new URLSearchParams(window.location.search).get('q') || '')

  function routeLink(path) {
    return (event) => {
      event.preventDefault()
      onNavigate(path)
    }
  }

  function submitSearch(event) {
    event.preventDefault()
    const search = query.trim()
    onNavigate(search ? `/shop?q=${encodeURIComponent(search)}` : '/shop')
  }

  return (
    <>
      <div className="announcement-bar">Pakistan-wide shopping <span aria-hidden="true">•</span> All prices in PKR <span aria-hidden="true">•</span> Find something you’ll love</div>
      <header className="site-header">
        <a className="brand" href="/" onClick={routeLink('/')} aria-label="Forma home">
          <span className="brand-mark" aria-hidden="true">f.</span>
          <span>forma<span className="brand-period">.</span></span>
        </a>
        <form className="header-search" role="search" onSubmit={submitSearch}>
          <label className="visually-hidden" htmlFor="store-search">Search the store</label>
          <input
            id="store-search"
            type="search"
            placeholder="Search products, brands and more"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" aria-label="Search">⌕</button>
        </form>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="/shop" onClick={routeLink('/shop')}>Shop</a>
          <a href="/about" onClick={routeLink('/about')}>About</a>
          <a href="/contact" onClick={routeLink('/contact')}>Contact</a>
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
            <span className="theme-toggle-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
          {user ? (
            <div className="account-actions">
              <a className="welcome-label" href="/account" onClick={routeLink('/account')}>Hi, {user.username}</a>
              <button className="text-button" onClick={onSignOut} type="button">Sign out</button>
            </div>
          ) : (
            <a className="text-button sign-in-button" href="/login" onClick={routeLink('/login')}>Sign in</a>
          )}
          <button className="cart-button" onClick={onOpenCart} type="button" aria-label={`Open bag, ${cartCount} items`}>
            <span className="bag-icon" aria-hidden="true">Bag</span>
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>
    </>
  )
}
