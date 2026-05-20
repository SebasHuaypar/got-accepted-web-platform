export interface NavItem {
  label: string;
  href: string;
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "Undergraduate" | "Graduate" | "Scholarships" | "Workshops";
  duration?: string;
  imageUrl?: string;
  nextIntake?: string;
  availability?: string;
}

export interface Scholarship {
  id: string;
  title: string;
  institution: string;
  institutionLogo?: string;
  amount: string;
  deadline: string;
  category: string[];
  description: string;
  requirements: string[];
  link: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  date: string;
  readingTime: string;
  category: string;
  imageUrl: string;
  content: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  category?: "BOARD" | "TEAM";
  avatarUrl?: string;
  linkedin?: string;
  instagram?: string;
  group?: string;
}

export interface DbProgram {
  id: string | number;
  slug: string;
  title: string;
  description: string;
  category: "Undergraduate" | "Graduate" | "Scholarships" | "Workshops";
  duration: string | null;
  image_url: string | null;
  next_intake: string | null;
  availability: string | null;
}

export interface DbScholarship {
  id: string | number;
  title: string;
  institution: string;
  institution_logo: string | null;
  amount: string;
  deadline: string;
  category: string[] | null;
  description: string;
  requirements: string[] | null;
  link: string;
}

export interface DbBlogPost {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  author_role: string;
  author_avatar: string | null;
  date: string;
  reading_time: string;
  category: string;
  image_url: string;
  content: string;
  created_at?: string;
}

export interface DbMember {
  id: string | number;
  name: string;
  role: string;
  category: "BOARD" | "TEAM";
  avatar_url: string | null;
  linkedin: string | null;
  instagram: string | null;
  group: string | null;
}
