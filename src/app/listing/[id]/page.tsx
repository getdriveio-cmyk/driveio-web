
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Zap, User, Gauge, GitBranch, Snowflake, Car } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { BookingCard } from '@/components/booking-card';
import { getVehicle } from '@/lib/firestore';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import FavoriteButton from '@/components/favorite-button';
import type { Metadata } from 'next';

const featureIcons: { [key: string]: React.ReactNode } = {
  'Electric': <Zap className="w-5 h-5" />,
  '4 seats': <User className="w-5 h-5" />,
  '5 seats': <User className="w-5 h-5" />,
  '2 seats': <User className="w-5 h-5" />,
  'Autopilot': <Gauge className="w-5 h-5" />,
  '4x4': <GitBranch className="w-5 h-5" />,
  'Convertible': <Car className="w-5 h-5" />,
  'Sports Car': <Zap className="w-5 h-5" />,
  'Off-road': <GitBranch className="w-5 h-5" />,
  'A/C': <Snowflake className="w-5 h-5" />,
};

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vehicle = await getVehicle(params.id);

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found',
    }
  }
 
  return {
    title: `Rent the ${vehicle.name} in ${vehicle.location}`,
    description: vehicle.description,
    openGraph: {
        title: `Rent the ${vehicle.name} in ${vehicle.location}`,
        description: vehicle.description,
        images: [
            {
                url: vehicle.images[0],
                width: 800,
                height: 600,
                alt: vehicle.name,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `Rent the ${vehicle.name} in ${vehicle.location}`,
        description: vehicle.description,
        images: [vehicle.images[0]],
    }
  }
}


export default async function ListingPage({ params }: { params: { id: string } }) {
  const vehicle = await getVehicle(params.id);

  if (!vehicle) {
    notFound();
  }
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: vehicle.name,
    description: vehicle.description,
    image: vehicle.images[0],
    brand: {
      '@type': 'Brand',
      name: vehicle.make,
    },
    offers: {
      '@type': 'Offer',
      url: `https://getdriveio.com/listing/${vehicle.id}`,
      priceCurrency: 'USD',
      price: vehicle.pricePerDay,
      priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: vehicle.pricePerDay,
          priceCurrency: 'USD',
          unitText: 'day'
      },
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: vehicle.rating,
      reviewCount: vehicle.reviewsCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold font-headline">{vehicle.name}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
              <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span>{vehicle.rating} ({vehicle.reviewsCount} reviews)</span>
              </div>
              <span>&middot;</span>
              <span>{vehicle.location}</span>
              </div>
          </div>
          <FavoriteButton vehicleId={vehicle.id} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
              <Carousel className="w-full rounded-xl overflow-hidden">
                <CarouselContent>
                  {vehicle.images.map((imgSrc, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-[300px] md:h-[500px] w-full">
                        <Image 
                          src={imgSrc} 
                          alt={`${vehicle.name} image ${index + 1}`} 
                          fill 
                          className="object-cover" 
                          priority={index === 0}
                          data-ai-hint={`${vehicle.make} ${vehicle.model}`} 
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>


              <div className="flex justify-between items-start">
                  <div className="flex-grow space-y-2">
                      <h2 className="text-2xl font-bold font-headline">{vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)} hosted by {vehicle.host.name}</h2>
                      <div className="flex items-center gap-4 text-muted-foreground">
                          {vehicle.features.slice(0, 3).map(feature => (
                              <span key={feature} className="capitalize">{feature}</span>
                          ))}
                      </div>
                  </div>
                  <Link href={`/host/${vehicle.host.id}`}>
                      <Avatar className="h-16 w-16">
                          <AvatarImage src={vehicle.host.avatarUrl} alt={vehicle.host.name} />
                          <AvatarFallback>{vehicle.host.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                  </Link>
              </div>
              
              <Separator />
            
              <Card>
                  <CardHeader><CardTitle>About this car</CardTitle></CardHeader>
                  <CardContent>
                      <p>{vehicle.description}</p>
                      <Separator className="my-6" />
                      <h3 className="font-bold text-lg mb-4 font-headline">Features</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {vehicle.features.map(feature => (
                              <div key={feature} className="flex items-center gap-3">
                                  {featureIcons[feature] || <Zap className="w-5 h-5 text-muted-foreground" />}
                                  <span>{feature}</span>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader><CardTitle>Reviews</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                      {vehicle.reviews.map(review => (
                          <div key={review.id}>
                              <div className="flex items-center gap-3 mb-2">
                                  <Avatar className="h-10 w-10">
                                      <AvatarImage src={`https://picsum.photos/seed/${review.reviewerName}/40/40`} />
                                      <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                      <p className="font-bold">{review.reviewerName}</p>
                                      <div className="flex items-center">
                                          {[...Array(5)].map((_, i) => (
                                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                                          ))}
                                      </div>
                                  </div>
                              </div>
                              <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                      ))}
                  </CardContent>
              </Card>
          </div>

          <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                  <BookingCard vehicle={vehicle} />
              </div>
          </div>
        </div>
      </div>
    </>
  );
}
