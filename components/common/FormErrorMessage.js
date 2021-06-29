export default function FormErrorMessage({ message }) {
  return <div style={{ margin: "0.75rem 0" }}>
    <span className="text-bold" style={{ color: 'red' }}>{message}</span>
  </div>
}