export default function Button({ children, onClick, type = 'button', variant = 'primary', disabled }) {
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variantClass}`}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {children}
    </button>
  )
}
