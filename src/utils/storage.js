const TOKEN_KEY = "todo_token";
const USER_KEY = "todo_user";

const getStorageByPreference = (rememberMe) => {
  return rememberMe ? localStorage : sessionStorage;
};

export const saveAuthData = ({ token, user }, rememberMe = true) => {
  const storage = getStorageByPreference(rememberMe);

  // Keep auth in one storage location only.
  clearAuthData();
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const getStoredUser = () => {
  const user =
    localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};
