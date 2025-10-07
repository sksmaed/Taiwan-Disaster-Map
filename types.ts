export enum DisasterType {
  Earthquake = "地震",
  Typhoon = "颱風",
  Landslide = "山崩",
  Fire = "火災",
  Flood = "水災",
  Accident = "重大事故",
}

export enum CommentTag {
  Reflection = "反思",
  Experience = "經驗分享",
  Suggestion = "防災建議",
}

export interface StoryPreview {
  title: string;
  url: string;
}

export interface Disaster {
  id: number;
  name: string;
  type: DisasterType;
  date: string;
  location: [number, number];
  description: string;
  casualties: string;
  stories: StoryPreview[];
}

export interface Comment {
  id: number;
  author: string;
  avatar: string;
  timestamp: string;
  text: string;
  likedBy: string[];
  tag: CommentTag;
  replies?: Comment[];
}

export interface User {
  name: string;
  avatar: string;
  password?: string;
}

// FIX: Add missing types for Gemini service
export enum Perspective {
  Survivor = "倖存者",
  Rescuer = "救難人員",
  Journalist = "記者",
  Family = "家屬",
}

export interface RealStory {
  uri: string;
  title: string;
}

export interface StorySearchResult {
  summary: string;
  stories: RealStory[];
}