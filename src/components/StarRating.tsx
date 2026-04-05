import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingProps = {
  rating: number;
  className?: string;
  starClassName?: string;
};

export function StarRating({ rating, className, starClassName }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={cn('w-5 h-5 text-foreground fill-foreground', starClassName)} />
      ))}
      {halfStar && <StarHalf className={cn('w-5 h-5 text-foreground fill-foreground', starClassName)} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={cn('w-5 h-5 text-foreground/30 fill-foreground/30', starClassName)} />
      ))}
    </div>
  );
}
