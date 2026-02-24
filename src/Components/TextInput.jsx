import { useId } from 'react'

export default function TextInput({ label, type = 'text', value, onChange, placeholder, name, required }) {
  const id = useId()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
      {label ? <label htmlFor={id} style={{ fontSize: 14 }}>{label}</label> : null}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        required={required}
        style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}
      />
    </div>
  )
}
