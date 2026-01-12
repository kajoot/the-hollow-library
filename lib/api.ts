const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth`
  : "http://localhost:8000/api/auth";


export interface User {
  _id?: string;
  id?: number;
  username: string;
  email: string;
  house: "gryffindor" | "slytherin" | "hufflepuff" | "ravenclaw" | null;
  xp: number;
  level: number;
  bio: string;
  avatar: string | null;
  title: string;
  earned_titles: string[];
  books_read_count: number;
  created_at: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface Quest {
  _id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  reward_type?: "xp" | "title" | "house_points";
  title_reward?: string;
  housePointReward?: number;
  house: string;
  active: boolean;
  completedBy: Array<{ userId: string; completedAt: string }>;
  createdAt: string;
}


const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};


const setTokens = (access: string, refresh: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }
};


const clearTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

// REGISTER
export const register = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data) || "Registration failed");
    }

    setTokens(data.access, data.refresh);
    return data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

// LOGIN
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data) || "Login failed");
    }

    setTokens(data.access, data.refresh);
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// GET PROFILE
export const getProfile = async (): Promise<User> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error("No token found. Please login first.");
  }

  try {
    const response = await fetch("http://localhost:8000/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data) || "Failed to get profile");
    }

    return data;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
};

// UPDATE PROFILE 
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error("No token found. Please login first.");
  }

  try {
    const response = await fetch("http://localhost:8000/api/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(responseData) || "Failed to update profile");
    }

    return responseData;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

// LOGOUT
export const logout = () => {
  clearTokens();
};


export const isAuthenticated = (): boolean => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("access_token");
  }
  return false;
};

// QUEST INTERFACES
export interface Quest {
  _id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  house: string;
  completedBy: Array<{ userId: string; completedAt: string }>;
  active: boolean;
  createdAt: string;
}

// MESSAGE INTERFACES
export interface Message {
  _id: string;
  author: {
    _id: string;
    username: string;
    avatar: string | null;
    house: string;
  };
  content: string;
  house: string;
  likes: string[];
  replies: Array<{
    authorId: { _id: string; username: string; avatar: string | null };
    content: string;
    createdAt: string;
  }>;
  createdAt: string;
}

// QUESTS API
export const getAllQuests = async (): Promise<Quest[]> => {
  try {
    const response = await fetch("http://localhost:8000/api/quests");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data) || "Failed to fetch quests");
    }

    return data;
  } catch (error) {
    console.error("Get quests error:", error);
    throw error;
  }
};

export const getHouseQuests = async (house: string): Promise<Quest[]> => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/quests/house/${house}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data) || "Failed to fetch house quests");
    }

    return data;
  } catch (error) {
    console.error("Get house quests error:", error);
    throw error;
  }
};

export const getQuest = async (questId: string): Promise<Quest> => {
  try {
    const response = await fetch(`http://localhost:8000/api/quests/${questId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data) || "Failed to fetch quest");
    }

    return data;
  } catch (error) {
    console.error("Get quest error:", error);
    throw error;
  }
};

export const completeQuest = async (
  questId: string
): Promise<{ message: string; xpGained: number; userXP: number }> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error("No token found. Please login first.");
  }

  try {
    const response = await fetch(
      `http://localhost:8000/api/quests/${questId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data) || "Failed to complete quest");
    }

    return data;
  } catch (error) {
    console.error("Complete quest error:", error);
    throw error;
  }
};

// MESSAGES API
export const getMessages = async (house: string = "general"): Promise<Message[]> => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/messages?house=${house}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data) || "Failed to fetch messages");
    }

    return data;
  } catch (error) {
    console.error("Get messages error:", error);
    throw error;
  }
};

export const createMessage = async (
  content: string,
  house: string = "general"
): Promise<Message> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error("No token found. Please login first.");
  }

  try {
    const response = await fetch("http://localhost:8000/api/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, house }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data) || "Failed to create message");
    }

    return data;
  } catch (error) {
    console.error("Create message error:", error);
    throw error;
  }
};

export const addReply = async (
  messageId: string,
  content: string
): Promise<Message> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error("No token found. Please login first.");
  }

  try {
    const response = await fetch(
      `http://localhost:8000/api/messages/${messageId}/reply`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data) || "Failed to add reply");
    }

    return data;
  } catch (error) {
    console.error("Add reply error:", error);
    throw error;
  }
};

