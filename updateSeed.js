export const updateSeedData = `
// First names, Last names, Cities
const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Diya", "Sanya", "Myra", "Anya", "Kiara", "Kriti", "Ananya", "Riya", "Rohan", "Kabir", "Neha", "Pooja", "Rahul", "Karan", "Simran", "Raj", "Nisha", "Vikram", "Sneha", "Rishi", "Tara", "Amit", "Alia", "Varun", "Shruti", "Siddharth", "Tanvi", "Nikhil", "Priya", "Manish", "Divya", "Gaurav", "Isha", "Kunal", "Megha", "Prateek", "Sakshi", "Tarun", "Vidhi", "Yash"];
const lastNames = ["Sharma", "Verma", "Gupta", "Malhotra", "Singh", "Patel", "Joshi", "Deshmukh", "Reddy", "Iyer", "Chauhan", "Agarwal", "Bansal", "Mehta", "Trivedi", "Nair", "Menon", "Kapoor", "Chopra", "Das"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"];
const states = ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Gujarat", "Tamil Nadu", "West Bengal", "Gujarat", "Maharashtra", "Rajasthan", "Uttar Pradesh", "Uttar Pradesh", "Maharashtra", "Madhya Pradesh", "Maharashtra"];
const companies = ["Deloitte", "KPMG", "EY", "PwC", "Grant Thornton", "BDO", "Tata Motors", "Reliance", "HDFC Bank", "Infosys"];

export const seed50Candidates = async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);
    const candidates = [];
    
    for (let i = 0; i < 50; i++) {
      const isExperienced = i < 10;
      const fName = firstNames[i % firstNames.length];
      const lName = lastNames[i % lastNames.length];
      const cityIdx = Math.floor(Math.random() * cities.length);
      const randomCity = cities[cityIdx];
      const randomState = states[cityIdx];
      const randomCompany = companies[Math.floor(Math.random() * companies.length)];
      
      candidates.push({
        firstName: fName,
        lastName: lName,
        email: \`\${fName.toLowerCase()}.\${lName.toLowerCase()}_\${Date.now()}@example.com\`,
        password: hashedPassword,
        role: "candidate",
        phone: \`9\${Math.floor(Math.random() * 900000000) + 100000000}\`,
        headline: isExperienced ? "Experienced Chartered Accountant" : "Motivated Fresher CA",
        resumeUrl: "", // Empty URL forces the system to dynamically generate a REAL-looking PDF with their data!
        skills: ["Accounting", "Taxation", "Audit", "Financial Modeling", "GST", "Income Tax"].sort(() => 0.5 - Math.random()).slice(0, 4),
        experience: isExperienced ? Math.floor(Math.random() * 5) + 1 : 0,
        personalDetails: {
          alternatePhone: \`8\${Math.floor(Math.random() * 900000000) + 100000000}\`,
          currentAddress: \`\${Math.floor(Math.random() * 100) + 1}, Civil Lines\`,
          currentState: randomState,
          currentCity: randomCity,
          permanentAddressSameAsCurrent: true,
          dateOfBirth: \`199\${Math.floor(Math.random() * 8) + 1}-05-15\`,
          gender: i % 2 === 0 ? "Female" : "Male",
          maritalStatus: "Unmarried",
          preferredCampusCity: ["Mumbai", "Delhi", "Pune", "Bangalore"][Math.floor(Math.random() * 4)]
        },
        caPortfolio: {
          isFresherCA: !isExperienced,
          caInter: {
            bothGroups1stAttempt: Math.random() > 0.5,
            group1Attempts: String(Math.floor(Math.random() * 3) + 1),
            group1Month: "May",
            group1Year: "2018",
            group2Attempts: String(Math.floor(Math.random() * 3) + 1),
            group2Month: "Nov",
            group2Year: "2018",
            ranker: Math.random() > 0.8 ? "Yes" : "No",
            completionSessionMonth: "Nov",
            completionSessionYear: "2018",
            percentage: String(Math.floor(Math.random() * 15) + 55)
          },
          caFinal: {
            bothGroups1stAttempt: Math.random() > 0.7,
            group1Attempts: String(Math.floor(Math.random() * 4) + 1),
            group1Month: "May",
            group1Year: "2021",
            group2Attempts: String(Math.floor(Math.random() * 4) + 1),
            group2Month: "Nov",
            group2Year: "2021",
            ranker: Math.random() > 0.9 ? "Yes" : "No",
            completionSessionMonth: "Nov",
            completionSessionYear: "2021",
            percentage: String(Math.floor(Math.random() * 15) + 50)
          },
          articleships: [{
            type: "Statutory Audit",
            firmType: ["Big4", "Medium", "Small"][Math.floor(Math.random() * 3)],
            firmName: \`\${lastNames[Math.floor(Math.random() * lastNames.length)]} & Associates\`,
            city: randomCity,
            noOfPartners: String(Math.floor(Math.random() * 10) + 2),
            noOfMonths: "36"
          }],
          articleshipCompletionDate: "2021-04-30",
          gmcsCompleted: "Yes",
          big4Articleship: Math.random() > 0.8 ? "Yes" : "No",
          industrialTrainee: Math.random() > 0.9 ? "Yes" : "No",
          listedCompanyWork: Math.random() > 0.6 ? "Yes" : "No",
          natureOfWork: "Audit & Taxation"
        },
        qualifications: {
          graduation: {
            completed: "Yes",
            yearOfCompletion: "2017",
            percentage: String(Math.floor(Math.random() * 20) + 60),
            college: "Local University",
            type: "REGULAR"
          },
          class12: { percentage: String(Math.floor(Math.random() * 20) + 70), year: "2014", board: "CBSE" },
          class10: { percentage: String(Math.floor(Math.random() * 15) + 80), year: "2012", board: "CBSE" }
        },
        experienceInfo: isExperienced ? {
          isExperienced: true,
          experienceYears: String(Math.floor(Math.random() * 5) + 1),
          currentCompanyName: randomCompany,
          currentCTC: String((Math.floor(Math.random() * 5) + 8) * 100000),
          expectedCTC: String((Math.floor(Math.random() * 5) + 12) * 100000),
          currentDesignation: "Chartered Accountant",
          workProfile: "Financial Reporting"
        } : undefined
      });
    }

    await User.insertMany(candidates);
    res.json({ success: true, message: "Successfully added 50 realistic candidates!" });
  } catch (error: any) {
    console.error("Error in seed50Candidates:", error);
    res.status(500).json({ message: error.message || "Error seeding 50 candidates" });
  }
};
`
