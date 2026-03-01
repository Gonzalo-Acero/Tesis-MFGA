export interface Destination {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  location: string;
  tags: string[];
  overview: string;
  highlights: string[];
  tips: string[];
}

export interface AudioGuide {
  id: string;
  title: string;
  category: string;
  duration: string;
  rating: number;
  image: string;
  narrator: string;
}

export interface NearbyPlace {
  id: string;
  name: string;
  category: string;
  distance: string;
  image: string;
  lat: number;
  lng: number;
}

export interface CommunityPost {
  id: string;
  userName: string;
  userAvatar: string;
  place: string;
  photo: string;
  caption: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  timeAgo: string;
}
