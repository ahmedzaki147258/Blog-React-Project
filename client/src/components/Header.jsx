import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  function handleLogout() {
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    window.location.href = '/';
  };

  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      <div className="flex-1">
        <Link className="text-xl font-bold" to="/">MyBlog</Link>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <button 
            onClick={toggleDropdown}
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img 
                alt="User"
                src={user ? `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}` : "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} 
              />
            </div>
          </button>
          {isDropdownOpen && (
            <ul className="mt-3 z-[1] p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
              {user ? (
                <>
                  <li>
                    <Link className="justify-between" to='/profile'>
                      Profile
                      <span className="badge">{user.first_name}</span>
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><a href="/login">Login</a></li>
                  <li><a href="/register">Register</a></li>
                </>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
