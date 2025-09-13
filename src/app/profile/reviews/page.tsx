
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const reviewsAboutYou = [
  {
    id: 'review1',
    hostName: 'Eleanor Vance',
    hostAvatar: 'https://picsum.photos/seed/host1/100/100',
    vehicleName: 'Tesla Model 3',
    rating: 5,
    comment: "A perfect renter! The car was returned clean and on time. Would gladly rent to them again.",
    date: "2024-07-28",
  },
   {
    id: 'review2',
    hostName: 'Marcus Thorne',
    hostAvatar: 'https://picsum.photos/seed/host2/100/100',
    vehicleName: 'Ford Bronco',
    rating: 5,
    comment: "Great communication and very respectful of the vehicle. Highly recommended.",
    date: "2024-06-20",
  },
];

const reviewsByYou = [
   {
    id: 'review3',
    hostName: 'Eleanor Vance',
    hostAvatar: 'https://picsum.photos/seed/host1/100/100',
    vehicleName: 'Tesla Model 3',
    rating: 5,
    comment: "Amazing car, so smooth to drive. Eleanor was a great host!",
    date: "2024-07-28",
  },
]

const ReviewCard = ({ review }: { review: any }) => (
    <Card>
        <CardContent className="p-4">
            <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={review.hostAvatar} alt={review.hostName} />
                    <AvatarFallback>{review.hostName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold">{review.hostName}</p>
                            <p className="text-sm text-muted-foreground">{review.vehicleName}</p>
                        </div>
                         <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                            ))}
                        </div>
                    </div>
                    <p className="mt-2 text-muted-foreground">&quot;{review.comment}&quot;</p>
                     <p className="text-xs text-muted-foreground mt-2">{new Date(review.date).toLocaleDateString()}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function MyReviewsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Reviews</CardTitle>
                <CardDescription>
                    Here you can see reviews from hosts and review your own past feedback.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="about_you">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="about_you">Reviews About You</TabsTrigger>
                        <TabsTrigger value="by_you">Reviews By You</TabsTrigger>
                    </TabsList>
                    <TabsContent value="about_you" className="pt-4">
                        <div className="space-y-4">
                           {reviewsAboutYou.map(review => (
                               <ReviewCard key={review.id} review={review} />
                           ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="by_you" className="pt-4">
                        <div className="space-y-4">
                            {reviewsByYou.map(review => (
                               <ReviewCard key={review.id} review={review} />
                           ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
