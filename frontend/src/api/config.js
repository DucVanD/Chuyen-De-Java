
// export const apiURL = "http://127.0.0.1:8080/api"; 
// export const imageURL = "http://127.0.0.1:8080/uploads";

export const getImageUrl = (imageName, type = 'product') => {
    if (!imageName) return "/placeholder.png";

    // Trim and cast to string to handle any edge cases
    const path = String(imageName).trim();

    // Check if it's already an absolute URL (http:, https:, blob:, data:, ftp:, etc.)
    // Accept any scheme followed by ':' (covers blob:, data:, http:, https:, etc.)
    if (/^[a-z][a-z0-9+.-]*:/i.test(path)) {
        return path;
    }

    return `${imageURL}/${type}/${path}`;
};

// export const apiURL = "https://chuyen-de-thuc-tap.onrender.com/api";
// export const imageURL = "https://chuyen-de-thuc-tap.onrender.com/assets/images/";
export const apiURL = import.meta.env.VITE_API_URL;
export const imageURL = import.meta.env.VITE_IMAGE_URL;
