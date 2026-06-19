export interface GalleryImage {
  id: number;
  title: string;
  description: string;
  filename: string;
  category: string;
  thumbUrl: string;
  mediumUrl: string;
  originalUrl: string;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}

export interface GalleryResponse {
  success: boolean;
  data: GalleryImage[];
  nextCursor: number | null;
}