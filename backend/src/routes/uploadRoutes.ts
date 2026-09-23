import express from 'express';
import upload from '../middleware/uploadMiddleware';
import fs from 'fs';

const router = express.Router();

const POPULAR_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai',
  'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
  'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
  'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
  'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota',
  'Guwahati', 'Chandigarh', 'Noida', 'Gurugram', 'Gurgaon'
];

router.post('/', upload.single('resume'), (req, res) => {
  if (req.file) {
    const url = req.file.path.startsWith('http') 
      ? req.file.path 
      : `/${req.file.path.replace(/\\/g, '/')}`;

    const parsedData: any = {};

    try {
      if (req.file.path && fs.existsSync(req.file.path)) {
        const buffer = fs.readFileSync(req.file.path);
        const textContent = buffer.toString('latin1');
        const searchPool = `${req.file.originalname || ''} \n ${textContent}`;

        // Extract Email
        const emailMatch = searchPool.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
        if (emailMatch) {
          const em = emailMatch[0].toLowerCase();
          if (!em.includes('schema.org') && !em.includes('w3.org') && !em.includes('adobe.com')) {
            parsedData.email = em;
          }
        }

        // Extract Phone (10 digits starting with 6-9)
        const phoneMatch = searchPool.match(/(?:(?:\+91|0)[\s-]?)?([6-9]\d{9})\b/);
        if (phoneMatch && phoneMatch[1]) {
          parsedData.phone = phoneMatch[1];
        }

        // Extract City
        const lowerSearch = searchPool.toLowerCase();
        for (const city of POPULAR_CITIES) {
          if (new RegExp(`\\b${city.toLowerCase()}\\b`, 'i').test(lowerSearch)) {
            parsedData.city = city === 'Bangalore' ? 'Bengaluru' : city === 'Gurgaon' ? 'Gurugram' : city;
            break;
          }
        }

        // Extract Name from original filename
        const originalName = (req.file.originalname || '')
          .replace(/\.[^/.]+$/, '')
          .replace(/[_-]/g, ' ')
          .replace(/[0-9+()@.]/g, ' ')
          .trim();

        const ignoreWords = new Set([
          'resume', 'cv', 'curriculum', 'vitae', 'biodata', 'profile', 'final', 'ca',
          'pdf', 'docx', 'doc', 'updated', 'latest', 'new', 'chartered', 'accountant',
          'fresher', 'experienced', 'draft', 'copy', 'wfh'
        ]);

        const words = originalName.split(/\s+/).filter(w => w.length > 1 && !ignoreWords.has(w.toLowerCase()));
        if (words.length >= 2) {
          parsedData.firstName = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
          parsedData.lastName = words[1].charAt(0).toUpperCase() + words[1].slice(1).toLowerCase();
        } else if (words.length === 1) {
          parsedData.firstName = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
        }
      }
    } catch (err) {
      console.warn('Server resume parsing non-critical error:', err);
    }

    res.json({ url, resumeUrl: url, parsedData });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

export default router;
