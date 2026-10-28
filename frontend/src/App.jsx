import { useEffect, useMemo, useState } from 'react'
import { api } from './services/api.js'
import AdminProductForm from './components/AdminProductForm.jsx'
import BrandSection from './components/BrandSection.jsx'
import AuthModal from './components/AuthModal.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import ProductCard from './components/ProductCard.jsx'
import ProductDetail from './components/ProductDetail.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import './App.css'

function getErrorMessage(error) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

function getProductIdFromPath() {
  const match = window.location.pathname.match(/^\/products\/([^/]+)\/?$/)
  return match ? match[1] : ''
}

export default function App() {
  const [selectedProductId, setSelectedProductId] = useState(getProductIdFromPath)
  const [detailResult, setDetailResult] = useState(null)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productError, setProductError] = useState('')
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [authOpen, setAuthOpen] = useState(false)
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)
  const [cartError, setCartError] = useState('')
  const [cartActionError, setCartActionError] = useState('')
  const [cartActionBusy, setCartActionBusy] = useState('')
  const [addingProduct, setAddingProduct] = useState('')
  const [adminBusy, setAdminBusy] = useState(false)
  const [adminError, setAdminError] = useState('')
  const [adminSuccess, setAdminSuccess] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    function syncPath() {
      setSelectedProductId(getProductIdFromPath())
    }

    window.addEventListener('popstate', syncPath)
    return () => window.removeEventListener('popstate', syncPath)
  }, [])

  useEffect(() => {
    if (!selectedProductId) return undefined

    let active = true
    api.getProduct(selectedProductId)
      .then((data) => {
        if (active) {
          setDetailResult({ id: selectedProductId, product: data?.product ?? null, error: '' })
        }
      })
      .catch((error) => {
        if (!active) return
        setDetailResult({ id: selectedProductId, product: null, error: getErrorMessage(error) })
      })

    return () => { active = false }
  }, [selectedProductId])

  useEffect(() => {
    let active = true
    api.getCurrentUser()
      .then((data) => {
        if (active) setUser(data?.user ?? null)
      })
      .catch((error) => {
        if (active && error.status !== 401) {
          setNotice(getErrorMessage(error))
        }
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
  }, [])

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter((product) => {
      const brandName = product.brand?.name ?? ''
      const matchesBrand = selectedBrand === 'all' || brandName === selectedBrand
      const matchesQuery = !query || `${product.name} ${product.desc} ${brandName}`.toLowerCase().includes(query)
      return matchesBrand && matchesQuery
    })
  }, [products, search, selectedBrand])

  const productBrands = useMemo(() => [...new Set(
    products.map((product) => product.brand?.name).filter(Boolean),
  )].sort((left, right) => left.localeCompare(right)), [products])

  const cartCount = cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0)

  function handleOpenProduct(productId) {
    window.history.pushState({}, '', `/products/${encodeURIComponent(productId)}`)
    setSelectedProductId(productId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBackToCollection() {
    window.history.replaceState({}, '', '/')
    setSelectedProductId('')
    window.requestAnimationFrame(() => {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  async function handleAuth(mode, details) {
    setAuthBusy(true)
    setAuthError('')
    try {
      const payload = mode === 'register'
        ? await api.register(details)
        : await api.login({ username: details.username, email: details.username, password: details.password })
      const account = payload?.user
      if (!account) throw new Error('Your account could not be loaded. Please try again.')
      setUser({
        username: account.username,
        email: account.email,
        role: account.role,
      })
      setAuthOpen(false)
      setNotice(`Welcome${account.username ? `, ${account.username}` : ''}.`)
      await loadCart()
    } catch (error) {
      setAuthError(getErrorMessage(error))
    } finally {
      setAuthBusy(false)
    }
  }

  async function loadCart() {
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
  }

  async function handleOpenCart() {
    setCartOpen(true)
    if (!user) {
      setCart([])
      setCartError('Sign in to see your bag.')
      return
    }
    await loadCart()
  }

  async function handleAddToCart(productId) {
    if (!user) {
      setAuthError('')
      setAuthOpen(true)
      setNotice('Sign in to add a piece to your bag.')
      return
    }
    setAddingProduct(productId)
    setNotice('')
    try {
      const data = await api.addToCart(productId)
      if (Array.isArray(data?.cart)) setCart(data.cart)
      setNotice('Added to your bag.')
    } catch (error) {
      setNotice(getErrorMessage(error))
    } finally {
      setAddingProduct('')
    }
  }

  async function handleUpdateCartItem(productId, quantity) {
    setCartActionBusy(productId)
    setCartActionError('')
    try {
      const data = await api.updateCartItem(productId, quantity)
      setCart(Array.isArray(data?.cart) ? data.cart : [])
    } catch (error) {
      setCartActionError(getErrorMessage(error))
    } finally {
      setCartActionBusy('')
    }
  }

  async function handleRemoveCartItem(productId) {
    setCartActionBusy(productId)
    setCartActionError('')
    try {
      const data = await api.removeCartItem(productId)
      setCart(Array.isArray(data?.cart) ? data.cart : [])
    } catch (error) {
      setCartActionError(getErrorMessage(error))
    } finally {
      setCartActionBusy('')
    }
  }

  async function handleClearCart() {
    if (!window.confirm('Remove every item from your bag?')) return

    setCartActionBusy('clear')
    setCartActionError('')
    try {
      const data = await api.clearCart()
      setCart(Array.isArray(data?.cart) ? data.cart : [])
    } catch (error) {
      setCartActionError(getErrorMessage(error))
    } finally {
      setCartActionBusy('')
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
    try {
      await api.logout()
      setUser(null)
      setCart([])
      setCartOpen(false)
      setNotice('You have signed out.')
    } catch (error) {
      setNotice(getErrorMessage(error))
    }
  }

  return (
    <div className="app-shell" id="top">
      <SiteHeader
        user={user}
        cartCount={cartCount}
        isProductDetail={Boolean(selectedProductId)}
        onNavigateCollection={handleBackToCollection}
        onOpenCart={handleOpenCart}
        onOpenAuth={() => {
          setAuthError('')
          setAuthOpen(true)
        }}
        onSignOut={handleSignOut}
      />

      <main>
        {selectedProductId ? (
          <ProductDetail
            product={detailResult?.id === selectedProductId ? detailResult.product : null}
            loading={detailResult?.id !== selectedProductId}
            error={detailResult?.id === selectedProductId ? detailResult.error : ''}
            onBack={handleBackToCollection}
            onAddToCart={handleAddToCart}
            adding={addingProduct === selectedProductId}
          />
        ) : (
          <>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> Objects for a life well lived</p>
            <h1>Good things,<br /><em>kept close.</em></h1>
            <p className="hero-description">
              Everyday objects with a little more thought behind them. Made to be used, loved, and lived with.
            </p>
            <a className="button button-light" href="#collection">Explore the collection <span aria-hidden="true">↘</span></a>
            <span className="hero-footnote">Fewer things. Better things.</span>
          </div>
          <div className="hero-art" aria-label="A sculptural vase in warm afternoon light">
            <div className="art-sun" />
            <div className="art-arch">
              <div className="art-vase"><span /></div>
            </div>
            <span className="art-caption">Form follows feeling — No. 04</span>
            <span className="art-asterisk" aria-hidden="true">✳</span>
          </div>
          <div className="hero-bottom">
            <span>Thoughtfully found, never in a hurry.</span>
            <span>Scroll to discover <span aria-hidden="true">↓</span></span>
          </div>
        </section>

        <section className="collection-section" id="collection">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The collection</p>
              <h2>Pieces with a point of view<span>.</span></h2>
            </div>
            <p className="section-description">Real pieces from independent design brands. Price and availability can change; follow the brand link for current details.</p>
          </div>

          <div className="collection-toolbar">
            <p>{visibleProducts.length} of {products.length} products</p>
            <label className="search-field">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Find something…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search collection"
              />
            </label>
          </div>

          {productBrands.length > 0 && (
            <div className="brand-filters" aria-label="Filter by brand">
              <button
                className={`brand-filter${selectedBrand === 'all' ? ' is-active' : ''}`}
                type="button"
                aria-pressed={selectedBrand === 'all'}
                onClick={() => setSelectedBrand('all')}
              >
                All brands
              </button>
              {productBrands.map((brand) => (
                <button
                  className={`brand-filter${selectedBrand === brand ? ' is-active' : ''}`}
                  type="button"
                  aria-pressed={selectedBrand === brand}
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}

          {loadingProducts && <div className="collection-state">Gathering the collection…</div>}
          {!loadingProducts && productError && (
            <div className="collection-state state-error" role="alert">
              <p>We couldn’t reach the collection.</p>
              <span>{productError}</span>
              <button className="text-button" type="button" onClick={() => window.location.reload()}>Try again</button>
            </div>
          )}
          {!loadingProducts && !productError && visibleProducts.length === 0 && (
            <div className="collection-state">
              {products.length ? 'No products match those filters.' : 'The collection is taking shape. Come back soon.'}
            </div>
          )}
          {!loadingProducts && !productError && visibleProducts.length > 0 && (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAdd={handleAddToCart}
                  onOpenDetails={handleOpenProduct}
                  adding={addingProduct === product._id}
                />
              ))}
            </div>
          )}
        </section>

        <section className="story-section" id="story">
          <span className="story-mark" aria-hidden="true">f.</span>
          <div>
            <p className="eyebrow">A little more intentional</p>
            <h2>Make room for<br /><em>what matters.</em></h2>
          </div>
          <p className="story-copy">
            We believe the best things earn their place. Explore objects selected for their considered form, everyday usefulness, and the feeling they bring to a room.
          </p>
        </section>

        {user?.role === 'admin' && (
          <AdminProductForm
            onCreate={handleCreateProduct}
            busy={adminBusy}
            error={adminError}
            success={adminSuccess}
          />
        )}

        {user?.role === 'admin' && <BrandSection isAdmin />}
          </>
        )}
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true">f.</span><span>forma<span className="brand-period">.</span></span></a>
        <p>Objects for a life well lived.</p>
        <span>© {new Date().getFullYear()} forma studio</span>
      </footer>

      {notice && (
        <div className="toast" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message">×</button>
        </div>
      )}
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSubmit={handleAuth}
          busy={authBusy}
          error={authError}
        />
      )}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          loading={cartLoading}
          error={cartError}
          actionError={cartActionError}
          actionBusy={cartActionBusy}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={handleUpdateCartItem}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          requiresAuth={!user}
          onSignIn={() => {
            setCartOpen(false)
            setAuthError('')
            setAuthOpen(true)
          }}
        />
      )}
    </div>
  )
}