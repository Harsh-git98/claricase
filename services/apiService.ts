import { Message, GeminiResponse, User, CaseThread } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://reprompttserver.onrender.com/lawxora';

// Image compression utility
const compressImage = async (base64: string, maxWidth = 1024, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed.split(',')[1]);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = `data:image/jpeg;base64,${base64}`;
  });
};

// Helper function for API calls with credentials
const apiCall = async (endpoint: string, options: RequestInit = {}, timeout = 120000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important for session cookies
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `API call failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
};

// ==================== AUTH SERVICES ====================

export const checkAuthStatus = async (): Promise<{ 
  authenticated: boolean; 
  user?: User; 
  threads?: CaseThread[] 
}> => {
  try {
    return await apiCall('/auth/me');
  } catch (error) {
    console.error('Auth check failed:', error);
    return { authenticated: false };
  }
};

export const logout = async (): Promise<void> => {
  await apiCall('/auth/logout', {
    method: 'POST',
  });
};

// ==================== AI SERVICES ====================

export const processUserTurn = async (
  history: Message[],
  userInput: string,
  imageBase64: string | null,
  isThinkingMode: boolean
): Promise<GeminiResponse> => {
  if (!userInput || userInput.trim() === "") {
    throw new Error("Message cannot be empty");
  }

  let optimizedImage = imageBase64;
  
  if (imageBase64) {
    try {
      console.log('Original image size:', Math.round(imageBase64.length / 1024), 'KB');
      optimizedImage = await compressImage(imageBase64, 1024, 0.7);
      console.log('Compressed image size:', Math.round(optimizedImage.length / 1024), 'KB');
      
      if (optimizedImage.length > 2 * 1024 * 1024) {
        console.log('Image still large, compressing further...');
        optimizedImage = await compressImage(imageBase64, 800, 0.5);
        console.log('Final image size:', Math.round(optimizedImage.length / 1024), 'KB');
      }
    } catch (error) {
      console.error('Image compression failed:', error);
      throw new Error('Failed to process image. Please try a smaller image.');
    }
  }

  const recentHistory = history.slice(-20).map(msg => ({
    role: msg.role,
    content: typeof msg.content === 'string' 
      ? msg.content.substring(0, 5000)
      : '[Non-text content]',
  }));

  const payload = {
    history: recentHistory,
    userInput: userInput.trim().substring(0, 5000),
    imageBase64: optimizedImage,
    isThinkingMode,
  };

  const payloadStr = JSON.stringify(payload);
  const payloadSize = new Blob([payloadStr]).size;
  const payloadMB = payloadSize / (1024 * 1024);
  
  console.log('Payload breakdown:');
  console.log('- History entries:', recentHistory.length);
  console.log('- Image included:', !!optimizedImage);
  console.log('- Total size:', Math.round(payloadSize / 1024), 'KB', `(${payloadMB.toFixed(2)}MB)`);
  
  if (payloadMB > 45) {
    throw new Error(`Payload too large (${payloadMB.toFixed(2)}MB). Please start a new case or use a smaller image.`);
  }

  return apiCall('/api/process-message', {
    method: 'POST',
    body: payloadStr,
  }, 120000);
};

// ==================== THREAD SERVICES ====================

export const createThread = async (userId: string): Promise<CaseThread> => {
  return apiCall('/api/threads', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
};

export const updateThread = async (threadId: string, updatedData: Partial<CaseThread>): Promise<CaseThread> => {
  return apiCall(`/api/threads/${threadId}`, {
    method: 'PATCH',
    body: JSON.stringify(updatedData),
  });
};

export const getUserThreads = async (userId: string): Promise<CaseThread[]> => {
  return apiCall(`/api/users/${userId}/threads`);
};