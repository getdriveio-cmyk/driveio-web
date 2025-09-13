
import type { User, Vehicle, InsurancePlan, Booking, Testimonial } from '@/lib/types';

export const hosts: User[] = [
  {
    id: 'host1',
    name: 'Eleanor Vance',
    avatarUrl: 'https://picsum.photos/seed/host1/100/100',
    isVerified: true,
    joinedDate: '2021-05-15',
  },
  {
    id: 'host2',
    name: 'Marcus Thorne',
    avatarUrl: 'https://picsum.photos/seed/host2/100/100',
    isVerified: false,
    joinedDate: '2022-01-20',
  },
];

export const vehicles: Vehicle[] = [
  {
    id: 'vehicle1',
    name: 'Tesla Model 3',
    make: 'Tesla',
    model: 'Model 3',
    year: 2022,
    type: 'sedan',
    pricePerDay: 120,
    location: 'San Francisco, CA',
    rating: 4.9,
    reviewsCount: 82,
    features: ['Electric', 'Autopilot', 'A/C', '4 seats'],
    images: [
      'https://picsum.photos/seed/vehicle1-1/800/600',
      'https://picsum.photos/seed/vehicle1-2/800/600',
      'https://picsum.photos/seed/vehicle1-3/800/600',
      'https://picsum.photos/seed/vehicle1-4/800/600',
      'https://picsum.photos/seed/vehicle1-5/800/600',
      'https://picsum.photos/seed/vehicle1-6/800/600',
    ],
    host: hosts[0],
    description: 'Experience the future of driving with this sleek and powerful Tesla Model 3. Perfect for city trips and scenic drives.',
    policies: {
      cancellation: 'Full refund for cancellations made within 48 hours of booking.',
      mileage: '200 miles per day included. $0.50 per additional mile.',
      fuel: 'Return with at least 80% charge.',
    },
    reviews: [
      { id: 'rev1', reviewerName: 'Alice', rating: 5, comment: 'Amazing car, so smooth to drive. Eleanor was a great host!' },
      { id: 'rev2', reviewerName: 'Bob', rating: 4, comment: 'Great experience, though charging can be a bit of a hassle.' },
    ]
  },
  {
    id: 'vehicle2',
    name: 'Ford Bronco',
    make: 'Ford',
    model: 'Bronco',
    year: 2023,
    type: 'suv',
    pricePerDay: 150,
    location: 'Denver, CO',
    rating: 4.8,
    reviewsCount: 45,
    features: ['4x4', 'Convertible', 'A/C', '5 seats'],
    images: [
      'https://picsum.photos/seed/vehicle2-1/800/600',
      'https://picsum.photos/seed/vehicle2-2/800/600',
      'https://picsum.photos/seed/vehicle2-3/800/600',
      'https://picsum.photos/seed/vehicle2-4/800/600',
      'https://picsum.photos/seed/vehicle2-5/800/600',
      'https://picsum.photos/seed/vehicle2-6/800/600',
    ],
    host: hosts[1],
    description: 'Ready for an adventure? This Ford Bronco is built to handle any terrain. The perfect companion for exploring the mountains.',
    policies: {
      cancellation: 'Flexible cancellation policy.',
      mileage: '150 miles per day included. $0.75 per additional mile.',
      fuel: 'Return with a full tank of gas.',
    },
    reviews: [
        { id: 'rev3', reviewerName: 'Charlie', rating: 5, comment: 'Took this beast to the Rockies and it was flawless. Marcus was super helpful.' },
    ]
  },
  {
    id: 'vehicle3',
    name: 'Porsche 911 Carrera',
    make: 'Porsche',
    model: '911 Carrera',
    year: 2021,
    type: 'sports',
    pricePerDay: 450,
    location: 'Miami, FL',
    rating: 5.0,
    reviewsCount: 112,
    features: ['Sports Car', 'Convertible', 'A/C', '2 seats'],
    images: [
      'https://picsum.photos/seed/vehicle3-1/800/600',
      'https://picsum.photos/seed/vehicle3-2/800/600',
      'https://picsum.photos/seed/vehicle3-3/800/600',
      'https://picsum.photos/seed/vehicle3-4/800/600',
      'https://picsum.photos/seed/vehicle3-5/800/600',
      'https://picsum.photos/seed/vehicle3-6/800/600',
    ],
    host: hosts[0],
    description: 'Turn heads wherever you go. This Porsche 911 offers an exhilarating driving experience with timeless style.',
    policies: {
      cancellation: 'Strict cancellation policy. 50% refund up to a week prior to trip start.',
      mileage: '100 miles per day included. $1.50 per additional mile.',
      fuel: 'Return with a full tank of premium gas.',
    },
    reviews: [
      { id: 'rev4', reviewerName: 'Diana', rating: 5, comment: 'Dream car! Worth every penny for a weekend getaway.' },
      { id: 'rev5', reviewerName: 'Frank', rating: 5, comment: 'Immaculate condition. Host was professional and accommodating.' },
    ]
  },
  {
    id: 'vehicle4',
    name: 'Jeep Wrangler',
    make: 'Jeep',
    model: 'Wrangler',
    year: 2022,
    type: 'suv',
    pricePerDay: 130,
    location: 'Moab, UT',
    rating: 4.7,
    reviewsCount: 67,
    features: ['4x4', 'Off-road', 'A/C', '4 seats'],
    images: [
      'https://picsum.photos/seed/vehicle4-1/800/600',
      'https://picsum.photos/seed/vehicle4-2/800/600',
      'https://picsum.photos/seed/vehicle4-3/800/600',
      'https://picsum.photos/seed/vehicle4-4/800/600',
      'https://picsum.photos/seed/vehicle4-5/800/600',
      'https://picsum.photos/seed/vehicle4-6/800/600',
    ],
    host: hosts[1],
    description: 'The ultimate off-road machine. This Jeep Wrangler is equipped to take you on the most epic adventures in Moab.',
    policies: {
        cancellation: 'Flexible cancellation policy.',
        mileage: '150 miles per day included. $0.60 per additional mile.',
        fuel: 'Return with a full tank of gas.',
    },
    reviews: [
        { id: 'rev6', reviewerName: 'Grace', rating: 5, comment: 'This Jeep handled everything we threw at it. Unforgettable trip!' },
    ]
  },
  {
    id: 'vehicle5',
    name: 'Honda Civic',
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    type: 'sedan',
    pricePerDay: 75,
    location: 'San Francisco, CA',
    rating: 4.8,
    reviewsCount: 150,
    features: ['A/C', '4 seats'],
    images: [
      'https://picsum.photos/seed/vehicle5-1/800/600',
      'https://picsum.photos/seed/vehicle5-2/800/600',
      'https://picsum.photos/seed/vehicle5-3/800/600',
      'https://picsum.photos/seed/vehicle5-4/800/600',
      'https://picsum.photos/seed/vehicle5-5/800/600',
      'https://picsum.photos/seed/vehicle5-6/800/600',
    ],
    host: hosts[0],
    description: 'A reliable and fuel-efficient car for getting around the city.',
    policies: {
        cancellation: 'Flexible',
        mileage: '250 miles/day',
        fuel: 'Return full',
    },
    reviews: [
        { id: 'rev7', reviewerName: 'Heidi', rating: 5, comment: 'Perfect car for a quick trip.' },
    ]
  },
  {
    id: 'vehicle6',
    name: 'Toyota RAV4',
    make: 'Toyota',
    model: 'RAV4',
    year: 2021,
    type: 'suv',
    pricePerDay: 95,
    location: 'Denver, CO',
    rating: 4.9,
    reviewsCount: 95,
    features: ['4x4', 'A/C', '5 seats'],
    images: [
      'https://picsum.photos/seed/vehicle6-1/800/600',
      'https://picsum.photos/seed/vehicle6-2/800/600',
      'https://picsum.photos/seed/vehicle6-3/800/600',
      'https://picsum.photos/seed/vehicle6-4/800/600',
      'https://picsum.photos/seed/vehicle6-5/800/600',
      'https://picsum.photos/seed/vehicle6-6/800/600',
    ],
    host: hosts[1],
    description: 'A spacious and comfortable SUV for the whole family.',
    policies: {
        cancellation: 'Moderate',
        mileage: '200 miles/day',
        fuel: 'Return full',
    },
    reviews: [
        { id: 'rev8', reviewerName: 'Ivan', rating: 5, comment: 'Great family car, very spacious.' },
    ]
  },
    {
    id: 'vehicle7',
    name: 'Ford Mustang',
    make: 'Ford',
    model: 'Mustang',
    year: 2022,
    type: 'sports',
    pricePerDay: 250,
    location: 'Miami, FL',
    rating: 4.9,
    reviewsCount: 120,
    features: ['Convertible', 'A/C', '4 seats'],
    images: [
        'https://picsum.photos/seed/vehicle7-1/800/600',
        'https://picsum.photos/seed/vehicle7-2/800/600',
        'https://picsum.photos/seed/vehicle7-3/800/600',
        'https://picsum.photos/seed/vehicle7-4/800/600',
        'https://picsum.photos/seed/vehicle7-5/800/600',
        'https://picsum.photos/seed/vehicle7-6/800/600',
    ],
    host: hosts[0],
    description: 'A classic American muscle car for a fun ride.',
    policies: {
        cancellation: 'Strict',
        mileage: '150 miles/day',
        fuel: 'Return full',
    },
    reviews: [
        { id: 'rev9', reviewerName: 'Judy', rating: 5, comment: 'So much fun to drive!' },
    ]
  },
  {
    id: 'vehicle8',
    name: 'Ford F-150',
    make: 'Ford',
    model: 'F-150',
    year: 2020,
    type: 'truck',
    pricePerDay: 110,
    location: 'Moab, UT',
    rating: 4.8,
    reviewsCount: 80,
    features: ['4x4', 'A/C', '5 seats'],
    images: [
        'https://picsum.photos/seed/vehicle8-1/800/600',
        'https://picsum.photos/seed/vehicle8-2/800/600',
        'https://picsum.photos/seed/vehicle8-3/800/600',
        'https://picsum.photos/seed/vehicle8-4/800/600',
        'https://picsum.photos/seed/vehicle8-5/800/600',
        'https://picsum.photos/seed/vehicle8-6/800/600',
    ],
    host: hosts[1],
    description: 'A tough and rugged truck for any job.',
    policies: {
        cancellation: 'Flexible',
        mileage: '200 miles/day',
        fuel: 'Return full',
    },
    reviews: [
        { id: 'rev10', reviewerName: 'Kevin', rating: 5, comment: 'Great truck, very capable.' },
    ]
  }
];

