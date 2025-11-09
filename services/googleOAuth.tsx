// This file simulates the '@react-oauth/google' library for demonstration purposes.
import React, { createContext } from 'react';

// In a real library, this context would hold the Google Auth instance.
const GoogleOAuthContext = createContext({});

export const GoogleOAuthProvider: React.FC<{ children: React.ReactNode; clientId: string }> = ({ children, clientId }) => {
  // In a real library, this component would initialize the Google Sign-In client
  // using the provided clientId and make it available via context.
  console.log('GoogleOAuthProvider initialized with clientId:', clientId);
  return <GoogleOAuthContext.Provider value={{}}>{children}</GoogleOAuthContext.Provider>;
};

interface TokenResponse {
  access_token: string;
}

interface UseGoogleLoginOptions {
  onSuccess: (tokenResponse: TokenResponse) => void;
  onError?: () => void;
}

/**
 * A mock of the `useGoogleLogin` hook.
 * @param options - Configuration for the login flow, including success and error callbacks.
 * @returns A function that, when called, initiates the simulated login process.
 */
export const useGoogleLogin = ({ onSuccess, onError }: UseGoogleLoginOptions) => {
  return () => {
    // This function simulates opening the Google login pop-up.
    console.log('Simulating Google Login pop-up...');
    
    // Simulate a successful login after a short delay.
    setTimeout(() => {
      const mockTokenResponse: TokenResponse = {
        access_token: `mock_gsi_access_token_${Date.now()}`,
      };
      console.log('Simulated login success, invoking onSuccess callback.');
      onSuccess(mockTokenResponse);
    }, 800);
  };
};

/**
 * A mock of the `googleLogout` function.
 */
export const googleLogout = () => {
  // In a real library, this would sign the user out of their Google account
  // for this application and clear any stored tokens.
  console.log('Simulating Google Logout.');
};