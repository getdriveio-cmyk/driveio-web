
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  location: string;
  comment: string;
  avatar: string;
}

const TestimonialCard = ({ name, location, comment, avatar }: TestimonialCardProps) => {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">{name}</p>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
        </div>
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          ))}
        </div>
        <p className="text-muted-foreground flex-grow">&quot;{comment}&quot;</p>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
