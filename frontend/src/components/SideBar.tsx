import { useNavigate, NavLink } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useAuth } from "../authContext";
import { useEffect, useState } from "react";
import { me } from "../api/authApi";
import { signOut } from "../api/authApi";

type SideBarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const SideBar = ({ open, setOpen }: SideBarProps) => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Hydrate context from backend on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await me();
        if (res.success) {
          setUser(res.user);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setUser])
  //signout function
  const handleSignOut = async () => {
    const res = await signOut();
    if (res.success === false) {
      alert("Sign out failed. Please try again.");
      return;
    }
    else{
    localStorage.removeItem("user");  
    setUser(undefined);
    setOpen(false);
    alert("Logged out successfully");
    navigate("/blogs");    
      return;
  } 
  }

  return (
    <>
    
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed sm:static top-0 left-0 h-screen md:h-auto w-64 bg-white border-r border-gray-400 z-40 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
      >
        {/* Sidebar loading overlay */}
             {loading && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
                  </div>
                )}

        {/* Close Button for mobile */}
        <button
          className="absolute top-6 right-4 p-2 sm:hidden hover:bg-gray-100 rounded"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <FiX size={24} className="text-gray-600" />
        </button>

        <nav className="flex flex-col p-6 pt-20 sm:pt-6 space-y-1">
          {/* Common routes */}
          <NavLink
            to="/blogs"
            className={({ isActive }) =>
              `px-4 py-3 rounded transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            Home
          </NavLink>

          {/* Show these only if user is logged in */}
          {user && (
            <>
              <NavLink
                to="/create"
                className={({ isActive }) =>
                  `px-4 py-3 rounded transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                Create Blog
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `px-4 py-3 rounded transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                Profile
              </NavLink>

              <button
                onClick={() => {
                 handleSignOut();
                }}
                className="mt-6 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 rounded transition-colors"
              >
                Logout
              </button>
            </>
          )}

          {/* Show only when user is NOT logged in */}
          {!user && (
            <>
              <NavLink
                to="/signin"
                className={({ isActive }) =>
                  `px-4 py-3 rounded transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                Sign In
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `px-4 py-3 rounded transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};
