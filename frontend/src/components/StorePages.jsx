import { useEffect, useState } from 'react'
import { api } from '../services/api.js'
import productCategories, { productMatchesCategory } from '../data/product-categories.js'
import { formatPKR, toPKR } from '../utils/currency.js'
import ProductCard from './ProductCard.jsx'
import { CartSkeleton, OrderListSkeleton, ProductGridSkeleton } from './LoadingSkeletons.jsx'

const categories = [
  { value: 'all', label: 'Shop all' },
  ...productCategories,
]

function subtotalFor(cart) {
  return cart.reduce((total, item) => (
    total + (toPKR(item.product?.price, item.product?.currency) ?? 0) * item.quantity
  ), 0)
}

function orderSubtotalFor(order) {
  return (order.totalsByCurrency || []).reduce((total, entry) => (
    total + (toPKR(entry.total, entry.currency) ?? 0)
  ), 0)
}

function FormField({ label, name, type = 'text', required = true, autoComplete, defaultValue }) {
  return (
    <label className="store-field">
      {label}
      <input name={name} type={type} required={required} autoComplete={autoComplete} defaultValue={defaultValue} />
    </label>
  )
}

export function ShopPage({ products, loading, error, onRetry, onAdd, onOpenDetails, addingProduct, initialCategory, initialQuery }) {
  const [query, setQuery] = useState(initialQuery || '')
  const [category, setCategory] = useState(categories.some((item) => item.value === initialCategory) ? initialCategory : 'all')
  const [brand, setBrand] = useState('all')
  const [sort, setSort] = useState('featured')
  const brands = [...new Set(products.map((product) => product.brand?.name).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right))
  const categoryLabel = productCategories.find((item) => item.value === category)?.label
  const visibleProducts = products.filter((product) => {
    const searchText = `${product.name} ${product.desc} ${product.brand?.name || ''}`.toLowerCase()
    return (category === 'all' || productMatchesCategory(product.category, category))
      && (brand === 'all' || product.brand?.name === brand)
      && (!query.trim() || searchText.includes(query.trim().toLowerCase()))
  }).sort((left, right) => {
    if (sort === 'price-low' || sort === 'price-high') {
      const leftPrice = toPKR(left.price, left.currency) ?? Number.POSITIVE_INFINITY
      const rightPrice = toPKR(right.price, right.currency) ?? Number.POSITIVE_INFINITY
      if (leftPrice === rightPrice) return 0
      if (leftPrice === Number.POSITIVE_INFINITY) return 1
      if (rightPrice === Number.POSITIVE_INFINITY) return -1
      const priceDifference = leftPrice - rightPrice
      return sort === 'price-low' ? priceDifference : -priceDifference
    }
    if (sort === 'name') return left.name.localeCompare(right.name)
    return 0
  })

  return (
    <section className="store-page collection-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">The collection</p>
          <h1 className="page-title">{categoryLabel ? `Shop ${categoryLabel.toLowerCase()}` : 'Find your next favorite'}<span>.</span></h1>
        </div>
        <p className="section-description">Browse everyday finds from selected global brands and independent labels.</p>
      </div>
      <div className="collection-toolbar">
        <p>{visibleProducts.length} {visibleProducts.length === 1 ? 'piece' : 'pieces'} <span>of {products.length}</span></p>
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="Find something…" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search products" />
        </label>
        <label className="sort-field">
          <span>Sort by</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products">
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
      <nav className="collection-categories" aria-label="Filter by collection">
        {categories.map((item) => (
          <button className={`collection-category${category === item.value ? ' is-active' : ''}`} type="button" aria-pressed={category === item.value} key={item.value} onClick={() => setCategory(item.value)}>
            <span>{item.label}</span>
            <small>{item.value === 'all' ? products.length : products.filter((product) => productMatchesCategory(product.category, item.value)).length}</small>
          </button>
        ))}
      </nav>
      {brands.length > 0 && (
        <div className="brand-filters" aria-label="Filter by brand">
          <button className={`brand-filter${brand === 'all' ? ' is-active' : ''}`} type="button" aria-pressed={brand === 'all'} onClick={() => setBrand('all')}>All brands</button>
          {brands.map((name) => <button className={`brand-filter${brand === name ? ' is-active' : ''}`} type="button" aria-pressed={brand === name} key={name} onClick={() => setBrand(name)}>{name}</button>)}
        </div>
      )}
      {loading && <ProductGridSkeleton />}
      {!loading && error && <div className="collection-state state-error" role="alert"><p>We couldn’t reach the collection.</p><span>{error}</span><button className="text-button" type="button" onClick={onRetry}>Try again</button></div>}
      {!loading && !error && !visibleProducts.length && (
        <div className="collection-state">
          <p>No pieces found.</p>
          <span>Try another search or clear your filters to explore the full collection.</span>
          <button className="text-button" type="button" onClick={() => { setQuery(''); setCategory('all'); setBrand('all') }}>Clear filters</button>
        </div>
      )}
      {!loading && !error && visibleProducts.length > 0 && (
        <div className="product-grid">
          {visibleProducts.map((product) => <ProductCard key={product._id} product={product} onAdd={onAdd} onOpenDetails={onOpenDetails} adding={addingProduct === product._id} />)}
        </div>
      )}
    </section>
  )
}

