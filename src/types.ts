export type Screen = 'home' | 'resources' | 'booking' | 'my-reservations';

export interface Resource {
  id: string;
  name: string;
  category: string;
  image: string;
  sportType: string;
  resourceType?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Reservation {
  id: string;
  resource: {
    name: string;
    category: string;
    image: string;
  };
  date: Date;
  slot: TimeSlot;
  description: string;
  materials?: { id: string; name: string; quantity: number }[];
  status: 'confirmed' | 'cancelled';
  createdAt: Date;
}
