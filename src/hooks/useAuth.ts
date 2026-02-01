const useAuth = () => {
  const user = { id: 1, name: 'Họ văn tên', role: 'owner', email: 'email@example.com' }; // Example user
  const logout = () => {
    console.log('User logged out');
  };

  return { user, logout };
};

export default useAuth;
