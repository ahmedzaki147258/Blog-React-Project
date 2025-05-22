import { useState, useEffect, useRef } from 'react';
import Blog from '../components/Blog';
import { fetchAllPosts, createPost } from '../services/blogService';

export function Blogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchAllPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError('');
    
    if (!file) {
      setImage(null);
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file');
      setImage(null);
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image size should not exceed 2MB');
      setImage(null);
      return;
    }
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setSubmitError('Please enter a title');
      return;
    }
    
    if (!image) {
      setSubmitError('Please select an image');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError('');
      
      const postData = {
        title: title.trim(),
        userId: user.id,
        image: image
      };
      
      const newPost = await createPost(postData);
      setPosts([newPost, ...posts]);
      setTitle('');
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsDialogOpen(false);
    } catch (err) {
      setSubmitError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
  };
    
  const handlePostDelete = (deletedPostId) => {
    setPosts(posts.filter(post => post.id !== deletedPostId));
  };

  return (
    <div className="max-w-4xl mx-auto relative pb-20">
      <h1 className="text-3xl font-bold mb-6">Blogs</h1>
      
      {loading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      
      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}
      
      {!loading && !error && posts.length === 0 && (
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>No blog posts found.</span>
        </div>
      )}
      
      {posts.map(post => (
        <Blog 
          key={post.id} 
          post={post} 
          onUpdate={handlePostUpdate}
          onDelete={handlePostDelete}
        />
      ))}

      {user && (
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="btn btn-primary fixed bottom-8 right-8 shadow-lg text-2xl"
          aria-label="Add Post"
        >
          Add Post
        </button>
      )}

      {isDialogOpen && (
         <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
            
            {submitError && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{submitError}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Enter post title"
                  required
                />
              </div>
              
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Image</span>
                </label>
                <input 
                  type="file" 
                  className="file-input file-input-bordered w-full" 
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  required
                />
                {imageError && (
                  <label className="label">
                    <span className="label-text-alt text-error">{imageError}</span>
                  </label>
                )}
                <p className="text-xs text-base-content/70 mt-1">
                  Image must be less than 2MB
                </p>
              </div>
              
              {image && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt="Preview" 
                    className="w-full h-40 object-cover rounded-md" 
                  />
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-ghost" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Posting...
                    </>
                  ) : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