export function AuthPage({ mode, onSubmit, busy, error, onNavigate, nextPath }) {
  const isSignup = mode === 'signup'
  async function submit(event) {
    event.preventDefault()
    const details = Object.fromEntries(new FormData(event.currentTarget).entries())
    await onSubmit(isSignup ? 'register' : 'login', details)
  }

  return (
    <section className="store-page form-page">
      <div className="form-page-intro">
        <p className="eyebrow">A considered collection</p>
        <h1>{isSignup ? 'Make yourself at home.' : 'Welcome back.'}</h1>
        <p>{isSignup ? 'Create an account to keep your favorite finds close.' : 'Sign in to see your bag and order history.'}</p>
      </div>
      <form className="store-form" onSubmit={submit}>
        {isSignup ? (
          <>
            <FormField label="Username" name="username" autoComplete="username" />
            <FormField label="Email" name="email" type="email" autoComplete="email" />
          </>
        ) : <FormField label="Username or email" name="username" autoComplete="username" />}
        <FormField label="Password" name="password" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} />
        {isSignup && <p className="form-hint">Use at least 8 characters.</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-dark" type="submit" disabled={busy}>{busy ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}</button>
        <p className="form-switch">
          {isSignup ? 'Already have an account?' : 'New to forma?'}
          <button type="button" onClick={() => onNavigate(`${isSignup ? '/login' : '/signup'}${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ''}`)}>{isSignup ? 'Sign in' : 'Create an account'}</button>
        </p>
      </form>
    </section>
  )
}

export function CartPage({ cart, loading, error, actionError, actionBusy, onUpdateQuantity, onRemoveItem, onNavigate, onReload, user }) {
  const subtotal = subtotalFor(cart)
  return (
    <section className="store-page cart-page">
      <p className="eyebrow">Your selection</p>
      <h1 className="page-title">Your bag<span>.</span></h1>
      {!user && <div className="collection-state"><p>Sign in to see your saved bag.</p><button className="button button-dark" type="button" onClick={() => onNavigate('/login?next=%2Fcart')}>Sign in</button></div>}
      {user && loading && <CartSkeleton />}
      {user && error && <div className="collection-state state-error" role="alert"><p>We couldn’t load your bag.</p><span>{error}</span><button className="text-button" type="button" onClick={onReload}>Try again</button></div>}
      {user && !loading && !error && cart.length === 0 && <div className="collection-state"><p>Your bag is taking a quiet moment.</p><button className="button button-dark" type="button" onClick={() => onNavigate('/shop')}>Explore the collection</button></div>}
      {user && !loading && !error && cart.length > 0 && (
        <div className="cart-page-layout">
          <div className="cart-page-items">
            {actionError && <p className="form-error" role="alert">{actionError}</p>}
            {cart.filter((item) => item.product).map((item) => (
              <article className="cart-page-item" key={item.product._id}>
                <img src={item.product.image} alt={item.product.name} />
                <div className="cart-page-item-copy">
                  <p className="eyebrow">{item.product.brand?.name || 'Forma collection'}</p>
                  <h2>{item.product.name}</h2>
                  <p>{item.product.desc}</p>
                  <div className="cart-item-actions">
                    <div className="quantity-control" aria-label={`Quantity for ${item.product.name}`}>
                      <button type="button" aria-label={`Decrease ${item.product.name} quantity`} disabled={Boolean(actionBusy) || item.quantity <= 1} onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" aria-label={`Increase ${item.product.name} quantity`} disabled={Boolean(actionBusy)} onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="text-button danger-button" type="button" disabled={Boolean(actionBusy)} onClick={() => onRemoveItem(item.product._id)}>{actionBusy === item.product._id ? 'Removing…' : 'Remove'}</button>
                  </div>
                </div>
                <strong className="cart-page-item-price">{formatPKR(item.product.price * item.quantity, item.product.currency)}</strong>
              </article>
            ))}
          </div>
          <aside className="cart-summary">
            <p className="eyebrow">Order summary</p>
            <h2>Subtotal</h2>
            <div className="summary-totals"><strong>{formatPKR(subtotal)}</strong></div>
            <p>Shipping and any applicable taxes will be confirmed separately.</p>
            <button className="button button-dark" type="button" onClick={() => onNavigate('/checkout')}>Continue to checkout <span aria-hidden="true">↗</span></button>
            <button className="text-button continue-shopping" type="button" onClick={() => onNavigate('/shop')}>Continue shopping</button>
          </aside>
        </div>
      )}
    </section>
  )
}

