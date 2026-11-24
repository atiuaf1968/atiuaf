export interface Program {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  features: string[];
  impact: string;
  badgeColor: "green" | "red";
  iconName: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: "Announcement" | "Convention" | "Student Welfare" | "Academic" | "Press Release";
  summary: string;
  readTime: string;
  featured?: boolean;
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  category: "UAF Executive Body" | "Advisory Board" | "Academic Wing" | "Student Welfare";
  bio: string;
  imagePlaceholder: string;
}

export interface CareerOpportunity {
  id: string;
  title: string;
  type: "Volunteer" | "Internship" | "Fellowship" | "Core Staff";
  department: string;
  location: string;
  commitment: string;
  description: string;
  requirements: string[];
  deadline: string;
  status: "Active" | "Closed";
}

export const SITE_METADATA = {
  name: "ATI UAF — Anjuman Talaba-e-Islam",
  legalName: "Anjuman Talaba-e-Islam (UAF Chapter)",
  slogan: "Love of Prophet Muhammad (Durood) • Non-Political Student Association • Faith • Learning",
  description: "Official website of Anjuman Talaba-e-Islam UAF, the esteemed Non-Political Student Association of Islam in Pakistan. Established since 1968 at the University of Agriculture, Faisalabad.",
  primaryGreen: "#087A43",
  primaryRed: "#C62828",
  contactEmail: "atiuaf1968@gmail.com",
  contactPhone: "+92 317 2011968",
  secondaryPhone: "0314 8015678",
  address: "Jinnah Hall, University of Agriculture (UAF), Jail Road, Faisalabad, Pakistan",
  workingHours: "Monday – Friday: 8:00 AM – 6:00 PM (Saturday & Sunday Off)",
  socials: {
    facebook: "https://facebook.com/atiuaf1968",
    twitter: "https://twitter.com/atiuaf1968",
    instagram: "https://instagram.com/atiuaf1968",
    youtube: "https://youtube.com/@atiuaf1968",
    whatsapp: "https://wa.me/923172011968"
  }
};

export const CORE_OBJECTIVES = [
  {
    number: "01",
    title: "Spiritual Growth & Islamic Character",
    description: "Nurturing God-consciousness (Taqwa), moral integrity, and deep reverence for the Holy Prophet Muhammad (PBUH) among UAF agricultural and sciences students.",
    accent: "green"
  },
  {
    number: "02",
    title: "Academic Excellence & Agri-Research",
    description: "Assisting students across agricultural, veterinary, engineering, and basic science faculties with research mentorship, study circles, and exam preparation.",
    accent: "red"
  },
  {
    number: "03",
    title: "Student Rights & Campus Welfare",
    description: "Advocating for student welfare, hostel facilities, fair fee structures, dining standards, and transparent campus administration at UAF.",
    accent: "green"
  },
  {
    number: "04",
    title: "Ethical Leadership Development",
    description: "Training eloquent, visionary, and morally grounded student leaders to lead campus councils, academic bodies, and agricultural organizations.",
    accent: "red"
  },
  {
    number: "05",
    title: "Community Service & Blood Donation",
    description: "Mobilizing UAF students for continuous voluntary blood donation, campus clean-up drives, tree plantation, and flood relief initiatives.",
    accent: "green"
  },
  {
    number: "06",
    title: "Student Fraternity & Unity",
    description: "Fostering brotherhood and harmony across all faculties, departments, and hostels of UAF without linguistic or regional prejudices.",
    accent: "red"
  }
];

