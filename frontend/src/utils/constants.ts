export const STATE_CITY_MAP: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Other"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Other"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Other"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Other"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Other"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Other"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Other"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Other"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi", "Other"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Other"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Other"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Other"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Other"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Other"],
  "Manipur": ["Imphal", "Other"],
  "Meghalaya": ["Shillong", "Other"],
  "Mizoram": ["Aizawl", "Other"],
  "Nagaland": ["Dimapur", "Kohima", "Other"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Other"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Other"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Other"],
  "Sikkim": ["Gangtok", "Other"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Other"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Other"],
  "Tripura": ["Agartala", "Other"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Noida", "Other"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Other"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Other"],
  "Delhi": ["New Delhi", "Other"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Other"],
  "Chandigarh": ["Chandigarh", "Other"],
  "Other": ["Other"]
};

export const STATES = Object.keys(STATE_CITY_MAP);
export const ALL_CITIES = Array.from(new Set(Object.values(STATE_CITY_MAP).flat())).sort();
export const YEARS = Array.from({length: 30}, (_, i) => String(new Date().getFullYear() - i));
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const BOARDS = ['CBSE', 'ICSE', 'State Board', 'Other'];
export const ATTEMPT_YEARS = ['Sept\'25', 'Jan\'26', 'May\'25', 'Nov\'24', 'May\'24', 'Nov\'23', 'May\'23', 'Nov\'22', 'May\'22', 'Nov\'21', 'May\'21', 'Nov\'20', 'May\'20'];
export const ATTEMPTS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
