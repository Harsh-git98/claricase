import { Message, GeminiResponse, User, CaseThread, Note } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://reprompttserver.onrender.com/lawxora';

// ==================== FILE PROCESSING UTILITIES ====================

interface ProcessedFile {
  type: 'image' | 'pdf' | 'document';
  base64: string;
  mimeType: string;
  size: number;
}

// Enhanced image compression with quality preservation
const compressImage = async (
  base64: string, 
  maxWidth = 1024, 
  quality = 0.8,
  format: 'jpeg' | 'png' = 'jpeg'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      
      // Calculate optimal dimensions
      const aspectRatio = width / height;
      if (width > maxWidth) {
        width = maxWidth;
        height = maxWidth / aspectRatio;
      }
      if (height > maxWidth) {
        height = maxWidth;
        width = maxWidth * aspectRatio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d', { alpha: format === 'png' });
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // White background for JPEG
      if (format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const compressed = canvas.toDataURL(mimeType, quality);
      resolve(compressed.split(',')[1]);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = `data:image/jpeg;base64,${base64}`;
  });
};

// Process PDF files - extract text or send as-is
const processPDF = async (file: File): Promise<ProcessedFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      const size = Math.round(base64.length / 1024);
      
      console.log(`PDF size: ${size}KB`);
      
      // PDFs over 5MB should be warned
      if (size > 5 * 1024) {
        reject(new Error('PDF too large. Please use files under 5MB.'));
        return;
      }
      
      resolve({
        type: 'pdf',
        base64,
        mimeType: 'application/pdf',
        size
      });
    };
    reader.onerror = () => reject(new Error('Failed to read PDF'));
    reader.readAsDataURL(file);
  });
};

// Process Word documents (.doc, .docx)
const processDocument = async (file: File): Promise<ProcessedFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      const size = Math.round(base64.length / 1024);
      
      console.log(`Document size: ${size}KB`);
      
      if (size > 10 * 1024) {
        reject(new Error('Document too large. Please use files under 10MB.'));
        return;
      }
      
      resolve({
        type: 'document',
        base64,
        mimeType: file.type,
        size
      });
    };
    reader.onerror = () => reject(new Error('Failed to read document'));
    reader.readAsDataURL(file);
  });
};

// Universal file processor
export const processFile = async (file: File): Promise<ProcessedFile> => {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  console.log('Processing file:', fileName, fileType);
  
  // Image files
  if (fileType.startsWith('image/')) {
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = (e) => resolve((e.target?.result as string).split(',')[1]);
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });
    
    const base64 = await base64Promise;
    const format = fileType.includes('png') ? 'png' : 'jpeg';
    
    // Intelligent compression based on file size
    let compressed = base64;
    const originalSize = Math.round(base64.length / 1024);
    
    console.log(`Original image size: ${originalSize}KB`);
    
    if (originalSize > 2048) { // > 2MB
      compressed = await compressImage(base64, 1024, 0.7, format);
    } else if (originalSize > 1024) { // > 1MB
      compressed = await compressImage(base64, 1400, 0.8, format);
    } else if (originalSize > 512) { // > 512KB
      compressed = await compressImage(base64, 1600, 0.85, format);
    }
    
    const finalSize = Math.round(compressed.length / 1024);
    console.log(`Compressed image size: ${finalSize}KB`);
    
    return {
      type: 'image',
      base64: compressed,
      mimeType: `image/${format}`,
      size: finalSize
    };
  }
  
  // PDF files
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return processPDF(file);
  }
  
  // Word documents
  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileType === 'application/msword' ||
    fileName.endsWith('.docx') ||
    fileName.endsWith('.doc')
  ) {
    return processDocument(file);
  }
  
  // Text files
  if (fileType.startsWith('text/') || fileName.endsWith('.txt')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const base64 = btoa(unescape(encodeURIComponent(text)));
        resolve({
          type: 'document',
          base64,
          mimeType: 'text/plain',
          size: Math.round(base64.length / 1024)
        });
      };
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  }
  
  throw new Error(`Unsupported file type: ${fileType || 'unknown'}. Supported: images, PDFs, Word documents, text files.`);
};

