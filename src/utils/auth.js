// export const saveToken = (token) => localStorage.setItem("user_token", token);
// export const getToken = () => localStorage.getItem("token");
// export const clearToken = () => localStorage.removeItem("token");

export const saveToken = (token) => {
    localStorage.setItem("token", token);
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const clearToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("dev_bypass");
};
