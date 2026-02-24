export default function Button({ children, onClick, type = 'button', variant = 'primary', disabled }) {
  const bg = variant === 'primary' ? '#1a1a1a' : '#f9f9f9'
  const color = variant === 'primary' ? '#fff' : '#213547'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        borderRadius: 8,
        border: '1px solid transparent',
        padding: '10px 16px',
        fontSize: 16,
        fontWeight: 600,
        backgroundColor: bg,
        color,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      {children}
    </button>
  )
}
