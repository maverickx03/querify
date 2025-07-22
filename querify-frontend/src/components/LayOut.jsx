import { useLocation, useNavigationType } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Start loading when location changes
    setLoading(true);

    // Stop loading once the page has rendered
    const stopLoading = setTimeout(() => {
      setLoading(false);
    }, 300); // Can be adjusted as needed

    return () => clearTimeout(stopLoading);
  }, [location]);

  return (
    <>
      {loading && <LoadingScreen />}
      <div className={`${loading ? "opacity-40 pointer-events-none" : ""}`}>
        {children}
      </div>
    </>
  );
};

export default Layout;
