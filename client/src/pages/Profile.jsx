import { useState, useEffect } from 'react';
import { updateProfile } from '../services/authService';
import { fetchUserPosts } from '../services/blogService';
import Blog from '../components/Blog';

export function Profile() {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [posts, setPosts] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFirstName(parsedUser.first_name || '');
      setLastName(parsedUser.last_name || '');
      setEmail(parsedUser.email || '');
      
      fetchUserPosts(parsedUser.id)
        .then(data => {
          setPosts(data);
          setPostsLoading(false);
        })
        .catch(err => {
          setPostsLoading(false);
        });
    }
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setUpdateError(null);
    
    if (!user) return;
    try {
      const updatedData = {
        first_name: firstName,
        last_name: lastName
      };
      
      await updateProfile(user.id, updatedData);
      setUpdateSuccess(true);
      const updatedUser = { ...user, first_name: firstName, last_name: lastName };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setUpdateError(err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Please log in to view your profile.</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      {/* Profile Update Form */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title mb-4">Personal Information</h2>
          
          {updateSuccess && (
            <div className="alert alert-success mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Profile updated successfully!</span>
            </div>
          )}
          
          {updateError && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{updateError}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                className="input input-bordered bg-base-200" 
                value={email} 
                disabled 
              />
            </div>
            
            <div className="form-control">
              <button type="submit" className="btn btn-primary">
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* User Posts Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Posts</h2>
        
        {postsLoading && (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        )}
        
        {!postsLoading && posts.length === 0 && (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>You haven't created any posts yet.</span>
          </div>
        )}
        
        {posts.map(post => (
          <Blog key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Profile;