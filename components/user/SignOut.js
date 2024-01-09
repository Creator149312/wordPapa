// components/SignOut.js
import { signOut } from 'next-auth/react';

const SignOut = () => {
  const handleSignOut = (e) => {
    e.preventDefault();
    signOut();
  };

  return (
    <a href="#" onClick={handleSignOut}>Sign out</a>
  );
};

export default SignOut;
