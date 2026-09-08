export const getResumeUrl = (url?: string) => {
  if (!url) return '';
  
  // Handle case where database accidentally saved URL with prefix (e.g. fastcareer.onrender.comhttps://res.cloudinary...)
  const cloudinaryPattern = 'https://res.cloudinary.com';
  if (url.includes(cloudinaryPattern)) {
    return url.substring(url.indexOf(cloudinaryPattern));
  }

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // If URL contains an uploads path (e.g. /uploads/resume_123.pdf or https://fastcareer.onrender.com/uploads/...)
  if (url.includes('/uploads/')) {
    const filename = url.split('/uploads/')[1];
    return `${baseUrl}/uploads/${filename}`;
  }
  
  // If it's a valid external URL already (e.g., S3, Cloudinary)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise it's a local file path, so prepend the backend URL
  const separator = url.startsWith('/') ? '' : '/';
  return `${baseUrl}${separator}${url}`;
};