export function CheckoutPage({ cart, loading, error, submissionError, user, busy, onSubmit, onNavigate }) {
  if (!user) return <section className="store-page form-page"><div className="form-page-intro"><p className="eyebrow">Checkout</p><h1>Sign in to continue.</h1><p>Your bag is saved to your account.</p></div><button className="button button-dark" type="button" onClick={() => onNavigate('/login?next=%2Fcheckout')}>Sign in</button></section>
  const subtotal = subtotalFor(cart)
  async function submit(event) {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget).entries())
    await onSubmit(values)
  }
  return (
    <section className="store-page checkout-page">
      <p className="eyebrow">Almost yours</p>
      <h1 className="page-title">Delivery details<span>.</span></h1>
      {loading && <CartSkeleton count={1} />}
      {!loading && error && <div className="collection-state state-error" role="alert"><p>We couldn’t load your bag.</p><span>{error}</span><button className="text-button" type="button" onClick={() => onNavigate('/cart')}>Back to your bag</button></div>}
      {!loading && !error && cart.length === 0 && <div className="collection-state"><p>Your bag is empty.</p><button className="button button-dark" type="button" onClick={() => onNavigate('/shop')}>Explore the collection</button></div>}
      {!loading && !error && cart.length > 0 && (
        <div className="checkout-layout">
          <form className="store-form checkout-form" onSubmit={submit}>
            {submissionError && <p className="form-error" role="alert">{submissionError}</p>}
            <div className="field-pair"><FormField label="First name" name="firstName" autoComplete="given-name" /><FormField label="Last name" name="lastName" autoComplete="family-name" /></div>
            <div className="field-pair"><FormField label="Email" name="email" type="email" autoComplete="email" /><FormField label="Phone" name="phone" type="tel" autoComplete="tel" /></div>
            <FormField label="Street address" name="address" autoComplete="street-address" />
            <FormField label="Apartment, suite, etc. (optional)" name="apartment" required={false} autoComplete="address-line2" />
            <div className="field-pair"><FormField label="City" name="city" autoComplete="address-level2" /><FormField label="State / region (optional)" name="region" required={false} autoComplete="address-level1" /></div>
            <div className="field-pair"><FormField label="Postal code" name="postalCode" autoComplete="postal-code" /><FormField label="Country" name="country" autoComplete="country-name" defaultValue="Pakistan" /></div>
            <div className="no-payment-note"><strong>Payment note</strong><span>This checkout records your order and delivery details. No online payment is collected.</span></div>
            <button className="button button-dark" type="submit" disabled={busy}>{busy ? 'Placing order…' : 'Place order'} <span aria-hidden="true">↗</span></button>
          </form>
          <aside className="cart-summary checkout-summary">
            <p className="eyebrow">Your order</p>
            {cart.filter((item) => item.product).map((item) => (
              <div className="checkout-line" key={item.product._id}><span>{item.product.name} × {item.quantity}</span><strong>{formatPKR(item.product.price * item.quantity, item.product.currency)}</strong></div>
            ))}
            <div className="summary-total-label"><span>Subtotal</span><strong>{formatPKR(subtotal)}</strong></div>
            <p>Prices are shown in Pakistani rupees. Shipping and applicable taxes will be confirmed separately.</p>
          </aside>
        </div>
      )}
    </section>
  )
}

