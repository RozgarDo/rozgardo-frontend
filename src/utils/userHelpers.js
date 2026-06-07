const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchFreshUser = async (userId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/profile/${userId}`);
    if (res.ok) {
      const data = await res.json();
      return data.user;
    }
  } catch (err) {
    console.error('Failed to fetch fresh user:', err);
  }
  return null;
};