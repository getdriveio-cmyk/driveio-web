
import Link from 'next/link';
import Logo from './logo';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm">
              Your journey, your car. Seamless rentals at your fingertips.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-primary"><Facebook size={20} /></Link>
              <Link href="https://x.com/GetDriveIO" className="hover:text-primary"><Twitter size={20} /></Link>
              <Link href="#" className="hover:text-primary"><Instagram size={20} /></Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold font-headline mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
              <li><Link href="/press" className="hover:text-primary">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold font-headline mb-4">Hosting</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/host" className="hover:text-primary">List Your Car</Link></li>
              <li><Link href="/hosting/guidelines" className="hover:text-primary">Host Guidelines</Link></li>
              <li><Link href="/hosting/insurance" className="hover:text-primary">Insurance & Protection</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold font-headline mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help-center" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DriveIO, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
