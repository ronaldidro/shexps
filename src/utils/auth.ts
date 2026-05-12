export const clearAuthSession = () => {
  localStorage.removeItem("access_token");

  window.location.href = "/login";
};