export const insurancePlans: InsurancePlan[] = [
    {
        id: 'plan_minimum',
        name: 'Minimum',
        pricePerDay: 18,
        description: 'State minimum liability coverage. Perfect for budget-conscious renters.'
    },
    {
        id: 'plan_standard',
        name: 'Standard',
        pricePerDay: 30,
        description: 'Includes liability coverage and physical damage protection with a deductible.'
    },
    {
        id: 'plan_premium',
        name: 'Premium',
        pricePerDay: 50,
        description: 'Comprehensive coverage with a low deductible for maximum peace of mind.'
    }
];

export const testimonials: Testimonial[] = [
    {
      name: 'Sarah K.',
      location: 'Los Angeles, CA',
      comment: 'The whole process was incredibly smooth. I found the perfect convertible for a weekend trip up the coast. The host was friendly and the car was immaculate. Will definitely use DriveIO again!',
      avatar: 'https://picsum.photos/seed/user1/100/100'
    },
    {
      name: 'Mike P.',
      location: 'Denver, CO',
      comment: 'Needed an SUV with 4x4 for a ski trip and found a great deal on a Ford Bronco. The AI assistant helped me find it in seconds. Pick-up was easy and the vehicle was a beast in the snow.',
      avatar: 'https://picsum.photos/seed/user2/100/100'
    },
    {
      name: 'Jessica L.',
      location: 'New York, NY',
      comment: 'I was hesitant about car sharing, but DriveIO made me a convert. The insurance options gave me peace of mind, and the car was exactly as described. So much better than a traditional rental agency.',
      avatar: 'https://picsum.photos/seed/user3/100/100'
    }
];
