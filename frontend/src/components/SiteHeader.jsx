export default function SiteHeader({
  user,
  cartCount,
  isProductDetail,
  onNavigateCollection,
  onOpenCart,
  onOpenAuth,
  onSignOut,
}) {
  function navigateFromDetail(event) {
    if (!isProductDetail) return
    event.preventDefault()
    onNavigateCollection()
  }

  return (
    <header className="site-header">
      <a className="brand" href="/" onClick={navigateFromDetail} aria-label="Forma home">
        <span className="brand-mark" aria-hidden="true">f.</span>
        <span>forma<span className="brand-period">.</span></span>
      </a>

      <nav className="main-nav" aria-label="Main navigation">
        <a href="/#collection" onClick={navigateFromDetail}>Collection</a>
        <a href="/#story">Our approach</a>
      </nav>

      <div className="header-actions">
        {user ? (
          <div className="account-actions">
            <span className="welcome-label">Hi, {user.username}</span>
            {user.role === 'admin' && (
              <>
                <a className="admin-link" href="#brands">Manage brands</a>
                <a className="admin-link" href="#add-product">Add a piece</a>
              </>
            )}
            <button className="text-button" onClick={onSignOut} type="button">Sign out</button>
          </div>
        ) : (
          <button className="text-button sign-in-button" onClick={onOpenAuth} type="button">
            Sign in
          </button>
        )}
        <button className="cart-button" onClick={onOpenCart} type="button" aria-label={`Open bag, ${cartCount} items`}>
          <span className="bag-icon" aria-hidden="true">Bag</span>
          <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </header>
  )
}
