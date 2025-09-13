import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <text x="0" y="30" className="font-headline" fontSize="30" fontWeight="bold" fill="hsl(var(--primary))">
      DriveIO
    </text>
  </svg>
);

export default Logo;
