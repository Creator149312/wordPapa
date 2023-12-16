'use client' // Error components must be Client Components
 
export default function Error({ error, reset }) {

    const handleReloadPage = () => {
        window.location.reload();
      }

  return (
    <div className="text-center">
      <h2>Something went wrong!</h2>
      <button
        onClick={handleReloadPage}
        className="custom-button"
      >
        Try again
      </button>
    </div>
  )
}