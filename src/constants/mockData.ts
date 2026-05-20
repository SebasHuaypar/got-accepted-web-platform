import { NavItem, Program, Member, Scholarship, BlogPost } from "@/types";

export const ABOUT = {
  title: "Empowering the Next Generation of Global Leaders",
  subtitle: "Our Story & Mission",
  description: "Founded with the vision of making global education accessible, GotAccepted has become the bridge between talented students and the world's most prestigious universities. We believe that every student, regardless of their background, deserves the chance to unlock their full potential.",
  mission: "To provide expert guidance and scholarship opportunities that help aspiring students get accepted into top global programs.",
  pillars: [
    { title: "Mentorship", description: "Personalized guidance from alumni and experts." },
    { title: "Global Reach", description: "Partnerships with universities across 50+ countries." },
    { title: "Excellence", description: "A track record of 95% success rate in applications." }
  ]
};

export const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Programs", href: "/programs" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Blog", href: "/blog" },
];

export const PROGRAMS: Program[] = [
  {
    id: "1",
    slug: "ivy-league-mentorship",
    title: "Ivy League Mentorship",
    description: "Step-by-step guidance for applying to top-tier US universities. From building a profile to the final application.",
    category: "Undergraduate",
    duration: "6 Months",
    imageUrl: "/images/gotaccepted_mobile_mockup.png",
  },
  {
    id: "2",
    slug: "masters-accelerator",
    title: "Master's Accelerator",
    description: "Perfecting your profile for competitive graduate programs worldwide. Specialized guidance for Master and PhD seekers.",
    category: "Graduate",
    duration: "4 Months",
    imageUrl: "/images/gotaccepted_mobile_mockup.png",
  },
  {
    id: "3",
    slug: "scholarship-finder",
    title: "Scholarship Finder",
    description: "Access to our exclusive database of funding opportunities for Latinos. We help you find the money for your dreams.",
    category: "Scholarships",
    duration: "Lifetime Access",
    imageUrl: "/images/gotaccepted_mobile_mockup.png",
  },
  {
    id: "4",
    slug: "essay-writing-masterclass",
    title: "Essay Writing Masterclass",
    description: "Learn how to tell your story in a way that captivates admissions officers. One-on-one sessions for perfect results.",
    category: "Workshops",
    duration: "4 Weeks",
    imageUrl: "/images/gotaccepted_mobile_mockup.png",
  },
  {
    id: "5",
    slug: "stem-research-fellowship",
    title: "STEM Research Fellowship",
    description: "Opportunities for research experience in top global labs. For students aiming for excellence in science and tech.",
    category: "Undergraduate",
    duration: "3 Months",
    imageUrl: "/images/gotaccepted_mobile_mockup.png",
  },
];

