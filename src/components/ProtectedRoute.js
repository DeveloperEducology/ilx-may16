import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  // const user = localStorage.getItem("user");

  const { user, logOut } = useUserAuth();

  console.log("user in protected route", user);

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to SignIn page if no user is found
    }
  }, [user, navigate]);

  return user ? children : null; // Render content only if user exists
};

export default ProtectedRoute;
