
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  isVerified: boolean;
  joinedDate: string;
  isAdmin?: boolean;
  isHost?: boolean;
  isBanned?: boolean;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
}

export interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  type: string;
  pricePerDay: number;
  location: string;
  rating: number;
  reviewsCount: number;
  features: string[];
  images: string[];
  host: User;
  description: string;
  policies: {
    cancellation: string;
    mileage: string;
    fuel: string;
  };
  reviews: Review[];
}

export interface InsurancePlan {
    id: string;
    name: string;
    pricePerDay: number;
    description: string;
}

export interface Booking {
  id: string;
  vehicle: Vehicle;
  renter: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  startDate: string;
  endDate: string;
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'declined';
}

export interface Testimonial {
    name: string;
    location: string;
    comment: string;
    avatar: string;
}
