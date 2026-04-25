
import data from '@/app/lib/placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  price: number;
  category: string;
  story: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
