// import { User } from '../types';

// // This is a mock authentication service. In a real application,
// // this would interact with the Google OAuth2 API.

// export const login = (): Promise<User> => {
//   return new Promise((resolve) => {
//     // Simulate a successful login
//     setTimeout(() => {
//       // FIX: Added missing 'id' and 'googleId' properties to the user object to match the User type.
//       const mockGoogleId = `mock-google-id-${Date.now()}`;
//       const user: User = {
//         id: mockGoogleId,
//         googleId: mockGoogleId,
//         name: 'Jane Doe',
//         email: 'jane.doe@example.com',
//         picture: `https://i.pravatar.cc/150?u=${Date.now()}`, // Using a placeholder image service
//       };
//       resolve(user);
//     }, 500);
//   });
// };

// export const logout = (): void => {
//   // In a real app, you would clear tokens or session data here.
//   console.log('User logged out');
// };
