import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

export default function AdminProductForm({ onCreate, busy, error, success }) {
  const [brands, setBrands] = useState([])
  const [brandsError, setBrandsError] = useState('')

  useEffect(() => {
    let active = true
    api.getBrands()
      .then((data) => {
        if (active) setBrands(Array.isArray(data?.brands) ? data.brands : [])
      })
      .catch((requestError) => {
        if (active) setBrandsError(requestError.message || 'Unable to load brands.')
      })
    return () => { active = false }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    if (await onCreate(formData)) form.reset()
  }

  return (
    <section className="admin-section" id="add-product">
      <div className="admin-intro">
        <p className="eyebrow">Studio access</p>
        <h2>Add a new piece</h2>
        <p>Bring another thoughtful find into the collection.</p>
      </div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Brand
          <select name="brandId" defaultValue="">
            <option value="">Independent / unbranded</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>{brand.name}</option>
            ))}
          </select>
        </label>
        <label>
          Product name
          <input name="name" required maxLength="120" />
        </label>
        <label>
          Description
          <textarea name="desc" rows="3" required maxLength="500" />
        </label>
        <div className="product-price-fields">
          <label>
            Price
            <input name="price" type="number" min="0" step="0.01" required />
          </label>
          <label>
            Currency
            <select name="currency" defaultValue="USD">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </label>
        </div>
        <label>
          Product image file
          <input name="image" type="file" accept="image/*" />
        </label>
        <label>
          Or image URL (HTTPS)
          <input name="imageUrl" type="url" placeholder="https://" />
        </label>
        <label>
          Image description
          <input name="imageAlt" maxLength="240" />
        </label>
        <label>
          Official product page
          <input name="productUrl" type="url" placeholder="https://" />
        </label>
        {brandsError && <p className="form-error" role="alert">{brandsError}</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        {success && <p className="form-success" role="status">{success}</p>}
        <button className="button button-dark" type="submit" disabled={busy}>
          {busy ? 'Adding…' : 'Add to collection'}
        </button>
      </form>
    </section>
  )
}
