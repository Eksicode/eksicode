interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  verified?: boolean;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  async getCurrentUser(token: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return data.user;
      }

      return null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  async logout(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return response.ok && data.success;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }
}

const authService = new AuthService();
export default authService;
