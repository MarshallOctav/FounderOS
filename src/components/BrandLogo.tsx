import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
}

export default function BrandLogo({ className, imageClassName }: BrandLogoProps) {
  return (
    <span className={cn('flex items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm', className)}>
      <img
        src="/logo.png"
        alt="FounderOS"
        className={cn('h-full w-full object-cover', imageClassName)}
      />
    </span>
  );
}
