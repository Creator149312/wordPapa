"use client";

export default function GlobalError({ error, reset }) {
  const handleReloadPage = () => {
    window.location.reload();
  };

  return (
    <html>
      <body>
        <h1>Something went wrong!</h1>
        <button onClick={handleReloadPage}>Try again</button>
      </body>
    </html>
  );
}
