import { formatPKR, toPKR } from '../utils/currency.js'
import { CartSkeleton } from './LoadingSkeletons.jsx'

export default function CartDrawer({
  cart,
  loading,
  error,
  actionError,
  actionBusy,
  onClose,
  onSignIn,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  requiresAuth,
}) {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => {
    const product = item.product
    return total + (toPKR(product?.price, product?.currency) ?? 0) * item.quantity
  }, 0)

  return (
    <div className="drawer-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="drawer-heading">
          <div>
            <p className="eyebrow">Your selection</p>
            <h2 id="cart-title">Your bag <span>({itemCount})</span></h2>
          </div>
          <div className="drawer-heading-actions">
            {cart.length > 0 && (
              <button
                className="text-button danger-button"
                type="button"
                onClick={onClearCart}
                disabled={Boolean(actionBusy)}
              >
                {actionBusy === 'clear' ? 'Clearing…' : 'Clear bag'}
              </button>
            )}
            <button className="modal-close" type="button" onClick={onClose} aria-label="Close bag">×</button>
          </div>
        </div>

        {loading && <CartSkeleton count={1} />}
        {error && (
          <div className="drawer-message">
            <p className="form-error" role="alert">{error}</p>
            {requiresAuth && <button className="text-button drawer-sign-in" type="button" onClick={onSignIn}>Sign in or create an account</button>}
          </div>
        )}
        {!loading && !error && cart.length === 0 && (
          <div className="empty-cart">
            <span aria-hidden="true">✳</span>
            <p>Your bag is taking a quiet moment.</p>
            <button className="text-button" type="button" onClick={onClose}>Explore the collection</button>
          </div>
        )}

        {!loading && cart.length > 0 && (
          <div className="cart-items">
            {actionError && <p className="form-error cart-action-error" role="alert">{actionError}</p>}
            {cart.map((item) => item.product && (
              <article className="cart-item" key={item.product._id}>
                <img src={item.product.image} alt="" />
                <div className="cart-item-copy">
                  <h3>{item.product.name}</h3>
                  {item.product.brand?.name && <p className="cart-item-brand">{item.product.brand.name}</p>}
                  <p>{item.product.desc}</p>
                  <div className="cart-item-actions">
                    <div className="quantity-control" aria-label={`Quantity for ${item.product.name}`}>
                      <button
                        type="button"
                        aria-label={`Decrease ${item.product.name} quantity`}
                        disabled={Boolean(actionBusy) || item.quantity <= 1}
                        onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${item.product.name} quantity`}
                        disabled={Boolean(actionBusy)}
                        onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-button danger-button"
                      type="button"
                      disabled={Boolean(actionBusy)}
                      onClick={() => onRemoveItem(item.product._id)}
                    >
                      {actionBusy === item.product._id ? 'Updating…' : 'Remove'}
                    </button>
                  </div>
                  {typeof item.product.price === 'number' && (
                    <span>{formatPKR(item.product.price * item.quantity, item.product.currency)}</span>
                  )}
                </div>
              </article>
            ))}
            {subtotal > 0 && (
              <div className="cart-totals" aria-label="Bag subtotal">
                <span>Subtotal</span>
                <strong>{formatPKR(subtotal)}</strong>
              </div>
            )}
            <p className="cart-note">Prices shown in Pakistani rupees.</p>
          </div>
        )}
      </aside>
    </div>
  )
}