export const MEMBERS: Member[] = [
  {
    id: "1",
    name: "Victor Name",
    role: "CEO & Founder",
    category: "BOARD",
    avatarUrl: "/images/victor_izquierda.png",
    linkedin: "#",
    instagram: "#",
  },
  {
    id: "2",
    name: "Jane Doe",
    role: "Executive Director",
    category: "BOARD",
    avatarUrl: "/images/victor_izquierda.png",
    linkedin: "#",
    instagram: "#",
  },
  {
    id: "3",
    name: "John Smith",
    role: "Strategic Advisor",
    category: "BOARD",
    avatarUrl: "/images/victor_izquierda.png",
    linkedin: "#",
    instagram: "#",
  },
  {
    id: "4",
    name: "Alice Johnson",
    role: "Board Member",
    category: "BOARD",
    avatarUrl: "/images/victor_izquierda.png",
    linkedin: "#",
    instagram: "#",
  },
  {
    id: "5",
    name: "Robert Brown",
    role: "Operations Manager",
    category: "TEAM",
    avatarUrl: "/images/victor_izquierda.png",
    linkedin: "#",
    instagram: "#",
  },
];

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "s1",
    title: "Gates Cambridge Scholarship",
    institution: "University of Cambridge",
    amount: "Full Funding",
    deadline: "2026-10-12",
    category: ["Graduate", "UK", "All Fields"],
    description: "The Gates Cambridge Scholarship program offers full-cost scholarships to outstanding applicants from countries outside the UK.",
    requirements: ["GPA 3.7+", "Leadership", "Academic Excellence"],
    link: "#",
  },
  {
    id: "s2",
    title: "Fulbright Foreign Student Program",
    institution: "USA Government",
    amount: "Full Tuition + Stipend",
    deadline: "2026-08-15",
    category: ["Graduate", "USA", "All Fields"],
    description: "The Fulbright Program is the flagship international educational exchange program sponsored by the U.S. government.",
    requirements: ["Bachelor's Degree", "English Proficiency", "Cultural Ambassadorship"],
    link: "#",
  },
  {
    id: "s3",
    title: "Erasmus Mundus Joint Masters",
    institution: "European Union",
    amount: "€25,000 / year",
    deadline: "2026-01-30",
    category: ["Graduate", "Europe", "Consortium"],
    description: "High-level integrated study programs at master level, delivered by an international partnership of HEIs.",
    requirements: ["Excellent academic record", "Motivation", "Research interest"],
    link: "#",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "b1",
    slug: "mastering-scholarship-essays",
    title: "Mastering the Art of Scholarship Essays",
    excerpt: "Learn the secrets to writing a motivation letter that stands out from thousands of applicants.",
    author: "Victor Name",
    authorRole: "CEO & Founder",
    authorAvatar: "/images/victor_izquierda.png",
    date: "May 10, 2026",
    readingTime: "6 min read",
    category: "Application Tips",
    imageUrl: "/images/gotaccepted_mobile_mockup.png",
    content: "Writing a scholarship essay is one of the most critical parts of your application. Unlike grades or test scores, your essay is where your voice, your story, and your character come through. Scholarship committees read thousands of applications, and the essays that stand out are not the ones with the most impressive credentials — they are the ones that feel honest, specific, and memorable.\n\nThe most common mistake applicants make is writing a generic essay about their desire to help the world. Instead, anchor your essay in a specific moment, a turning point, or a challenge you overcame. Tell the reader exactly why you are the person who should receive this funding. Use concrete details: not \"I volunteered in my community\" but \"Every Saturday morning for two years, I taught English to 15 families in my neighborhood, and I watched my neighbor's daughter receive her first acceptance letter to a US university.\"\n\nFinally, tailor every essay to its specific scholarship. Research the organization's values, their past recipients, and what they stand for. Reflect those values in your story without being dishonest. A Gates Cambridge essay should feel different from a Fulbright essay — because the organizations have different missions and different ideal recipients. At GotAccepted, our mentors review hundreds of essays every year, and we will help you find the story only you can tell."
  },
  {
    id: "b2",
    slug: "top-universities-europe-2026",
    title: "Top 10 European Universities for Latino Students in 2026",
    excerpt: "Exploring the best educational institutions in Europe that offer the best support for international students.",
    author: "Jane Doe",
    authorRole: "Executive Director",
    authorAvatar: "/images/victor_izquierda.png",
    date: "May 08, 2026",
    readingTime: "8 min read",
    category: "University Life",
    imageUrl: "/images/gotaccepted_mobile_mockup.png",
    content: "Europe continues to be a top destination for students seeking high-quality education at a fraction of the cost of US programs. Countries like the Netherlands, Germany, Spain, and the UK host some of the world's most internationally-minded universities — and many actively recruit students from Latin America with targeted scholarship programs and dedicated international student offices.\n\nAmong the standout institutions for Latino students in 2026 are Delft University of Technology in the Netherlands, which offers programs entirely in English and has a large Latin American student community; the University of Barcelona, where Spanish-speaking students integrate seamlessly while gaining a European education; and UCL in London, which has strong ties with Erasmus Mundus programs that specifically fund students from developing countries. Germany's technical universities (TU Munich, KIT) remain excellent options for STEM students, with many master's programs offered tuition-free even for international students.\n\nWhen choosing a European university, consider not just rankings but also your language comfort, the strength of the alumni network in your target field, the availability of scholarships for your nationality, and the city's cost of living. The GotAccepted team has helped students navigate these decisions for years — reach out to our mentors for a personalized roadmap tailored to your profile and goals."
  },
  {
    id: "b3",
    slug: "scholarship-interview-prep",
    title: "How to Ace Your Scholarship Interview",
    excerpt: "A comprehensive guide on the most common questions and how to answer them with confidence.",
    author: "John Smith",
    authorRole: "Strategic Advisor",
    authorAvatar: "/images/victor_izquierda.png",
    date: "May 05, 2026",
    readingTime: "5 min read",
    category: "Application Tips",
    imageUrl: "/images/gotaccepted_mobile_mockup.png",
    content: "The interview is your chance to show the scholarship committee who you are beyond your papers. Many applicants prepare extensively for the written portion of their application but arrive at the interview underprepared — and it shows. The good news is that scholarship interviews follow predictable patterns, and with deliberate preparation, you can enter the room feeling confident and authentic.\n\nThe most common interview questions fall into three categories: motivational (\"Why do you want this scholarship?\"), situational (\"Tell me about a time you faced a significant challenge\"), and future-oriented (\"What do you plan to do with this degree?\"). For each category, prepare two to three specific stories from your life that you can adapt to different framings. The STAR method (Situation, Task, Action, Result) is a useful structure for situational answers — but practice until your answers sound natural, not rehearsed.\n\nOne often-overlooked element is your closing question. When the interviewer asks \"Do you have any questions for us?\" this is not a courtesy — it is another evaluation. Prepare two thoughtful questions that show you have researched the scholarship program in depth. Asking about the experiences of previous recipients, or how the organization measures its impact, signals genuine interest and intellectual curiosity. At GotAccepted, we run mock interview sessions with real scholarship reviewers, and we have seen students transform their performance with just two or three practice runs."
  },
  {
    id: "b4",
    slug: "visa-application-process",
    title: "Navigating the Student Visa Process with Ease",
    excerpt: "Everything you need to know about the paperwork, the interview, and the timeline for your visa.",
    author: "Alice Johnson",
    authorRole: "Board Member",
    authorAvatar: "/images/victor_izquierda.png",
    date: "May 02, 2026",
    readingTime: "10 min read",
    category: "University Life",
    imageUrl: "/images/gotaccepted_mobile_mockup.png",
    content: "Getting your acceptance letter is just the beginning. The visa process can be daunting — especially for first-generation international students who have no family members who have navigated it before. The F-1 student visa for the United States, the Tier 4 for the UK, and the various national student visas for European countries all have different requirements, timelines, and interview formats. Starting early is the single most important piece of advice we can give.\n\nFor a US F-1 visa, you should begin the process as soon as you receive your I-20 form from your university — typically 90 to 120 days before your program start date. The key documents you will need include your acceptance letter, proof of financial support (bank statements covering at least one year of tuition and living expenses), your SEVIS fee receipt, and your DS-160 form. The consular interview itself is usually brief — 3 to 10 minutes — and focuses on your ties to your home country, your academic plans, and your intention to return after your studies.\n\nFor European visas, the process varies significantly by country. Germany's student visa requires a blocked account (Sperrkonto) with approximately €11,000 to prove financial support. The Netherlands requires proof of enrollment and health insurance. Spain has one of the more complex processes for long-stay student visas, requiring notarized documents and a criminal background check. Regardless of your destination, work backward from your program start date, identify every document required, and create a timeline with two weeks of buffer for unexpected delays. The GotAccepted team has guided students through visas to over 20 countries — we are here to help."
  },
  {
    id: "b5",
    slug: "gotaccepted-anniversary-impact",
    title: "Celebrating 5 Years of Educational Impact",
    excerpt: "Reflecting on our journey and the hundreds of students who have changed their lives through GotAccepted.",
    author: "Victor Name",
    authorRole: "CEO & Founder",
    authorAvatar: "/images/victor_izquierda.png",
    date: "April 28, 2026",
    readingTime: "4 min read",
    category: "NGO News",
    imageUrl: "/images/gotaccepted_mobile_mockup.png",
    content: "Five years ago, we started with a simple dream: to make global education accessible to Latino students who deserved the same opportunities as anyone else, regardless of their economic background or the geographic accident of where they were born. We were a small group of Peruvian-American youths who had navigated the complex landscape of US university admissions ourselves — and we knew how many talented students were left behind simply because they didn't know where to start.\n\nIn five years, GotAccepted has grown from a WhatsApp group into a structured NGO with programs in mentorship, scholarship curation, essay coaching, and university preparation. We have partnered with SENAJU (the National Secretariat of Youth in Peru) and worked with students across Peru, Colombia, Mexico, and beyond. We have seen students from small towns who never imagined studying abroad gain acceptance to universities in the United States, the United Kingdom, the Netherlands, and Germany. Each of those moments — the message at 2am saying \"I got in!\" — is why we do this work.\n\nAs we enter our sixth year, we are expanding our programs, deepening our scholarship database, and building a mentorship network that will last beyond any individual team member. We believe the next generation of global Latino leaders is out there — and we intend to help as many of them as possible find their path. Thank you to every student who trusted us with their story, every mentor who volunteered their time, and every partner who believed in our mission."
  }
];

