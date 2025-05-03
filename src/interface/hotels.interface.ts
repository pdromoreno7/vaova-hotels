// src/types/hotel.ts
export interface RoomInventory {
  available: number;
  price: number;
}

export interface Rooms {
  singleRoom: RoomInventory;
  twinRoom: RoomInventory;
  queenRoom: RoomInventory;
}

export interface GalleryImage {
  url: string;
  description?: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  country: string;
  state: string;
  city: string;
  logo: string;
  category: 3 | 4 | 5;
  rating: number;
  rooms: Rooms;
  gallery: GalleryImage[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
