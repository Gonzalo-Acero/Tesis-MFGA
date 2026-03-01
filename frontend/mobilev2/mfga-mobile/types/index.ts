export interface SessionUser {
  UserId: number | null;
  Name: string;
  Email: string;
  PhoneNumber?: string | null;
  AvatarUrl?: string | null;
  LastLogin?: string | null;
  CreationDate?: string | null;
  IsActive?: boolean;
  is_verified?: boolean;
}

export interface SessionPayload {
  provider: 'custom-api';
  token: string | null;
  user: SessionUser | null;
  raw?: unknown;
  createdAt: number;
}

export interface DestinationAudioGuide {
  title: string;
  src: string;
}

export interface Destination {
  id: string;
  name: string;
  city: string;
  province: string;
  category: string;
  tag: string;
  description: string;
  image: string;
  heroImage: string;
  gallery: string[];
  highlights: string[];
  bestTimeToVisit: string;
  estimatedBudget: string;
  duration: string;
  mapEmbedUrl: string;
  audioGuides: DestinationAudioGuide[];
  tips: string[];
}

export interface GuideCatalogItem {
  id: number;
  title: string;
  category: string;
  location: string;
  duration: string;
  imageUrl: string;
  description: string;
  guideName: string;
  rating: number;
  reviews: number;
  completed: number;
  audioUrl?: string | null;
  guideId?: number | null;
  featured?: boolean;
}

export interface GuideProfileContent {
  key: string;
  names: string[];
  location: string;
  description: string;
  imageUrl?: string | null;
}

export interface GuideDirectoryItem {
  GuideId: number;
  Name: string;
  AvatarUrl?: string | null;
  IsActive?: boolean;
  CreatedAt?: string;
}

export interface GuideDetail extends GuideDirectoryItem {
  ratingAverage: number | null;
  ratingCount: number;
}

export interface GuideComment {
  GuideCommentId?: number;
  GuideId: number;
  UserId: number;
  UserName?: string;
  Comment: string;
  CreatedAt: string;
}

export interface GuideRatingSummary {
  ratingAverage: number | null;
  ratingCount: number;
}

export interface NearbyAttraction {
  id: number;
  name: string;
  description: string;
  category: string;
  province: string;
  imageUrl: string;
  lat: number;
  lng: number;
  distanceKm: number | null;
  rating: number;
}

export interface CommunityPost {
  id: number;
  userId?: number;
  author: string;
  avatar: string;
  location: string;
  region: string;
  category: string;
  message: string;
  image: string | null;
  createdAt: string | null;
  likeCount: number;
  commentCount: number;
  liked: boolean;
  bookmarked: boolean;
}

export interface CommunityComment {
  id: number;
  postId: number;
  userId: number;
  userName: string;
  comment: string;
  createdAt: string;
}

export interface CommunityGroup {
  id: number;
  icon: 'compass' | 'coffee' | 'mountain' | 'home';
  name: string;
  description: string;
  members: number;
}

export interface CommunityMeetup {
  id: number;
  day: string;
  month: string;
  title: string;
  location: string;
  summary: string;
  attendees: number;
}
