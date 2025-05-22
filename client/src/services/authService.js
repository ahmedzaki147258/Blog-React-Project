const API_URL = "http://localhost:8000/api";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Email or password is incorrect');
    }

    const userData = await response.json();
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.email || 'Registration failed');
    }

    const newUser = await response.json();
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (userId, userData) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Profile update failed');
    }

    const updatedUser = await response.json();
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const newUserData = { ...currentUser, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(newUserData));
    return updatedUser;
  } catch (error) {
    throw error;
  }
};
