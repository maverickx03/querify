const useAuth = () => {
  const token = localStorage.getItem("token");
  return {
    isAuthenticated: !!token,
    token
  };
};

export default useAuth;
