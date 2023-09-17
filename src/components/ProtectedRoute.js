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
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Check user in Private: ", user);
    if (isLoading) {
      // You can optionally show a loading spinner or message here.

    } else if (!user) {
      navigate('/'); // Redirect to the home page
    }
  }, [user, isLoading, navigate]);

  // return isLoading ? <LoadingSpinner /> : user ? children : null;
};

export default ProtectedRoute;
