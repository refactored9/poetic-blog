export interface PlaceImage {
  id: string;
  url: string;
  caption?: string;
  alt: string;
  location?: string;
}

export interface Blog {
  id: string;
  _id?: string;
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

// Route/Hiking Map types
export interface RouteCoordinate {
  lat: number;
  lng: number;
}

export interface RouteStop {
  id: string;
  name: string;
  description?: string;
  coordinates: RouteCoordinate;
  type: 'start' | 'stop' | 'viewpoint' | 'campsite' | 'water' | 'food' | 'danger' | 'end' | 'poi';
  elevation?: number;
  order: number;
  images?: string[];
}

export interface JourneyRoute {
  enabled: boolean;
  name?: string;
  description?: string;
  path: RouteCoordinate[];
  stops: RouteStop[];
  distance?: number;
  duration?: string;
  difficulty?: 'easy' | 'moderate' | 'difficult' | 'expert';
  elevationGain?: number;
  elevationLoss?: number;
  minElevation?: number;
  maxElevation?: number;
  mapCenter?: RouteCoordinate;
  mapZoom?: number;
  trailType?: 'loop' | 'out-and-back' | 'point-to-point' | 'network';
  bestSeason?: string[];
  warnings?: string[];
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
  route?: JourneyRoute;
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

// Guide/People types
export interface GuideLocation {
  city: string;
  state?: string;
  country: string;
}

export interface GuideContact {
  email?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  website?: string;
}

export interface GuidePriceRange {
  min?: number;
  max?: number;
  currency: string;
  unit: string;
}

export interface GuideGalleryImage {
  url: string;
  caption?: string;
  alt?: string;
}

export interface GuideHighlight {
  icon?: string;
  title: string;
  description?: string;
}

export interface Guide {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  tagline?: string;
  bio: string;
  profileImage?: string;
  coverImage?: string;
  location: GuideLocation;
  areasOfOperation: string[];
  experienceYears: number;
  languages: string[];
  specializations: string[];
  contact: GuideContact;
  priceRange?: GuidePriceRange;
  galleryImages: GuideGalleryImage[];
  rating: number;
  reviewCount: number;
  highlights: GuideHighlight[];
  isAvailable: boolean;
  availabilityNote?: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GuideFormData {
  name: string;
  tagline?: string;
  bio: string;
  profileImage?: string;
  coverImage?: string;
  location: GuideLocation;
  areasOfOperation?: string[];
  experienceYears?: number;
  languages?: string[];
  specializations?: string[];
  contact?: GuideContact;
  priceRange?: GuidePriceRange;
  galleryImages?: GuideGalleryImage[];
  highlights?: GuideHighlight[];
  isAvailable?: boolean;
  availabilityNote?: string;
  isPublished: boolean;
  isFeatured?: boolean;
}