// ==================== API HELPER ====================

const apiCall = async (endpoint: string, options: RequestInit = {}, timeout = 120000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const token = localStorage.getItem("lexora_token");

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : "",
        ...options.headers,
      },
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
  await apiCall('/auth/logout', { method: 'POST' });
};

// ==================== AI SERVICES ====================

export const processUserTurn = async (
  history: Message[],
  userInput: string,
  fileData: ProcessedFile | null,
  isThinkingMode: boolean
): Promise<GeminiResponse> => {
  if (!userInput || userInput.trim() === "") {
    throw new Error("Message cannot be empty");
  }

  // Prepare history (last 20 messages, truncated)
  const recentHistory = history.slice(-20).map(msg => ({
    role: msg.role,
    content: typeof msg.content === 'string' 
      ? msg.content.substring(0, 5000)
      : '[Non-text content]',
  }));

  const payload = {
    history: recentHistory,
    userInput: userInput.trim().substring(0, 5000),
    fileData: fileData ? {
      type: fileData.type,
      base64: fileData.base64,
      mimeType: fileData.mimeType
    } : null,
    isThinkingMode,
  };

  const payloadStr = JSON.stringify(payload);
  const payloadSize = new Blob([payloadStr]).size;
  const payloadMB = payloadSize / (1024 * 1024);
  
  console.log('Payload breakdown:');
  console.log('- History entries:', recentHistory.length);
  console.log('- File included:', fileData ? `${fileData.type} (${fileData.size}KB)` : 'none');
  console.log('- Total size:', Math.round(payloadSize / 1024), 'KB', `(${payloadMB.toFixed(2)}MB)`);
  
  if (payloadMB > 45) {
    throw new Error(`Payload too large (${payloadMB.toFixed(2)}MB). Please start a new case or use a smaller file.`);
  }

  return apiCall('/api/process-message', {
    method: 'POST',
    body: payloadStr,
  }, 150000); // 150s timeout for large files
};

// ==================== QUICKCHAT SERVICES ====================

export const processQuickChatMessage = async (
  history: Message[],
  userInput: string,
  fileData: ProcessedFile | null,
  isThinkingMode: boolean
): Promise<GeminiResponse> => {
  if (!userInput || userInput.trim() === "") {
    throw new Error("Message cannot be empty");
  }

  const recentHistory = history.slice(-10).map(msg => ({
    role: msg.role,
    content: typeof msg.content === 'string' 
      ? msg.content.substring(0, 2000)
      : '[Non-text content]',
  }));

  const payload = {
    history: recentHistory,
    userInput: userInput.trim().substring(0, 2000),
    fileData: fileData ? {
      type: fileData.type,
      base64: fileData.base64,
      mimeType: fileData.mimeType
    } : null,
    isThinkingMode,
  };

  return apiCall('/api/quickchat', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, 60000);
};

export const saveQuickChatAsThread = async (
  messages: Message[],
  title?: string
): Promise<CaseThread> => {
  return apiCall('/api/quickchat/save', {
    method: 'POST',
    body: JSON.stringify({ messages, title }),
  });
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

// ==================== NOTES SERVICES ====================

export const getNotes = async (): Promise<Note[]> => {
  return apiCall('/api/notes');
};

export const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
  return apiCall('/api/notes', {
    method: 'POST',
    body: JSON.stringify(noteData),
  });
};

export const updateNote = async (noteId: string, updates: Partial<Note>): Promise<Note> => {
  return apiCall(`/api/notes/${noteId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

export const deleteNote = async (noteId: string): Promise<void> => {
  await apiCall(`/api/notes/${noteId}`, {
    method: 'DELETE',
  });
};