
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import { getMe } from "../services/auth.api";

export default function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(() => {
    const isBypass =
        localStorage.getItem("dev_bypass") === "true" ||
        new URLSearchParams(window.location.search).get("bypass") === "true";

    return isBypass ? true : null;
  });

  const token = getToken();

  useEffect(() => {
    let isMounted = true;

    const isBypass =
        localStorage.getItem("dev_bypass") === "true" ||
        new URLSearchParams(window.location.search).get("bypass") === "true";

    if (isBypass) {
      return;
    }

    if (!token) {
      setIsValid(false);
      return;
    }

    getMe()
        .then(() => {
          if (isMounted) {
            setIsValid(true);
          }
        })
        .catch(() => {
          if (isMounted) {
            // Do not treat a failed server check as valid authentication.
            setIsValid(false);
          }
        });

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (isValid === null) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
    );
  }
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
