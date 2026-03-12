// context/ProfileContext.js
'use client';

import React, { createContext, useContext } from 'react';
import { useWordPapaProfile } from './games/hangman/hooks/useWordPapaProfile';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const profileData = useWordPapaProfile();

  return (
    <ProfileContext.Provider value={profileData}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};