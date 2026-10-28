function formatPrice(price, currency) {
  if (typeof price !== 'number' || !Number.isFinite(price)) return 'Check brand for price'
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 2,
  }).format(price)
}

export default function ProductCard({ product, onAdd, onOpenDetails, adding }) {
  const hasPrice = typeof product.price === 'number' && Number.isFinite(product.price)
  const canAddToBag = hasPrice || !product.productUrl

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <button
          className="product-image-link"
          type="button"
          onClick={() => onOpenDetails(product._id)}
          aria-label={`View details for ${product.name}`}
        >
          <img
            className="product-image"
            src={product.image}
            alt={product.imageAlt || product.name}
            loading="lazy"
          />
        </button>
        {canAddToBag ? (
          <button
            className="quick-add"
            onClick={() => onAdd(product._id)}
            type="button"
            disabled={adding}
          >
            {adding ? 'Adding…' : 'Add to bag'} <span aria-hidden="true">↗</span>
          </button>
        ) : product.productUrl ? (
          <a className="quick-add" href={product.productUrl} target="_blank" rel="noreferrer">
            View at brand <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
      <div className="product-copy">
        <div className="product-details">
          {product.brand?.name && <p className="product-brand">{product.brand.name}</p>}
          <h3>
            <button className="product-title-link" type="button" onClick={() => onOpenDetails(product._id)}>
              {product.name}
            </button>
          </h3>
          <p>{product.desc}</p>
        </div>
        <div className="product-price">
          <span>{hasPrice ? formatPrice(product.price, product.currency) : 'Price on request'}</span>
          {product.productUrl && (
            <a href={product.productUrl} target="_blank" rel="noreferrer">Check brand price</a>
          )}
        </div>
      </div>
    </article>
  )
}
