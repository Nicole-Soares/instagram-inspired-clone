import '../../../style/SubmitButton.css'

export default function SubmitButton({ loading, children, ...props }) {
  return (
    <button className='submit-button' {...props} disabled={loading}>
      {loading ? <span className="button-spinner"></span> : children}
    </button>
  );
}
