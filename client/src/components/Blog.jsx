import { useState, useEffect, useRef } from 'react';
import { updatePostTitle, updatePostImage, deletePost } from '../services/blogService';

function Blog({ post, onUpdate, onDelete }) {
  const { id, title, body, image_path, user, created_at } = post;
  const formattedDate = new Date(created_at).toLocaleDateString();
  
  const [currentUser, setCurrentUser] = useState(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateTitleDialogOpen, setIsUpdateTitleDialogOpen] = useState(false);
  const [isUpdateImageDialogOpen, setIsUpdateImageDialogOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState(title);
  const [newImage, setNewImage] = useState(null);
  const [imageError, setImageError] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setCurrentUser(parsedUser);
    }
  }, []);
  
  const isCreator = currentUser && user && currentUser.id === user.id;
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError('');
    
    if (!file) {
      setNewImage(null);
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file');
      setNewImage(null);
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image size should not exceed 2MB');
      setNewImage(null);
      return;
    }
    
    setNewImage(file);
  };
  
  const handleTitleUpdate = async (e) => {
    e.preventDefault();
    
    if (!newTitle.trim()) {
      setError('Title cannot be empty');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      const updatedPost = await updatePostTitle(id, newTitle.trim());
      if (onUpdate) {
        onUpdate(updatedPost);
      }
      setIsUpdateTitleDialogOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to update title. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleImageUpdate = async (e) => {
    e.preventDefault();
    if (!newImage) {
      setError('Please select an image');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      const updatedPost = await updatePostImage(id, newImage);
      if (onUpdate) {
        onUpdate(updatedPost);
      }
      
      setNewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsUpdateImageDialogOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to update image. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await deletePost(id);
      if (onDelete)  onDelete(id);
      setIsDeleteDialogOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to delete post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="card w-full bg-base-100 shadow-xl mb-6">
      {image_path && (
        <figure>
          <img src={image_path} alt={title} className="w-full h-full object-cover" />
        </figure>
      )}
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title">{title}</h2>
          
          {/* Show edit/delete buttons if user is the creator */}
          {isCreator && (
            <div className="flex space-x-2">
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-sm btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><button onClick={() => setIsUpdateTitleDialogOpen(true)}>Update Title</button></li>
                  <li><button onClick={() => setIsUpdateImageDialogOpen(true)}>Update Image</button></li>
                </ul>
              </div>
              <button 
                onClick={() => setIsDeleteDialogOpen(true)} 
                className="btn btn-sm btn-ghost text-error"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        <p>{body}</p>
        <div className="flex items-center mt-4">
          <div className="avatar mr-4">
            <div className="w-10 rounded-full">
              <img 
                src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}`} 
                alt={`${user.first_name} ${user.last_name}`} 
              />
            </div>
          </div>
          <div>
            <p className="font-semibold">{user.first_name} {user.last_name}</p>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Delete Post</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this post? This action cannot be undone.</p>
            
            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <button 
                className="btn btn-outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error" 
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Update Title Dialog */}
      {isUpdateTitleDialogOpen && (
         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Update Post Title</h3>
            
            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleTitleUpdate}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Title</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered bg-gray-50" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  placeholder="Enter post title"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setIsUpdateTitleDialogOpen(false)}
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
                      Updating...
                    </>
                  ) : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Update Image Dialog */}
      {isUpdateImageDialogOpen && (
         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Update Post Image</h3>
            
            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleImageUpdate}>
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Image</span>
                </label>
                <input 
                  type="file" 
                  className="file-input file-input-bordered w-full bg-gray-50" 
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
                <p className="text-xs text-gray-500 mt-1">
                  Image must be less than 2MB
                </p>
              </div>
              
              {newImage && (
                <div className="mb-4 bg-gray-50 p-2 rounded-md">
                  <p className="text-sm font-medium mb-2 text-gray-700">Preview:</p>
                  <img 
                    src={URL.createObjectURL(newImage)} 
                    alt="Preview" 
                    className="w-full h-40 object-cover rounded-md" 
                  />
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setIsUpdateImageDialogOpen(false)}
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
                      Updating...
                    </>
                  ) : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;
