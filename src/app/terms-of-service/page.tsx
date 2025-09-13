
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
           <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-headline">1. Agreement to Terms</h2>
            <p>
              By accessing or using our peer-to-peer car sharing marketplace platform (the "Service"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. These Terms constitute a legally binding agreement between you and DriveIO, Inc. ("DriveIO", "we", "us", or "our"). If you do not agree to these Terms, you have no right to obtain information from or otherwise continue using the Service. Failure to use the Service in accordance with these Terms may subject you to civil and criminal penalties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-headline">2. The DriveIO Service</h2>
            <p>
              The Service provides a platform that connects vehicle owners ("Hosts") with individuals seeking to rent those vehicles ("Renters" or "Guests"). DriveIO is not a rental car company and does not own, control, or operate any vehicles listed on the platform. We act solely as an intermediary marketplace. When a Renter books a car from a Host, they are entering into a rental agreement directly with each other. DriveIO is not a party to this agreement. We are not responsible for the condition of the vehicles, the conduct of our users, or the performance of any booking.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-headline">3. Eligibility and User Accounts</h2>
            <p>
              To access and use the Service, you must register for an account. You must be at least 21 years of age (or older, depending on local regulations and vehicle type) and hold a valid driver's license. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. We reserve the right to suspend or terminate your account if any information provided proves to be inaccurate, fraudulent, not current, or incomplete. You are responsible for safeguarding your password and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-headline">4. Renter Obligations</h2>
            <p>
              As a Renter, you are responsible for:
            </p>
             <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Returning the vehicle on time and in the same condition it was received, subject to ordinary wear and tear.</li>
                <li>Adhering to the mileage and fuel policies set by the Host.</li>
                <li>Paying all applicable fees, including rental fees, trip fees, taxes, and any fines (e.g., parking tickets, traffic violations) incurred during your rental period.</li>
                <li>Operating the vehicle in a safe and lawful manner and in compliance with all applicable laws.</li>
                <li>Ensuring that only you, the approved driver, operate the vehicle.</li>
             </ul>
             <p className="mt-2">Smoking and pets are strictly prohibited in vehicles unless explicitly permitted by the Host in the vehicle listing.</p>
          </section>

           <section>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-headline">5. Host Obligations</h2>
            <p>
             As a Host, you represent and warrant that you have the legal right to rent out the vehicle you list. You agree to:
            </p>
             <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Provide a safe, clean, legally registered, and well-maintained vehicle that is in good mechanical condition.</li>
                <li>Accurately describe your vehicle in your listing, including any defects, restrictions, or special conditions.</li>
                <li>Honor all confirmed bookings and make the vehicle available to the Renter as agreed.</li>
                <li>Maintain valid vehicle insurance that meets or exceeds the minimum legal requirements for your location.</li>
             </ul>
          </section>
          
           <section>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-headline">6. Prohibited Activities</h2>
            <p>
             You agree not to engage in any of the following prohibited activities: using the Service for any commercial purpose not expressly permitted by these Terms; using the vehicle for any illegal activity, including transportation of illegal substances; allowing any person other than the approved driver to operate the vehicle; using the vehicle for racing, towing, or off-roading (unless explicitly permitted by the Host for specific vehicles); or violating any other terms or policies communicated by DriveIO or the Host.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-headline">7. Limitation of Liability and Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, DRIVEIO DISCLAIMS ALL WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. DRIVEIO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES, INCLUDING WITHOUT LIMITATION, ANY DEFAMATORY, OFFENSIVE, OR ILLEGAL CONDUCT OF OTHER USERS OR THIRD PARTIES; (C) ANY CONTENT OBTAINED FROM THE SERVICES; OR (D) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.
            </p>
          </section>
           <section>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-headline">8. Indemnification</h2>
            <p>
             You agree to release, defend, indemnify, and hold DriveIO and its affiliates and subsidiaries, and their officers, directors, employees, and agents, harmless from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the Service or your violation of these Terms.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
