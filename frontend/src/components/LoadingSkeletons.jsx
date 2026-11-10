function SkeletonBlock({ className = '' }) {
  return <span className={`skeleton-block ${className}`.trim()} aria-hidden="true" />
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid skeleton-grid" role="status" aria-label="Loading products">
      {Array.from({ length: count }, (_, index) => (
        <article className="product-card skeleton-product-card" key={index} aria-hidden="true">
          <SkeletonBlock className="skeleton-product-image" />
          <div className="skeleton-product-copy">
            <SkeletonBlock className="skeleton-line skeleton-brand-line" />
            <SkeletonBlock className="skeleton-line skeleton-title-line" />
            <SkeletonBlock className="skeleton-line skeleton-description-line" />
            <SkeletonBlock className="skeleton-line skeleton-price-line" />
          </div>
        </article>
      ))}
      <span className="visually-hidden">Loading products…</span>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <section className="product-detail-page skeleton-detail" role="status" aria-label="Loading product details">
      <SkeletonBlock className="skeleton-line skeleton-back-line" />
      <div className="product-detail-layout">
        <SkeletonBlock className="skeleton-detail-image" />
        <div className="skeleton-detail-copy" aria-hidden="true">
          <SkeletonBlock className="skeleton-line skeleton-brand-line" />
          <SkeletonBlock className="skeleton-line skeleton-detail-title" />
          <SkeletonBlock className="skeleton-line skeleton-detail-short" />
          <SkeletonBlock className="skeleton-line skeleton-detail-price" />
          <SkeletonBlock className="skeleton-line skeleton-detail-description" />
          <SkeletonBlock className="skeleton-line skeleton-detail-description" />
          <SkeletonBlock className="skeleton-detail-button" />
        </div>
      </div>
      <span className="visually-hidden">Loading product details…</span>
    </section>
  )
}

export function CartSkeleton({ count = 2 }) {
  return (
    <div className="skeleton-cart-layout" role="status" aria-label="Loading your bag">
      <div className="skeleton-cart-items">
        {Array.from({ length: count }, (_, index) => (
          <div className="skeleton-cart-item" key={index} aria-hidden="true">
            <SkeletonBlock className="skeleton-cart-image" />
            <div className="skeleton-cart-copy">
              <SkeletonBlock className="skeleton-line skeleton-brand-line" />
              <SkeletonBlock className="skeleton-line skeleton-title-line" />
              <SkeletonBlock className="skeleton-line skeleton-description-line" />
            </div>
            <SkeletonBlock className="skeleton-line skeleton-cart-price" />
          </div>
        ))}
      </div>
      <aside className="skeleton-cart-summary" aria-hidden="true">
        <SkeletonBlock className="skeleton-line skeleton-brand-line" />
        <SkeletonBlock className="skeleton-line skeleton-summary-title" />
        <SkeletonBlock className="skeleton-line skeleton-summary-total" />
        <SkeletonBlock className="skeleton-summary-button" />
      </aside>
      <span className="visually-hidden">Loading your bag…</span>
    </div>
  )
}

export function BrandGridSkeleton({ count = 3 }) {
  return (
    <div className="brand-grid skeleton-brand-grid" role="status" aria-label="Loading brands">
      {Array.from({ length: count }, (_, index) => (
        <article className="brand-card skeleton-brand-card" key={index} aria-hidden="true">
          <SkeletonBlock className="skeleton-brand-image" />
          <SkeletonBlock className="skeleton-line skeleton-brand-line" />
          <SkeletonBlock className="skeleton-line skeleton-title-line" />
          <SkeletonBlock className="skeleton-line skeleton-description-line" />
          <SkeletonBlock className="skeleton-line skeleton-description-line" />
        </article>
      ))}
      <span className="visually-hidden">Loading brands…</span>
    </div>
  )
}

export function OrderListSkeleton({ count = 2 }) {
  return (
    <div className="order-list skeleton-order-list" role="status" aria-label="Loading order history">
      {Array.from({ length: count }, (_, index) => (
        <article className="order-card skeleton-order-card" key={index} aria-hidden="true">
          <SkeletonBlock className="skeleton-line skeleton-order-heading" />
          <SkeletonBlock className="skeleton-line skeleton-order-row" />
          <SkeletonBlock className="skeleton-line skeleton-order-row" />
          <SkeletonBlock className="skeleton-line skeleton-order-total" />
        </article>
      ))}
      <span className="visually-hidden">Loading order history…</span>
    </div>
  )
}
