export interface User {
  name: string;
  email: string;
  password?: string; // Password is used for creation/storage but not exposed elsewhere
}

export interface Media {
  dataUrl?: string; // For client-side preview of new uploads
  url?: string; // For media stored on the server
  name: string;
  type: string;
}

// A "Post" is now a single announcement again, but with multiple media files.
export interface Post {
  id:string;
  title: string;
  author: string; // Admin's name
  content: string;
  media: Media[];
  timestamp: string;
}

export interface Marquee {
  id: string;
  text: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  content: string;
  timestamp: string;
  reports: string[]; // Stores names of users who reported
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  postId: string;
  question: string;
  options: PollOption[];
}

export interface AdminUpdate {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}
