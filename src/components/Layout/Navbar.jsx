import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import DarkModeToggle from "../DarkModeToggle";
import NotificationBell from "../Notification/NotificationBell";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { totalQuantity } = useSelector((state) => state.cart);
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const fetchUserData = async () => {
    if (currentUser) {
      const db = getFirestore();
      // Create a reference to the user's document in the 'users' collection
      const userDocRef = doc(db, "users", currentUser.uid);

      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          // If the document exists, set the user data in state
          setUserData(docSnap.data());
        } else {
          console.log("No such document in Firestore!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };
  useEffect(() => {
    fetchUserData();
  }, [currentUser]);
  return (
    <nav className="bg-white dark:bg-[#313340] shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">
              PET<span className="text-neutral dark:text-white">.CARE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/catalog" className="nav-link">
              Catalog
            </Link>
            {currentUser && (
              <Link to="/favorites" className="nav-link">
                Favorites
              </Link>
            )}
            <Link to="/clinics" className="nav-link">
              Health
            </Link>
            {userData?.role === "doctor" && (
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            )}
          </div>
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 text-neutral dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <NotificationBell />

            <DarkModeToggle />

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="nav-link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn-primary text-sm">
                  Log In
                </Link>
                <Link to="/signup" className="btn-secondary text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 mr-2 text-neutral hover:text-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* Mobile Notification Bell */}
            <div className="mr-2">
              <NotificationBell />
            </div>

            <button
              onClick={toggleMenu}
              type="button"
              className="text-neutral hover:text-primary focus:outline-none focus:text-primary"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/catalog"
                className="block px-3 py-2 rounded-md text-base font-medium nav-link"
              >
                Catalog
              </Link>
              <Link
                to="/search"
                className="block px-3 py-2 rounded-md text-base font-medium nav-link"
              >
                Search
              </Link>
              <Link
                to="/favorites"
                className="block px-3 py-2 rounded-md text-base font-medium nav-link"
              >
                Favorites
              </Link>
              <Link
                to="/clinics"
                className="block px-3 py-2 rounded-md text-base font-medium nav-link"
              >
                Health
              </Link>
              {currentUser ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium nav-link"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium nav-link"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium nav-link"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium nav-link"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <DarkModeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
