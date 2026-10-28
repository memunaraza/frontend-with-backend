import { useState } from 'react'

export default function AuthModal({ onClose, onSubmit, busy, error }) {
  const [mode, setMode] = useState('login')
  const isRegister = mode === 'register'

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const details = Object.fromEntries(formData.entries())
    await onSubmit(mode, details)
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close dialog">×</button>
        <p className="eyebrow">A considered collection</p>
        <h2 id="auth-title">{isRegister ? 'Create your account' : 'Welcome back'}</h2>
        <p className="modal-intro">
          {isRegister ? 'Join us to keep your favorite finds close.' : 'Sign in to pick up where you left off.'}
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Username
              <input autoComplete="username" name="username" required minLength="2" />
            </label>
          )}
          {isRegister && (
            <label>
              Email
              <input autoComplete="email" name="email" type="email" required />
            </label>
          )}
          {!isRegister && (
            <label>
              Username or email
              <input autoComplete="username" name="username" required />
            </label>
          )}
          <label>
            Password
            <input autoComplete={isRegister ? 'new-password' : 'current-password'} name="password" type="password" required minLength={isRegister ? 8 : undefined} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark form-submit" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>
        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : 'New to forma?'}
          <button type="button" onClick={() => setMode(isRegister ? 'login' : 'register')}>
            {isRegister ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </section>
    </div>
  )
}
