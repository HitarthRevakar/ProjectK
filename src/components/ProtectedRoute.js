// import React from 'react';
// import { Navigate } from "react-router-dom";
// import { useUserAuth } from "../context/UserAuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { user } = useUserAuth();

//   console.log("Check user in Private: ", user);
//   if (!user) {
//     return <Navigate to="/" />;
//   }
//   return children;
// };

// export default ProtectedRoute;
import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Check user in Private: ", user);
    if (!user) {
      navigate('/'); // Redirect to the home page
    }
  }, [user, navigate]);

  return user ? children : null;
};

export default ProtectedRoute;
