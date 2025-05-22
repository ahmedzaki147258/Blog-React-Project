const API_URL = 'http://localhost:8000/api';

export const fetchAllPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/posts`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchPostById = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchUserPosts = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/posts/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user posts');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('user_id', postData.userId);
    if (postData.image) formData.append('image', postData.image);
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create post');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updatePostTitle = async (postId, newTitle) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/title`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTitle }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update post title');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updatePostImage = async (postId, newImage) => {
  try {
    const formData = new FormData();
    formData.append('image', newImage);
    
    const response = await fetch(`${API_URL}/posts/${postId}/image`, {
      method: 'PATCH',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update post image');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete post');
    }
    
    return true;
  } catch (error) {
    throw error;
  }
};
