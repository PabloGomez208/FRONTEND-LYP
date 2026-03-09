import { useId } from 'react'

export default function TextInput({ label, type = 'text', value, onChange, placeholder, name, required }) {
  const id = useId()
  return (
    <div className="input-group">
      {label ? <label htmlFor={id} className="input-label">{label}</label> : null}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        required={required}
        className="input-field"
      />
    </div>
  )
}
