"use client"; // Error components must be Client Components
import { Button } from "@components/ui/button";

export default function Error({ error, reset }) {
  const handleReloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl">Something went wrong!</h2>
      <Button onClick={handleReloadPage} variant={searchcustom}>
        Try again
      </Button>
    </div>
  );
}
