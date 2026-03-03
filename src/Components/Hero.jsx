export default function Hero({ children, full = false }) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: full ? '100vh' : '60vh',
        background: 'linear-gradient( rgba(0,0,0,0.55), rgba(0,0,0,0.55) ), url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop) center/cover no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px'
      }}
    >
      {children}
    </div>
  )
}