export const PROGRAMS: Program[] = [
  {
    id: "talaba-rahnuma",
    title: "Talaba Rahnuma (UAF Mentorship)",
    category: "Academic & Guidance",
    tagline: "Guiding freshers and undergraduates across UAF faculties",
    description: "Senior students and alumni connecting with incoming UAF students to provide course guidance, laboratory advice, semester GPA strategies, and research counseling.",
    features: ["1-on-1 Senior Student Mentorship", "Faculty Orientation & Entry Guidance", "Curated Solved Papers & Lecture Notes"],
    impact: "Over 4,500+ UAF students guided across faculties",
    badgeColor: "green",
    iconName: "GraduationCap"
  },
  {
    id: "dawah-literacy",
    title: "Noor-e-Ilm Study Halaqas",
    category: "Spiritual Development",
    tagline: "Reviving authentic Islamic thought on campus",
    description: "Weekly interactive circles at UAF focusing on the Quran, Seerah of the Prophet (PBUH), Islamic ethics in science and agriculture, and character development.",
    features: ["Weekly Seerah Study Circles", "Hostel Halaqas across UAF Halls", "Ethics in Agriculture & Science Seminars"],
    impact: "Regular weekly gatherings across UAF hostel halls",
    badgeColor: "red",
    iconName: "BookOpen"
  },
  {
    id: "student-welfare",
    title: "Bait-ul-Ilm UAF Welfare Fund",
    category: "Social Relief",
    tagline: "Ensuring no deserving UAF student leaves education due to fees",
    description: "Emergency semester assistance program supporting deserving UAF students with semester dues, mess fees, hostel charges, and essential books.",
    features: ["Direct Need-Based Fee Grants", "Course Textbook Lending Bank", "Hostel Emergency Relief Assistance"],
    impact: "₨ 3.2M+ disbursed to deserving UAF students",
    badgeColor: "green",
    iconName: "HeartHandshake"
  },
  {
    id: "leadership-academy",
    title: "Qiyadat Youth Leadership Forum",
    category: "Leadership & Training",
    tagline: "Cultivating articulate, ethical agricultural leaders",
    description: "Weekend workshops, public declamation trainings, debate contests, and student council development camps organized specifically for UAF students.",
    features: ["Parliamentary Debating Workshops", "Public Speaking & Presentation Skills", "Campus Community Organizing"],
    impact: "650+ UAF student representatives trained",
    badgeColor: "red",
    iconName: "Award"
  },
  {
    id: "blood-society",
    title: "Khoon-e-Hayat UAF Blood Society",
    category: "Humanitarian",
    tagline: "Round-the-clock voluntary student blood donor network",
    description: "A 24/7 dedicated registry of verified UAF student blood donors serving Allied Hospital, DHQ Hospital, and Thalassemia centers in Faisalabad.",
    features: ["24/7 Faisalabad Emergency Hotline", "UAF On-Campus Blood Donation Camps", "Thalassemia Patient Support Cell"],
    impact: "3,800+ pints collected annually by UAF students",
    badgeColor: "green",
    iconName: "Activity"
  },
  {
    id: "digital-skills",
    title: "Mustaqbil Tech & Agri-Skills Hub",
    category: "Skill Development",
    tagline: "Empowering UAF youth with modern digital competencies",
    description: "Hands-on bootcamps in precision agriculture technologies, data analysis, freelance skills, scientific paper writing, and graphic communications.",
    features: ["Agri-Tech & Data Analysis Seminars", "Freelancing & Digital Tools Masterclasses", "CV Building & Career Placement Prep"],
    impact: "1,800+ UAF students certified in practical digital tools",
    badgeColor: "red",
    iconName: "Code2"
  }
];

export const NEWS_ANNOUNCEMENTS: NewsItem[] = [
  {
    id: "news-1",
    title: "Annual UAF Student Power Convention Announced at Main Auditorium",
    date: "November 28, 2026",
    category: "Convention",
    summary: "Students and faculty delegates from all UAF faculties and hostels will gather to deliberate on student welfare, hostel amenities, and Islamic character on campus.",
    readTime: "3 min read",
    featured: true
  },
  {
    id: "news-2",
    title: "Free Semester Book Bank Open at Jinnah Hall Desk",
    date: "November 20, 2026",
    category: "Academic",
    summary: "Undergraduate and postgraduate students can collect reference books, notes, and laboratory practical manuals free of charge from the Jinnah Hall chapter office.",
    readTime: "2 min read",
    featured: true
  },
  {
    id: "news-3",
    title: "UAF Student Power Submits Hostel & Transport Welfare Memorandum",
    date: "November 14, 2026",
    category: "Student Welfare",
    summary: "A constructive memorandum regarding hostel mess subsidies, campus transport bus schedules, and library extended hours was handed over to the student affairs directorate.",
    readTime: "4 min read",
    featured: false
  },
  {
    id: "news-4",
    title: "Emergency Blood Donation Drive for Faisalabad Healthcare Centers",
    date: "November 06, 2026",
    category: "Announcement",
    summary: "Khoon-e-Hayat UAF organized a two-day blood camp, collecting over 300 pints for children battling Thalassemia in Faisalabad hospitals.",
    readTime: "3 min read",
    featured: false
  }
];

