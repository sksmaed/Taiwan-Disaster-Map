// Simple client-side persistence helpers using localStorage
// Focus: comments, user-added disasters, and extra stories for base disasters

import { Comment, Disaster, StoryPreview } from '../types';

const KEY_COMMENTS = 'tdm-comments';
const KEY_USER_DISASTERS = 'tdm-user-disasters';
const KEY_DISASTER_STORY_ADDITIONS = 'tdm-disaster-story-additions';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (_e) {
    return fallback;
  }
}

// Comments
export function loadComments(): { [key: number]: Comment[] } {
  return safeParse(localStorage.getItem(KEY_COMMENTS), {} as { [key: number]: Comment[] });
}

export function saveComments(data: { [key: number]: Comment[] }) {
  localStorage.setItem(KEY_COMMENTS, JSON.stringify(data));
}

// User-added disasters
export function loadUserDisasters(): Disaster[] {
  return safeParse(localStorage.getItem(KEY_USER_DISASTERS), [] as Disaster[]);
}

export function saveUserDisasters(data: Disaster[]) {
  localStorage.setItem(KEY_USER_DISASTERS, JSON.stringify(data));
}

// Additional stories for base disasters (id -> stories[])
export function loadDisasterStoryAdditions(): { [key: number]: StoryPreview[] } {
  return safeParse(localStorage.getItem(KEY_DISASTER_STORY_ADDITIONS), {} as { [key: number]: StoryPreview[] });
}

export function saveDisasterStoryAdditions(data: { [key: number]: StoryPreview[] }) {
  localStorage.setItem(KEY_DISASTER_STORY_ADDITIONS, JSON.stringify(data));
}

