import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

function getErrorMessage(error) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

export default function BrandSection({ isAdmin }) {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [country, setCountry] = useState('')
  const [website, setWebsite] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageSource, setImageSource] = useState('')

  useEffect(() => {
    let active = true
    api.getBrands()
      .then((data) => {
        if (active) setBrands(Array.isArray(data?.brands) ? data.brands : [])
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  function resetForm() {
    setEditingId('')
    setName('')
    setDescription('')
    setCountry('')
    setWebsite('')
    setImageUrl('')
    setImageAlt('')
    setImageSource('')
  }

  function beginEdit(brand) {
    setEditingId(brand._id)
    setName(brand.name)
    setDescription(brand.description)
    setCountry(brand.country ?? '')
    setWebsite(brand.website ?? '')
    setImageUrl(brand.imageUrl ?? '')
    setImageAlt(brand.imageAlt ?? '')
    setImageSource(brand.imageSource ?? '')
    setError('')
    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setSuccess('')

    try {
      const details = { name, description, country, website, imageUrl, imageAlt, imageSource }
      if (editingId) {
        const data = await api.updateBrand(editingId, details)
        setBrands((current) => current.map((brand) => brand._id === editingId ? data.brand : brand)
          .sort((left, right) => left.name.localeCompare(right.name)))
        setSuccess('Brand updated.')
      } else {
        const data = await api.createBrand(details)
        setBrands((current) => [...current, data.brand]
          .sort((left, right) => left.name.localeCompare(right.name)))
        setSuccess('Brand created.')
      }
      resetForm()
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(brand) {
    if (!window.confirm(`Delete “${brand.name}”? This cannot be undone.`)) return

    setError('')
    setSuccess('')
    try {
      await api.deleteBrand(brand._id)
      setBrands((current) => current.filter((item) => item._id !== brand._id))
      if (editingId === brand._id) resetForm()
      setSuccess(`${brand.name} was deleted.`)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  async function handleDeleteAll() {
    if (!window.confirm('Delete every brand? This cannot be undone. Products and user accounts will not be deleted.')) return

    setError('')
    setSuccess('')
    try {
      await api.deleteAllBrands()
      setBrands([])
      resetForm()
      setSuccess('All brands were deleted.')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  return (
    <section className="brand-section" id="brands">
      <div className="section-heading">
        <div>
          <p className="eyebrow">The makers</p>
          <h2>Brands we believe in<span>.</span></h2>
        </div>
        <p className="section-description">Discover the thoughtful makers behind our collection.</p>
      </div>

      {isAdmin && (
        <div className="brand-management">
          <div className="admin-intro">
            <p className="eyebrow">Studio access</p>
            <h2>{editingId ? 'Edit brand' : 'Add a brand'}</h2>
            <p>Create, update, and remove brands in the directory.</p>
          </div>
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Brand name
              <input
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength="120"
              />
            </label>
            <label>
              Description
              <textarea
                name="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows="3"
                required
                maxLength="500"
              />
            </label>
            <label>
              Country of origin
              <input
                name="country"
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                required
                maxLength="80"
              />
            </label>
            <label>
              Official brand website
              <input
                name="website"
                type="url"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="https://"
                required
                maxLength="500"
              />
            </label>
            <label>
              Real brand image URL
              <input
                name="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://"
                required
                maxLength="1000"
              />
            </label>
            <label>
              Image description
              <input
                name="imageAlt"
                value={imageAlt}
                onChange={(event) => setImageAlt(event.target.value)}
                required
                maxLength="240"
              />
            </label>
            <label>
              Official page where the image is shown
              <input
                name="imageSource"
                type="url"
                value={imageSource}
                onChange={(event) => setImageSource(event.target.value)}
                placeholder="https://"
                required
                maxLength="500"
              />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            {success && <p className="form-success" role="status">{success}</p>}
            <div className="brand-form-actions">
              <button className="button button-dark" type="submit" disabled={busy}>
                {busy ? 'Saving…' : editingId ? 'Save changes' : 'Add brand'}
              </button>
              {editingId && (
                <button className="text-button" type="button" onClick={resetForm} disabled={busy}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {!isAdmin && error && <p className="form-error" role="alert">{error}</p>}
      {loading && <div className="collection-state">Loading brands…</div>}
      {!loading && !error && brands.length === 0 && (
        <div className="collection-state">The brand directory is taking shape. Check back soon.</div>
      )}
      {!loading && brands.length > 0 && (
        <>
          <div className="brand-grid">
            {brands.map((brand) => (
              <article className="brand-card" key={brand._id}>
              <a className="brand-image-link" href={brand.website} target="_blank" rel="noreferrer">
                <img className="brand-image" src={brand.imageUrl} alt={brand.imageAlt} loading="lazy" />
              </a>
              <p className="eyebrow">{brand.country || 'International design'}</p>
              <h3><a href={brand.website} target="_blank" rel="noreferrer">{brand.name}</a></h3>
              <p>{brand.description}</p>
              {brand.imageSource && (
                <a className="brand-image-credit" href={brand.imageSource} target="_blank" rel="noreferrer">
                  Image source: official brand site
                </a>
              )}
                {isAdmin && (
                  <div className="brand-card-actions">
                    <button className="text-button" type="button" onClick={() => beginEdit(brand)}>Edit</button>
                    <button className="text-button danger-button" type="button" onClick={() => handleDelete(brand)}>Delete</button>
                  </div>
                )}
              </article>
            ))}
          </div>
          {isAdmin && (
            <button className="text-button danger-button delete-all-brands" type="button" onClick={handleDeleteAll}>
              Delete all brands
            </button>
          )}
        </>
      )}
    </section>
  )
}