export const CAREER_OPPORTUNITIES: CareerOpportunity[] = [
  {
    id: "opp-1",
    title: "UAF Media & Digital Communications Lead",
    type: "Internship",
    department: "Media & IT Wing, UAF",
    location: "Jinnah Hall, UAF Campus",
    commitment: "12-15 hours / week",
    description: "Manage campus announcements, event posters, video teasers, and official social media updates for Student Power UAF chapter activities.",
    requirements: [
      "Currently enrolled undergraduate or postgraduate student at UAF",
      "Proficiency in basic graphic design (Canva/Photoshop) or video editing",
      "Strong bilingual communication in Urdu and English",
      "Commitment to ethical representation and Islamic values"
    ],
    deadline: "December 15, 2026",
    status: "Active"
  },
  {
    id: "opp-2",
    title: "Faculty & Hostel Outreach Coordinator",
    type: "Volunteer",
    department: "Student Affairs & Chapter Mobilization",
    location: "UAF Hostels & Departments",
    commitment: "6-8 hours / week",
    description: "Represent Student Power in your respective faculty or hostel hall (Jinnah Hall, Iqbal Hall, Qasim Hall, etc.). Organize welcome sessions and book drives.",
    requirements: [
      "Enrolled student residing in UAF hostels or day-scholar departments",
      "Approachable, disciplined, and passionate about student welfare",
      "Active team player with organizational mindset"
    ],
    deadline: "December 20, 2026",
    status: "Active"
  },
  {
    id: "opp-3",
    title: "Academic & Research Assistant",
    type: "Fellowship",
    department: "Academic & Student Guidance Cell",
    location: "UAF Main Campus",
    commitment: "8-10 hours / week",
    description: "Curate examination preparation banks, coordinate peer tutoring circles, and organize thesis drafting guidance for junior scholars.",
    requirements: [
      "Minimum 3.2 CGPA in relevant UAF degree program",
      "Strong academic record and dedication to helping fellow classmates",
      "Good research and documentation skills"
    ],
    deadline: "December 30, 2026",
    status: "Active"
  },
  {
    id: "opp-4",
    title: "Khoon-e-Hayat Blood Drive Volunteer",
    type: "Volunteer",
    department: "Humanitarian & Blood Society",
    location: "UAF Campus & Faisalabad Hospitals",
    commitment: "Flexible (On-call / Drive basis)",
    description: "Assist in coordinating voluntary student blood donors for emergency patients in Allied and DHQ hospitals in Faisalabad.",
    requirements: [
      "Compassionate UAF student with active WhatsApp accessibility",
      "Ability to coordinate with donor volunteers during emergencies"
    ],
    deadline: "January 15, 2027",
    status: "Active"
  }
];

export const LEADERSHIP_TEAM: LeadershipMember[] = [
  {
    id: "lead-1",
    name: "Faisal Qayyum Magray",
    role: "Central President (Session 2025–2026)",
    category: "Advisory Board",
    bio: "Central President of Anjuman Talaba-e-Islam providing constitutional leadership, guidance, and ideological patronage to university chapters across Pakistan.",
    imagePlaceholder: "F.Q.M"
  },
  {
    id: "lead-2",
    name: "Sardar Baidar Awan",
    role: "Central Secretary General (2025–2026)",
    category: "Advisory Board",
    bio: "Central Secretary General of ATI overseeing organizational discipline, student rights policy memoranda, and nationwide chapter registrations.",
    imagePlaceholder: "S.B.A"
  },
  {
    id: "lead-3",
    name: "Nazim / President, UAF Chapter",
    role: "President (UAF Executive Body)",
    category: "UAF Executive Body",
    bio: "Leading Student Power at the University of Agriculture Faisalabad across all faculties, research institutes, and student hostel halls.",
    imagePlaceholder: "P.UAF"
  },
  {
    id: "lead-4",
    name: "Secretary General, UAF Chapter",
    role: "General Secretary (UAF Executive)",
    category: "UAF Executive Body",
    bio: "Directing the Jinnah Hall campus desk, new student admissions orientations, and inter-departmental student welfare coordination.",
    imagePlaceholder: "S.G"
  },
  {
    id: "lead-5",
    name: "Coordinator, Khoon-e-Hayat UAF",
    role: "Head of Emergency Blood Registry",
    category: "Student Welfare",
    bio: "Managing the 24/7 student blood donor network connecting UAF students with Allied and DHQ hospital patients in Faisalabad.",
    imagePlaceholder: "B.S"
  },
  {
    id: "lead-6",
    name: "Editor, Nawa-e-Anjuman (UAF Desk)",
    role: "Head of Publications & Media",
    category: "UAF Executive Body",
    bio: "Curating literary dispatches, student writings, academic research summaries, and campus digital media.",
    imagePlaceholder: "N.A"
  }
];

export const FAQS = [
  {
    q: "What is Student Power at the University of Agriculture, Faisalabad (UAF)?",
    a: "Student Power is the official campus movement of Anjuman Talaba-e-Islam (ATI) at UAF. We work to promote Islamic character, academic excellence, student rights, and compassionate student welfare across all UAF faculties and hostels."
  },
  {
    q: "Where is the Student Power office located at UAF?",
    a: "Our chapter office is located at Jinnah Hall, University of Agriculture (UAF), Jail Road, Faisalabad. Students can visit our desk Monday to Friday from 8:00 AM to 6:00 PM (Saturday & Sunday Off)."
  },
  {
    q: "How can I become a member of Student Power UAF?",
    a: "Any currently enrolled student at the University of Agriculture, Faisalabad (undergraduate or postgraduate, day scholar or hostel boarder) can apply online on our Careers & Join page or visit our desk at Jinnah Hall."
  },
  {
    q: "Does Student Power UAF charge any fee for book banks or welfare aid?",
    a: "No. All book bank lending, study guides, blood donor matching, and student welfare support provided by Student Power UAF are 100% non-profit and free for deserving UAF students."
  },
  {
    q: "How can I contact the chapter for emergency blood donation or student aid?",
    a: "You can reach us directly on phone / WhatsApp at +92 317 2011968 or 0314 8015678, or email at atiuaf1968@gmail.com. Our volunteers respond promptly to emergency requests."
  }
];
