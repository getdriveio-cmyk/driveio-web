
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-headline">1. Introduction</h2>
            <p>
              Welcome to DriveIO ("we," "us," or "our"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our car sharing marketplace (the "Service"). Please read this policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-headline">2. Information We Collect</h2>
            <p>
              We may collect information about you in a variety of ways. The information we may collect on the Service includes:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, address, email address, telephone number, and driver's license information that you voluntarily give to us when you register for an account.</li>
              <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we collect when you book a car or receive payments as a host. This information is passed directly to our payment processor and is not stored on our servers.</li>
              <li><strong>Geolocation Information:</strong> We may request access or permission to and track location-based information from your mobile device, either continuously or while you are using our Service, to provide location-based services such as finding nearby cars.</li>
              <li><strong>Vehicle Information:</strong> For hosts, we collect detailed information about your vehicle, including make, model, year, VIN, license plate, and photos.</li>
               <li><strong>Technical Data:</strong> Information our servers automatically collect when you access the Service, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-headline">3. Use of Your Information</h2>
            <p>
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Create and manage your account and facilitate the car sharing services.</li>
              <li>Process your transactions, bookings, and payments.</li>
              <li>Communicate with you regarding your account or bookings.</li>
              <li>Comply with legal requirements, including verifying driving records.</li>
              <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
              <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
              <li>Resolve disputes and troubleshoot problems.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-headline">4. Disclosure of Your Information</h2>
            <p>
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>
             <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
              <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
              <li><strong>Between Users:</strong> To facilitate a booking, we share necessary information between the renter and the host, such as names, vehicle location, and limited contact information after a trip is confirmed.</li>
              <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            </ul>
          </section>
          
           <section>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-headline">5. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </section>
          
           <section>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-headline">6. Your Data Rights</h2>
            <p>
              You have certain rights regarding your personal information. You may at any time review or change the information in your account or terminate your account by:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Logging into your account settings and updating your account.</li>
              <li>Contacting us using the contact information provided below.</li>
            </ul>
            <p className="mt-2">Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Service and/or comply with legal requirements.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-headline">7. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact our Data Protection Officer at: privacy@driveio.com.
            </p>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
