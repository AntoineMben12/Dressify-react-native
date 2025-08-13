import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: any;
  posts?: any[];
  comments?: any[];
  chats?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  private async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      const url = `${this.baseURL}${endpoint}`;

      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(name: string, email: string, password: string): Promise<ApiResponse> {
    const response = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (response.success && response.token) {
      await this.setAuthToken(response.token);
    }

    return response;
  }

  async login(email: string, password: string): Promise<ApiResponse> {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.token) {
      await this.setAuthToken(response.token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.makeRequest('/auth/logout', {
      method: 'POST',
    });

    await this.removeAuthToken();
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse> {
    return this.makeRequest('/auth/me');
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      if (!token) return false;

      const response = await this.getCurrentUser();
      return response.success;
    } catch (error) {
      return false;
    }
  }

  // Posts methods
  async createPost(content: string, images?: any[], videos?: any[], tags?: string[]): Promise<ApiResponse> {
    return this.makeRequest('/posts', {
      method: 'POST',
      body: JSON.stringify({ content, images, videos, tags }),
    });
  }

  async getPosts(page = 1, limit = 10): Promise<ApiResponse> {
    return this.makeRequest(`/posts?page=${page}&limit=${limit}`);
  }

  async getUserPosts(userId: string, page = 1, limit = 10): Promise<ApiResponse> {
    return this.makeRequest(`/posts/user/${userId}?page=${page}&limit=${limit}`);
  }

  async toggleLike(postId: string): Promise<ApiResponse> {
    return this.makeRequest(`/posts/${postId}/like`, {
      method: 'PUT',
    });
  }

  async deletePost(postId: string): Promise<ApiResponse> {
    return this.makeRequest(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // Comments methods
  async addComment(postId: string, content: string, parentComment?: string): Promise<ApiResponse> {
    return this.makeRequest('/comments', {
      method: 'POST',
      body: JSON.stringify({ postId, content, parentComment }),
    });
  }

  async getComments(postId: string, page = 1, limit = 10): Promise<ApiResponse> {
    return this.makeRequest(`/comments/${postId}?page=${page}&limit=${limit}`);
  }

  // Users methods
  async getUserProfile(userId: string): Promise<ApiResponse> {
    return this.makeRequest(`/users/${userId}`);
  }

  async updateProfile(name?: string, bio?: string, avatar?: string): Promise<ApiResponse> {
    return this.makeRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, bio, avatar }),
    });
  }

  // Chat methods
  async getChats(): Promise<ApiResponse> {
    return this.makeRequest('/chats');
  }

  async createOrGetChat(participantId: string): Promise<ApiResponse> {
    return this.makeRequest('/chats', {
      method: 'POST',
      body: JSON.stringify({ participantId }),
    });
  }

  async sendMessage(chatId: string, content: string, messageType = 'text', media?: any): Promise<ApiResponse> {
    return this.makeRequest(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, messageType, media }),
    });
  }

  async getMessages(chatId: string, page = 1, limit = 50): Promise<ApiResponse> {
    return this.makeRequest(`/chats/${chatId}/messages?page=${page}&limit=${limit}`);
  }

  // Upload image
  async uploadImage(imageUri: string): Promise<ApiResponse> {
    try {
      const token = await this.getAuthToken();
      
      // Create form data
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      } as any);

      const response = await fetch(`${this.baseURL}/upload/image`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  // Get current push token (placeholder for future implementation)
  getCurrentPushToken(): string | null {
    return null;
  }
}

export const apiService = new ApiService();
export default apiService;