export const likeMessage = async (messageId: string): Promise<{ likes: number }> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error("No token found. Please login first.");
  }

  try {
    const response = await fetch(
      `http://localhost:8000/api/messages/${messageId}/like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data) || "Failed to like message");
    }

    return data;
  } catch (error) {
    console.error("Like message error:", error);
    throw error;
  }
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error("No token found. Please login first.");
  }

  try {
    const response = await fetch(
      `http://localhost:8000/api/messages/${messageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(JSON.stringify(data) || "Failed to delete message");
    }
  } catch (error) {
    console.error("Delete message error:", error);
    throw error;
  }
};

// BOOK INTERFACES
export interface Book {
  _id: string;
  user_id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  reading_status: "read" | "reading" | "plan_to_read";
  rating: number | null;
  pages_read: number;
  total_pages: number | null;
  notes: Array<{ _id: string; content: string; page_number: number; created_at: string }>;
  cover_image: string | null;
  date_started: string | null;
  date_finished: string | null;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookStats {
  total_books: number;
  books_read: number;
  currently_reading: number;
  plan_to_read: number;
  total_pages_read: number;
  average_rating: number;
  favorite_books: number;
  genres: string[];
}

// LIBRARY API
export const getBooks = async (
  status?: string,
  genre?: string,
  search?: string
): Promise<{ books: Book[]; count: number; read: number; reading: number; plan_to_read: number }> => {
  const token = getAccessToken();
  if (!token) throw new Error("No token found");

  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (genre) params.append("genre", genre);
  if (search) params.append("search", search);

  try {
    const response = await fetch(
      `http://localhost:8000/api/library?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Get books error:", error);
    throw error;
  }
};

export const getBook = async (bookId: string): Promise<Book> => {
  const token = getAccessToken();
  if (!token) throw new Error("No token found");

  try {
    const response = await fetch(
      `http://localhost:8000/api/library/${bookId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Get book error:", error);
    throw error;
  }
};

export const createBook = async (bookData: Partial<Book>): Promise<Book> => {
  const token = getAccessToken();
  if (!token) throw new Error("No token found");

  try {
    const response = await fetch(
      `http://localhost:8000/api/library`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Create book error:", error);
    throw error;
  }
};

export const updateBook = async (
  bookId: string,
  bookData: Partial<Book>
): Promise<Book> => {
  const token = getAccessToken();
  if (!token) throw new Error("No token found");

  try {
    const response = await fetch(
      `http://localhost:8000/api/library/${bookId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Update book error:", error);
    throw error;
  }
};

export const deleteBook = async (bookId: string): Promise<void> => {
  const token = getAccessToken();
  if (!token) throw new Error("No token found");

  try {
    const response = await fetch(
      `http://localhost:8000/api/library/${bookId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) {
      const data = await response.json();
      throw new Error(JSON.stringify(data));
    }
  } catch (error) {
    console.error("Delete book error:", error);
    throw error;
  }
};

export const addBookNote = async (
  bookId: string,
  content: string,
  page_number?: number
): Promise<Book> => {
  const token = getAccessToken();
  if (!token) throw new Error("No token found");

  try {
    const response = await fetch(
      `http://localhost:8000/api/library/${bookId}/notes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, page_number }),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Add note error:", error);
    throw error;
  }
};

export const deleteBookNote = async (
  bookId: string,
  noteId: string
): Promise<Book> => {
  const token = getAccessToken();
  if (!token) throw new Error("No token found");

  try {
    const response = await fetch(
      `http://localhost:8000/api/library/${bookId}/notes/${noteId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Delete note error:", error);
    throw error;
  }
};

export const getBookStats = async (): Promise<BookStats> => {
  const token = getAccessToken();
  if (!token) throw new Error("No token found");

  try {
    const response = await fetch(
      `http://localhost:8000/api/library/stats`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Get stats error:", error);
    throw error;
  }
};


// Get title milestones and progression
export interface TitleMilestone {
  threshold: number;
  title: string;
  xp: number;
}

export interface TitleProgressionData {
  currentTitle: string;
  booksRead: number;
  totalXP: number;
  milestones: TitleMilestone[];
  nextMilestone: TitleMilestone | null;
}

export const getTitleMilestones = async (): Promise<TitleProgressionData> => {
  const token = getAccessToken();
  if (!token) throw new Error("No token found");

  try {
    const response = await fetch(
      "http://localhost:8000/api/library/milestones/titles",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Get title milestones error:", error);
    throw error;
  }
};

// HOUSE POINTS API
export interface HousePointsData {
  house: string;
  questPoints: number;
  bookPoints: number;
  totalPoints: number;
  houseMembers: number;
}

export const getHousePoints = async (house: string): Promise<HousePointsData> => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/profile/house-points/${house}`
    );
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Get house points error:", error);
    throw error;
  }
};
