function formatPrice(price, currency) {
  if (typeof price !== 'number' || !Number.isFinite(price)) return 'Price on request'
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 2,
  }).format(price)
}

export default function ProductDetail({
  product,
  loading,
  error,
  onBack,
  onAddToCart,
  adding,
}) {
  if (loading) {
    return <section className="product-detail-state" aria-live="polite">Loading product details…</section>
  }

  if (error || !product) {
    return (
      <section className="product-detail-state" role="alert">
        <p>{error || 'Product not found.'}</p>
        <button className="button button-dark" type="button" onClick={onBack}>Back to collection</button>
      </section>
    )
  }

  return (
    <div className="product-detail-page">
      <button className="detail-back-link" type="button" onClick={onBack}>
        <span aria-hidden="true">←</span> Back to collection
      </button>
      <div className="product-detail-layout">
        <div className="product-detail-image-wrap">
          <img
            className="product-detail-image"
            src={product.image}
            alt={product.imageAlt || product.name}
          />
        </div>
        <section className="product-detail-copy" aria-labelledby="product-detail-title">
          {product.brand?.name && (
            <p className="eyebrow product-detail-brand">{product.brand.name}</p>
          )}
          <h1 id="product-detail-title">{product.name}</h1>
          {product.brand?.country && <p className="product-detail-origin">{product.brand.country}</p>}
          <p className="product-detail-price">{formatPrice(product.price, product.currency)}</p>
          <p className="product-detail-description">{product.desc}</p>
          <button
            className="button button-dark product-detail-add"
            type="button"
            onClick={() => onAddToCart(product._id)}
            disabled={adding}
          >
            {adding ? 'Adding to bag…' : 'Add to bag'}
            <span aria-hidden="true">↗</span>
          </button>
          <p className="product-detail-note">
            Prices and availability may change. Visit the brand for the latest information.
          </p>
          {product.productUrl && (
            <a className="product-detail-brand-link" href={product.productUrl} target="_blank" rel="noreferrer">
              View product at {product.brand?.name || 'the brand'} <span aria-hidden="true">↗</span>
            </a>
          )}
          {product.priceSource && (
            <p className="product-detail-source">
              Price source:{' '}
              <a href={product.priceSource} target="_blank" rel="noreferrer">official brand listing</a>
              {product.priceCheckedAt && (
                <> · checked {new Date(product.priceCheckedAt).toLocaleDateString()}</>
              )}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
