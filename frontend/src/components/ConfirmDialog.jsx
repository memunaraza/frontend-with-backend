import { useEffect, useRef } from 'react'

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}) {
  const cancelButtonRef = useRef(null)
  const cancelHandlerRef = useRef(onCancel)
  const busyRef = useRef(busy)

  useEffect(() => {
    cancelHandlerRef.current = onCancel
    busyRef.current = busy
  }, [busy, onCancel])

  useEffect(() => {
    cancelButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape' && !busyRef.current) cancelHandlerRef.current()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div
      className="confirm-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel()
      }}
    >
      <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-message">
        <p className="eyebrow">Please confirm</p>
        <h2 id="confirm-dialog-title">{title}</h2>
        <p id="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button ref={cancelButtonRef} className="button confirm-cancel" type="button" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button
            className={`button ${destructive ? 'confirm-destructive' : 'button-dark'}`}
            type="button"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
