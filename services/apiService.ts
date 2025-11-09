import { Message, GeminiResponse, User, CaseThread } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API call failed: ${response.statusText}`);
  }

  return response.json();
};

// Gemini Service
export const processUserTurn = async (
  history: Message[],
  userInput: string,
  imageBase64: string | null,
  isThinkingMode: boolean
): Promise<GeminiResponse> => {
  return apiCall('/process-message', {
    method: 'POST',
    body: JSON.stringify({
      history,
      userInput,
      imageBase64,
      isThinkingMode,
    }),
  });
};

// Auth Service
export const authenticateWithGoogle = async (token: string): Promise<{ user: User }> => {
  return apiCall('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
};

// Database Service
export const findOrCreateUser = async (profile: Omit<User, 'id'>): Promise<{ user: User; threads: CaseThread[] }> => {
  return apiCall('/users/find-or-create', {
    method: 'POST',
    body: JSON.stringify(profile),
  });
};

export const createThread = async (userId: string): Promise<CaseThread> => {
  return apiCall('/threads', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
};

export const updateThread = async (threadId: string, updatedData: Partial<CaseThread>): Promise<CaseThread> => {
  return apiCall(`/threads/${threadId}`, {
    method: 'PATCH',
    body: JSON.stringify(updatedData),
  });
};

export const getUserThreads = async (userId: string): Promise<CaseThread[]> => {
  return apiCall(`/users/${userId}/threads`);
};