export function AccountPage({ user, onNavigate }) {
  const [orders, setOrders] = useState([])
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    api.getOrders().then((data) => setOrders(Array.isArray(data?.orders) ? data.orders : []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setOrdersLoading(false))
    if (user.role === 'admin') {
      api.getContactMessages().then((data) => setMessages(Array.isArray(data?.messages) ? data.messages : []))
        .catch((requestError) => setError(requestError.message))
        .finally(() => setMessagesLoading(false))
    }
  }, [user])

  if (!user) return <section className="store-page form-page"><div className="form-page-intro"><p className="eyebrow">Your account</p><h1>Sign in to continue.</h1><p>Your profile and order history live here.</p></div><button className="button button-dark" type="button" onClick={() => onNavigate('/login')}>Sign in</button></section>

  return (
    <section className="store-page account-page">
      <p className="eyebrow">Your account</p>
      <h1 className="page-title">Hello, {user.username}<span>.</span></h1>
      <div className="account-profile">
        <div><span>Username</span><strong>{user.username}</strong></div>
        <div><span>Email</span><strong>{user.email}</strong></div>
      </div>
      <div className="section-heading account-section-heading"><div><p className="eyebrow">Your purchases</p><h2>Order history<span>.</span></h2></div></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {ordersLoading && !error && <OrderListSkeleton />}
      {!ordersLoading && !error && orders.length === 0 && <div className="collection-state">No orders yet. <button className="text-button" type="button" onClick={() => onNavigate('/shop')}>Explore the collection</button></div>}
      {orders.length > 0 && <div className="order-list">{orders.map((order) => (
        <article className="order-card" key={order._id}>
          <div className="order-card-heading"><div><span>Order placed</span><strong>{new Date(order.createdAt).toLocaleDateString()}</strong></div><div><span>Status</span><strong className="order-status">{order.status}</strong></div></div>
          <div className="order-products">{order.items.map((item, index) => <div className="order-product" key={`${item.product}-${index}`}><img src={item.image} alt="" /><span>{item.name} × {item.quantity}</span><strong>{formatPKR(item.unitPrice * item.quantity, item.currency)}</strong></div>)}</div>
          <div className="order-card-total"><span>Order subtotal</span><strong>{formatPKR(orderSubtotalFor(order))}</strong></div>
          <p className="order-address">{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}</p>
        </article>
      ))}</div>}
      {user.role === 'admin' && (
        <section className="admin-inbox">
          <div className="section-heading account-section-heading"><div><p className="eyebrow">Customer care</p><h2>Contact messages<span>.</span></h2></div></div>
          {messagesLoading && !error && <OrderListSkeleton count={1} />}
          {!messagesLoading && !messages.length && !error && <div className="collection-state">No messages yet.</div>}
          {messages.map((message) => <article className="contact-message-card" key={message._id}><div><strong>{message.subject}</strong><span>{message.name} · <a href={`mailto:${message.email}`}>{message.email}</a> · {new Date(message.createdAt).toLocaleString()}</span></div><p>{message.message}</p></article>)}
        </section>
      )}
    </section>
  )
}

export function AboutPage({ onNavigate }) {
  return (
    <section className="store-page editorial-page">
      <p className="eyebrow">Our approach</p>
      <h1>Make room for<br /><em>what matters.</em></h1>
      <p className="editorial-lede">Forma is a considered collection of useful, lasting things for everyday life.</p>
      <div className="editorial-columns"><p>We look for thoughtful design, honest materials, and objects that feel better the longer you live with them. Every piece in our collection is connected to its maker, with product details and current availability linked back to the original brand.</p><p>We believe a home, a wardrobe, and a daily ritual are shaped by the things we choose to keep. Our work is to make discovering those things a little more intentional.</p></div>
      <button className="button button-dark" type="button" onClick={() => onNavigate('/shop')}>Explore the collection <span aria-hidden="true">↗</span></button>
    </section>
  )
}

export function ContactPage() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setSuccess('')
    const form = event.currentTarget
    const details = Object.fromEntries(new FormData(event.currentTarget).entries())
    try {
      const result = await api.sendContactMessage(details)
      setSuccess(result?.message || 'Thank you. Your message has been received.')
      form.reset()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="store-page contact-page">
      <div className="form-page-intro"><p className="eyebrow">We’re here to help</p><h1>Let’s talk.</h1><p>Questions about the collection or an order? Send us a note and our team will be in touch.</p><p className="contact-delivery-note">Messages are securely saved for our store administrator to review.</p></div>
      <form className="store-form contact-form" onSubmit={submit}>
        <FormField label="Your name" name="name" autoComplete="name" />
        <FormField label="Email" name="email" type="email" autoComplete="email" />
        <FormField label="Subject" name="subject" />
        <label className="store-field">Message<textarea name="message" rows="6" required maxLength="5000" /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        {success && <p className="form-success" role="status">{success}</p>}
        <button className="button button-dark" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send message'} <span aria-hidden="true">↗</span></button>
      </form>
    </section>
  )
}
