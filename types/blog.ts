export interface PlaceImage {
  id: string;
  url: string;
  caption?: string;
  alt: string;
  location?: string;
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  placeImages: PlaceImage[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  createdAt?: string;
  isPublished: boolean;
  readingTime: number;
  tags?: string[];
  featured?: boolean;
}

export interface JourneyImage {
  id: string;
  url: string;
  caption?: string;
  alt?: string;
  location?: string;
  takenAt?: string;
}

export interface Journey {
  id: string;
  _id?: string;
  title: string;
  description?: string;
  coverImage?: string;
  images: JourneyImage[];
  location?: string;
  date: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogFormData {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  placeImages?: PlaceImage[];
  author?: string;
  isPublished: boolean;
  tags?: string[];
  featured?: boolean;
}

export interface JourneyFormData {
  title: string;
  description?: string;
  coverImage?: string;
  images?: JourneyImage[];
  location?: string;
  date?: string;
  isPublished: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface About {
  id: string;
  name: string;
  tagline: string;
  profileImage?: string;
  bio: string;
  story?: string;
  location?: string;
  email?: string;
  socialLinks: SocialLink[];
  resumeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Gear {
  id: string;
  name: string;
  category: 'camera' | 'lens' | 'audio' | 'laptop' | 'accessories' | 'travel' | 'other';
  description?: string;
  image?: string;
  amazonUrl?: string;
  price?: string;
  rating?: number;
  isFavorite: boolean;
  isPublished: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}
