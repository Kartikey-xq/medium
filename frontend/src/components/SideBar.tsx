import { useNavigate, NavLink } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useAuth } from "../authContext";
import { useEffect } from "react";
import { me } from "../api/authApi";

type SideBarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const SideBar = ({ open, setOpen }: SideBarProps) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // ✅ Hydrate context from backend on mount
  useEffect(() => {
    const fetchUser = async () => {
      const res = await me();
      if (res.success) {
        setUser(res.user);
      }
    };
    fetchUser();
  }, [setUser]);

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
        className={`fixed sm:static top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
      >
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
                  localStorage.removeItem("user");
                  alert("Logged out successfully");
                  navigate("/blogs");
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
