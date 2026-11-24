export interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  whatsapp?: string;
}

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  facebook: 'https://www.facebook.com/AnjumanTalabaeIslamOfficial/',
  twitter: 'https://twitter.com/atiuaf',
  instagram: 'https://www.instagram.com/atiuaf/',
  youtube: 'https://www.youtube.com/@atiuaf',
  whatsapp: '+923172011968',
};

export interface ContactInfo {
  email: string;
  phone: string;
  phoneSecondary?: string;
  address: string;
}

export const DEFAULT_CONTACT_INFO: ContactInfo = {
  email: 'atiuafpak@gmail.com',
  phone: '+92 317 2011968',
  phoneSecondary: '0314 8015678',
  address: 'Jinnah Hall, UAF, Faisalabad',
};

export interface ActivityItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  images: string[];
  createdAt?: string;
  featured?: boolean;
  organizer?: string;
  badgeColor?: 'green' | 'red';
}

export interface SubscriberItem {
  email: string;
  subscribedAt: string;
  active: boolean;
}
