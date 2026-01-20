
// export const apiURL = "http://127.0.0.1:8080/api"; 
// export const imageURL = "http://127.0.0.1:8080/uploads";

export const getImageUrl = (imageName, type = 'product') => {
    if (!imageName) return "/placeholder.png";
    if (imageName.startsWith("http")) return imageName;
    return `${imageURL}/${type}/${imageName}`;
};

// export const apiURL = "https://chuyen-de-thuc-tap.onrender.com/api";
// export const imageURL = "https://chuyen-de-thuc-tap.onrender.com/assets/images/";
export const apiURL = import.meta.env.VITE_API_URL;
export const imageURL = import.meta.env.VITE_IMAGE_URL;
