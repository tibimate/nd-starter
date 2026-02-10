export interface User {
  id: number
  username: string
  email: string
  first_name: string | null
  last_name: string | null
  is_staff: boolean
  permissions: string[]
}

export interface ImageThumbnails {
  extra_small: string
  small: string
  medium: string
  large: string
  original: string
}

export interface Profile {
  avatar: string | null | undefined
  created_at: string
  updated_at: string
  last_activity: string
  avatar_thumbnails: ImageThumbnails | null,
  first_name: string | null,
  last_name: string | null,
  user: User,
}

export interface APISession {
    access: string;
    exp: number;
    created_at: Date;
    updated_at: Date;
    last_activity: Date | null;
    profile: Profile;
    refresh: string;
  }
