"use client"
import React, { useEffect } from 'react';
import { Toaster, useToasts } from 'react-hot-toast';

function DelayedNotification() {
  const { addToast } = useToasts();

  useEffect(() => {
    let timeoutId;

    const showToastWithDelay = () => {
      timeoutId = setTimeout(() => {
        addToast('This is a delayed toast!', {
          duration: 3000 // Specify the duration in milliseconds
        });
      }, 2000); // Delay of 2000 milliseconds (2 seconds)
    };

    showToastWithDelay();

    // Cleanup function to clear the timeout when the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, [addToast]);

  return (
   <></>
  );
}

export default DelayedToastExample;
