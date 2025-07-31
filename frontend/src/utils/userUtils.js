// Utility function to extract user ID from localStorage
export const getUserFromStorage = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) return null;
    
    // Try different possible structures
    if (storedUser.user && storedUser.user.id) {
      return { user: storedUser.user, userId: storedUser.user.id };
    } else if (storedUser.id) {
      return { user: storedUser, userId: storedUser.id };
    } else if (storedUser._id) {
      return { user: storedUser, userId: storedUser._id };
    } else if (storedUser.user && storedUser.user._id) {
      return { user: storedUser.user, userId: storedUser.user._id };
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

// Utility function to get just the user ID
export const getUserId = () => {
  const userData = getUserFromStorage();
  return userData?.userId || null;
};

// Utility function to check if user is logged in
export const isLoggedIn = () => {
  return getUserId() !== null;
}; 