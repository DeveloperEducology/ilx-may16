import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logOut } = useUserAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-blue-600 text-white p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">VSTUTORS</h1>

        {/* Hamburger Menu Button (Visible on Mobile) */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4">
          {/* <NavLink
            to="/"
            className="hover:underline"
            activeClassName="font-bold"
          >
            Home
          </NavLink> */}
          {!user && (
            <>
              <NavLink
                to="/signup"
                className="hover:underline"
                activeClassName="font-bold"
              >
                Join as Tutor
              </NavLink>
              <NavLink
                to="/signup"
                className="hover:underline"
                activeClassName="font-bold"
              >
                Register as Student
              </NavLink>
            </>
          )}

          <NavLink
            to="/practice"
            className="hover:underline glow-animation text-yellow-300"
            activeClassName="font-bold"
          >
            Learning
          </NavLink>

          {/* <NavLink
            to="/how-it-works"
            className="hover:underline"
            activeClassName="font-bold"
          >
            How It Works
          </NavLink> */}
          {/* <NavLink
            to="/pricing"
            className="hover:underline"
            activeClassName="font-bold"
          >
            Pricing
          </NavLink> */}
          {user ? (
            <>
              <NavLink
                to="/profile"
                className="hover:underline"
                activeClassName="font-bold"
              >
                Profile
              </NavLink>
              <NavLink
                onClick={logOut}
                className="hover:underline"
                activeClassName="font-bold"
              >
                Log Out
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="hover:underline"
                activeClassName="font-bold"
              >
                Log In
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
                activeClassName="font-bold"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Navigation (Drawer) */}
      {isOpen && (
        <nav className="md:hidden mt-4 flex flex-col space-y-4 text-center">
          <NavLink
            to="/"
            className="hover:underline"
            activeClassName="font-bold"
            onClick={toggleMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/tutors"
            className="hover:underline"
            activeClassName="font-bold"
            onClick={toggleMenu}
          >
            Find Tutors
          </NavLink>
          <NavLink
            to="/practice"
            className="hover:underline glow-animation text-yellow-300"
            activeClassName="font-bold"
            onClick={toggleMenu}
          >
            Learning
          </NavLink>
          <NavLink
            to="/subjects"
            className="hover:underline"
            activeClassName="font-bold"
            onClick={toggleMenu}
          >
            Subjects
          </NavLink>
          <NavLink
            to="/how-it-works"
            className="hover:underline"
            activeClassName="font-bold"
            onClick={toggleMenu}
          >
            How It Works
          </NavLink>
          <NavLink
            to="/pricing"
            className="hover:underline"
            activeClassName="font-bold"
            onClick={toggleMenu}
          >
            Pricing
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/profile"
                className="hover:underline"
                activeClassName="font-bold"
                onClick={toggleMenu}
              >
                profile
              </NavLink>
              <NavLink
                to="/login"
                className="hover:underline"
                activeClassName="font-bold"
                onClick={logOut}
              >
                Log Out
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="hover:underline"
                activeClassName="font-bold"
                onClick={toggleMenu}
              >
                Log In
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 mx-auto block w-1/2"
                activeClassName="font-bold"
                onClick={toggleMenu}
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
