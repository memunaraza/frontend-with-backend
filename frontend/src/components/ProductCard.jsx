import { formatPKR } from '../utils/currency.js'
import productCategories from '../data/product-categories.js'

export default function ProductCard({ product, onAdd, onOpenDetails, adding }) {
  const hasPrice = typeof product.price === 'number' && Number.isFinite(product.price)
  const canAddToBag = hasPrice || !product.productUrl
  const categoryLabel = productCategories.find((category) => category.value === product.category)?.label

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
        {categoryLabel && <span className="product-card-category">{categoryLabel}</span>}
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
          <span>{hasPrice ? formatPKR(product.price, product.currency) : 'Price on request'}</span>
          {product.productUrl && (
            <a href={product.productUrl} target="_blank" rel="noreferrer">View original listing</a>
          )}
        </div>
      </div>
    </article>
  )
}
