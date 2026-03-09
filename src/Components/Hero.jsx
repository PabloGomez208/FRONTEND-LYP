export default function Hero({ children, full = false }) {
  return (
    <div
      className="hero"
      style={{
        minHeight: full ? '100vh' : '60vh'
      }}
    >
      {children}
    </div>
  )
}
