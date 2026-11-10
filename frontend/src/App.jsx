import { useCallback, useEffect, useState } from 'react'
import { api } from './services/api.js'
import AdminProductForm from './components/AdminProductForm.jsx'
import BrandSection from './components/BrandSection.jsx'
import AuthModal from './components/AuthModal.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import { ProductGridSkeleton } from './components/LoadingSkeletons.jsx'
import ProductCard from './components/ProductCard.jsx'
import ProductDetail from './components/ProductDetail.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import productCategories from './data/product-categories.js'
import {
  AboutPage,
  AccountPage,
  AuthPage,
  CartPage,
  CheckoutPage,
  ContactPage,
  ShopPage,
} from './components/StorePages.jsx'
import './App.css'
import './MarketplaceTheme.css'

function getErrorMessage(error) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

function getProductIdFromPath(pathname) {
  const match = pathname.match(/^\/products?\/([^/]+)\/?$/)
  return match ? decodeURIComponent(match[1]) : ''
}

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [theme, setTheme] = useState(() => window.localStorage.getItem('forma-theme') === 'dark' ? 'dark' : 'light')
  const [detailResult, setDetailResult] = useState(null)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productError, setProductError] = useState('')
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [authOpen, setAuthOpen] = useState(false)
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState('')
  const [cartLoading, setCartLoading] = useState(false)
  const [cartError, setCartError] = useState('')
  const [cartActionError, setCartActionError] = useState('')
  const [cartActionBusy, setCartActionBusy] = useState('')
  const [addingProduct, setAddingProduct] = useState('')
  const [checkoutBusy, setCheckoutBusy] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [adminBusy, setAdminBusy] = useState(false)
  const [adminError, setAdminError] = useState('')
  const [adminSuccess, setAdminSuccess] = useState('')
  const [notice, setNotice] = useState('')
  const [confirmSignOut, setConfirmSignOut] = useState(false)
  const [signOutBusy, setSignOutBusy] = useState(false)

  const productId = getProductIdFromPath(pathname)
  const cartCount = cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0)

  useEffect(() => {
    window.localStorage.setItem('forma-theme', theme)
    document.documentElement.style.colorScheme = theme
    document.body.dataset.theme = theme
  }, [theme])

  const loadCart = useCallback(async () => {
    setCartLoading(true)
    setCartError('')
    setCartActionError('')
    try {
      const data = await api.getCart()
      setCart(Array.isArray(data?.cart) ? data.cart : [])
    } catch (error) {
      setCartError(getErrorMessage(error))
    } finally {
      setCartLoading(false)
    }
  }, [])

  const navigate = useCallback((path) => {
    const [nextPath] = path.split('?')
    if (`${window.location.pathname}${window.location.search}` !== path) {
      window.history.pushState({}, '', path)
    }
    setPathname(nextPath)
    if (user && (nextPath === '/cart' || nextPath === '/checkout')) void loadCart()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [loadCart, user])

  useEffect(() => {
    function syncPath() {
      const currentPath = window.location.pathname
      setPathname(currentPath)
      if (user && (currentPath === '/cart' || currentPath === '/checkout')) void loadCart()
    }
    window.addEventListener('popstate', syncPath)
    return () => window.removeEventListener('popstate', syncPath)
  }, [loadCart, user])

  useEffect(() => {
    if (!productId) return undefined
    let active = true
    api.getProduct(productId)
      .then((data) => {
        if (active) setDetailResult({ id: productId, product: data?.product ?? null, error: '' })
      })
      .catch((error) => {
        if (active) setDetailResult({ id: productId, product: null, error: getErrorMessage(error) })
      })
    return () => { active = false }
  }, [productId])

  useEffect(() => {
    let active = true
    const initialPath = window.location.pathname
    api.getCurrentUser()
      .then((data) => {
        if (active) {
          const account = data?.user ?? null
          setUser(account)
          if (account && (initialPath === '/cart' || initialPath === '/checkout')) void loadCart()
        }
      })
      .catch((error) => {
        if (active && error.status !== 401) setNotice(getErrorMessage(error))
      })
    api.getProducts()
      .then((data) => {
        if (active) setProducts(Array.isArray(data?.products) ? data.products : [])
      })
      .catch((error) => {
        if (active) setProductError(getErrorMessage(error))
      })
      .finally(() => {
        if (active) setLoadingProducts(false)
      })
    return () => { active = false }
  }, [loadCart])

  async function handleAuth(mode, details) {
    const requestedReturnPath = new URLSearchParams(window.location.search).get('next')
    setAuthBusy(true)
    setAuthError('')
    try {
      const payload = mode === 'register'
        ? await api.register(details)
        : await api.login({ username: details.username, email: details.username, password: details.password })
      const account = payload?.user
      if (!account) throw new Error('Your account could not be loaded. Please try again.')
      setUser({ username: account.username, email: account.email, role: account.role })
      setAuthOpen(false)
      setNotice(`Welcome${account.username ? `, ${account.username}` : ''}.`)
      await loadCart()
      if (pathname === '/login' || pathname === '/signup') {
        navigate(['/cart', '/checkout'].includes(requestedReturnPath) ? requestedReturnPath : '/account')
      }
    } catch (error) {
      setAuthError(getErrorMessage(error))
    } finally {
      setAuthBusy(false)
    }
  }

  async function handleAddToCart(id) {
    if (!user) {
      setAuthError('')
      setAuthOpen(true)
      setNotice('Sign in to add a piece to your bag.')
      return
    }
    setAddingProduct(id)
    setNotice('')
    try {
      const data = await api.addToCart(id)
      if (Array.isArray(data?.cart)) setCart(data.cart)
      setNotice('Added to your bag.')
    } catch (error) {
      setNotice(getErrorMessage(error))
    } finally {
      setAddingProduct('')
    }
  }

  async function handleUpdateCartItem(id, quantity) {
    setCartActionBusy(id)
    setCartActionError('')
    try {
      const data = await api.updateCartItem(id, quantity)
      setCart(Array.isArray(data?.cart) ? data.cart : [])
    } catch (error) {
      setCartActionError(getErrorMessage(error))
    } finally {
      setCartActionBusy('')
    }
  }

  async function handleRemoveCartItem(id) {
    setCartActionBusy(id)
    setCartActionError('')
    try {
      const data = await api.removeCartItem(id)
      setCart(Array.isArray(data?.cart) ? data.cart : [])
    } catch (error) {
      setCartActionError(getErrorMessage(error))
    } finally {
      setCartActionBusy('')
    }
  }

  async function handleCreateOrder(shippingAddress) {
    setCheckoutBusy(true)
    setCheckoutError('')
    try {
      const result = await api.createOrder(shippingAddress)
      setCart([])
      setNotice(result?.message || 'Your order has been received. No online payment was collected.')
      navigate('/account')
    } catch (error) {
      setCheckoutError(getErrorMessage(error))
    } finally {
      setCheckoutBusy(false)
    }
  }

  async function handleCreateProduct(formData) {
    setAdminBusy(true)
    setAdminError('')
    setAdminSuccess('')
    try {
      const data = await api.createProduct(formData)
      if (!data?.product) throw new Error('The product was created but could not be loaded.')
      setProducts((current) => [data.product, ...current])
      setAdminSuccess('Your piece is now in the collection.')
      return true
    } catch (error) {
      setAdminError(getErrorMessage(error))
      return false
    } finally {
      setAdminBusy(false)
    }
  }

  async function handleSignOut() {
    setSignOutBusy(true)
    try {
      await api.logout()
      setUser(null)
      setCart([])
      setConfirmSignOut(false)
      setNotice('You have signed out.')
      navigate('/')
    } catch (error) {
      setConfirmSignOut(false)
      setNotice(getErrorMessage(error))
    } finally {
      setSignOutBusy(false)
    }
  }

  function renderHome() {
    const featuredProduct = products.find((product) => product.category === 'furniture') || products[0]
    return (
      <>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> Your next great find starts here</p>
            <h1>Shop smart.<br /><em>Live better.</em></h1>
            <p className="hero-description">Discover everyday favorites from thoughtful brands, with clear prices in Pakistani rupees.</p>
            <button className="button button-light" type="button" onClick={() => navigate('/shop')}>Start shopping <span aria-hidden="true">↗</span></button>
            <span className="hero-footnote">Find it. Love it. Make it yours.</span>
          </div>
          <div className="hero-art">
            {featuredProduct && <img src={featuredProduct.image} alt={featuredProduct.imageAlt || featuredProduct.name} />}
            <div className="hero-art-label"><span>FEATURED FIND</span><strong>{featuredProduct?.name || 'Thoughtful finds for every day'}</strong></div>
          </div>
          <div className="hero-bottom"><span>Better finds, all in one place.</span><span>Prices shown in PKR <span aria-hidden="true">↗</span></span></div>
        </section>

        <section className="store-promises" aria-label="What makes forma different">
          <div><span aria-hidden="true">✓</span><p>Curated quality finds</p></div>
          <div><span aria-hidden="true">₨</span><p>PKR prices, no currency surprises</p></div>
          <div><span aria-hidden="true">⌕</span><p>Browse by category or search</p></div>
        </section>

        <section className="featured-collections">
          <div className="section-heading">
            <div><p className="eyebrow">Browse your way</p><h2>Shop by category<span>.</span></h2></div>
            <button className="text-button" type="button" onClick={() => navigate('/shop')}>View all categories ↗</button>
          </div>
          <div className="featured-collection-grid">
            {productCategories.map((category, index) => (
              <button className={`featured-collection-card featured-collection-${category.value}`} key={category.value} type="button" onClick={() => navigate(`/shop?category=${category.value}`)}>
                <span className="featured-collection-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="featured-collection-name">{category.label}</span>
                <span className="featured-collection-note">{category.note}</span>
                <span className="featured-collection-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </section>

        {['clothing', 'shoes'].map((category) => {
          const categoryDetails = productCategories.find((item) => item.value === category)
          const categoryProducts = products.filter((product) => product.category === category).slice(0, 4)
          if (!loadingProducts && !categoryProducts.length) return null
          return (
            <section className={`collection-section category-showcase category-showcase-${category}`} key={category}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{category === 'clothing' ? 'Fresh wardrobe finds' : 'Find your new favorites'}</p>
                  <h2>{category === 'clothing' ? 'Clothes for every day' : 'Shoes to go places'}<span>.</span></h2>
                </div>
                <button className="text-button" type="button" onClick={() => navigate(`/shop?category=${category}`)}>
                  Shop all {category} <span aria-hidden="true">↗</span>
                </button>
              </div>
              <p className="category-showcase-description">
                {category === 'clothing'
                  ? `${categoryDetails.note} — browse everyday styles from Allbirds, Kotn, and tentree.`
                  : 'Explore lightweight runners and everyday sneakers from Allbirds.'}
              </p>
              {loadingProducts ? <ProductGridSkeleton count={4} /> : <div className="product-grid">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAdd={handleAddToCart}
                    onOpenDetails={(id) => navigate(`/product/${encodeURIComponent(id)}`)}
                    adding={addingProduct === product._id}
                  />
                ))}
              </div>}
            </section>
          )
        })}

        <section className="collection-section home-featured">
          <div className="section-heading">
            <div><p className="eyebrow">Popular picks</p><h2>Good finds, right this way<span>.</span></h2></div>
            <button className="text-button" type="button" onClick={() => navigate('/shop')}>View all products ↗</button>
          </div>
          {loadingProducts && <ProductGridSkeleton />}
          {!loadingProducts && productError && <div className="collection-state state-error" role="alert"><p>We couldn’t reach the collection.</p><span>{productError}</span><button className="text-button" type="button" onClick={() => window.location.reload()}>Try again</button></div>}
          {!loadingProducts && !productError && products.length === 0 && <div className="collection-state">The collection is taking shape. Come back soon.</div>}
          {!loadingProducts && !productError && products.length > 0 && <div className="product-grid">{products.slice(0, 8).map((product) => <ProductCard key={product._id} product={product} onAdd={handleAddToCart} onOpenDetails={(id) => navigate(`/product/${encodeURIComponent(id)}`)} adding={addingProduct === product._id} />)}</div>}
        </section>

        <section className="story-section" id="story">
          <span className="story-mark" aria-hidden="true">f.</span>
          <div><p className="eyebrow">Your marketplace, made simple</p><h2>Find more.<br /><em>Choose better.</em></h2></div>
          <p className="story-copy">Browse thoughtfully selected home, fashion, and everyday pieces. Compare products, see the price in PKR, and find the right thing for you.</p>
        </section>
        {user?.role === 'admin' && <AdminProductForm onCreate={handleCreateProduct} busy={adminBusy} error={adminError} success={adminSuccess} />}
        {user?.role === 'admin' && <BrandSection isAdmin />}
      </>
    )
  }

  let page
  if (productId) {
    page = <ProductDetail product={detailResult?.id === productId ? detailResult.product : null} loading={detailResult?.id !== productId} error={detailResult?.id === productId ? detailResult.error : ''} onBack={() => navigate('/shop')} onAddToCart={handleAddToCart} adding={addingProduct === productId} />
  } else if (pathname === '/') {
    page = renderHome()
  } else if (pathname === '/shop') {
    const queryParams = new URLSearchParams(window.location.search)
    const category = queryParams.get('category')
    const query = queryParams.get('q') || ''
    page = <ShopPage products={products} loading={loadingProducts} error={productError} onRetry={() => window.location.reload()} onAdd={handleAddToCart} onOpenDetails={(id) => navigate(`/product/${encodeURIComponent(id)}`)} addingProduct={addingProduct} initialCategory={category} initialQuery={query} key={`${category || 'all'}-${query}`} />
  } else if (pathname === '/cart') {
    page = <CartPage cart={cart} loading={cartLoading} error={cartError} actionError={cartActionError} actionBusy={cartActionBusy} onUpdateQuantity={handleUpdateCartItem} onRemoveItem={handleRemoveCartItem} onNavigate={navigate} onReload={loadCart} user={user} />
  } else if (pathname === '/checkout') {
    page = <CheckoutPage cart={cart} loading={cartLoading} error={cartError} submissionError={checkoutError} user={user} busy={checkoutBusy} onSubmit={handleCreateOrder} onNavigate={navigate} />
  } else if (pathname === '/login' || pathname === '/signup') {
    page = <AuthPage mode={pathname.slice(1)} onSubmit={handleAuth} busy={authBusy} error={authError} onNavigate={navigate} nextPath={new URLSearchParams(window.location.search).get('next')} />
  } else if (pathname === '/account') {
    page = <AccountPage user={user} onNavigate={navigate} />
  } else if (pathname === '/about') {
    page = <AboutPage onNavigate={navigate} />
  } else if (pathname === '/contact') {
    page = <ContactPage />
  } else {
    page = <section className="store-page collection-state"><p>That page could not be found.</p><button className="button button-dark" type="button" onClick={() => navigate('/')}>Return home</button></section>
  }

  return (
    <div className="app-shell" id="top" data-theme={theme}>
      <SiteHeader user={user} cartCount={cartCount} theme={theme} onToggleTheme={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} onNavigate={navigate} onOpenCart={() => navigate('/cart')} onSignOut={() => setConfirmSignOut(true)} />
      <main>{page}</main>
      <footer className="site-footer">
        <button className="brand footer-brand" type="button" onClick={() => navigate('/')}><span className="brand-mark" aria-hidden="true">f.</span><span>forma<span className="brand-period">.</span></span></button>
        <p>Objects for a life well lived.</p>
        <nav className="footer-nav" aria-label="Footer navigation">
          <button type="button" onClick={() => navigate('/about')}>About</button>
          <button type="button" onClick={() => navigate('/contact')}>Contact</button>
          <button type="button" onClick={() => navigate('/shop')}>Shop</button>
        </nav>
        <span>© {new Date().getFullYear()} forma studio</span>
      </footer>
      {notice && <div className="toast" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSubmit={handleAuth} busy={authBusy} error={authError} />}
      {confirmSignOut && (
        <ConfirmDialog
          title="Sign out of your account?"
          message="You can sign back in anytime to access your account and bag."
          confirmLabel="Sign out"
          destructive
          busy={signOutBusy}
          onConfirm={handleSignOut}
          onCancel={() => setConfirmSignOut(false)}
        />
      )}
    </div>
  )
}
