export const getResumeUrl = (url?: string) => {
  if (!url) return '';
  
  // Handle case where database accidentally saved URL with prefix (e.g. fastcareer.onrender.comhttps://res.cloudinary...)
  const cloudinaryPattern = 'https://res.cloudinary.com';
  if (url.includes(cloudinaryPattern)) {
    return url.substring(url.indexOf(cloudinaryPattern));
  }
  
  // If it's a valid external URL already
  if (url.startsWith('http')) {
    return url;
  }
  
  // Otherwise it's a local file path, so prepend the backend URL
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const separator = url.startsWith('/') ? '' : '/';
  
  return `${baseUrl}${separator}${url}`;
};
