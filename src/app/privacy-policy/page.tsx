
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PrivacyPolicyPage() {
    const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Legal Policies</h1>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>
      
      <section className="w-full pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
            <Tabs defaultValue="privacy" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto h-auto">
                    <TabsTrigger value="privacy" className="py-3">Privacy Policy</TabsTrigger>
                    <TabsTrigger value="terms" className="py-3">Terms & Conditions</TabsTrigger>
                    <TabsTrigger value="refund" className="py-3">Refund Policy</TabsTrigger>
                </TabsList>
                
                <Card className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl mt-8">
                    <CardContent className="p-8 md:p-12 text-muted-foreground prose prose-invert prose-lg max-w-none">
                        <TabsContent value="privacy">
                            <div className="space-y-6">
                                <p>
                                    ESystemLk ("us", "we", or "our") operates the ESystemLk website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
                                </p>

                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">Information Collection and Use</h2>
                                <p>
                                    We collect several different types of information for various purposes to provide and improve our Service to you.
                                </p>

                                <h3 className="font-headline text-xl font-bold text-foreground">Types of Data Collected</h3>
                                <h4>Personal Data</h4>
                                <p>
                                    While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to: Email address, First name and last name, Phone number, Cookies and Usage Data.
                                </p>
                                
                                <h4>Usage Data</h4>
                                <p>
                                    We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                                </p>

                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">Use of Data</h2>
                                <p>ESystemLk uses the collected data for various purposes:</p>
                                <ul>
                                    <li>To provide and maintain the Service</li>
                                    <li>To notify you about changes to our Service</li>
                                    <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                                    <li>To provide customer care and support</li>
                                    <li>To provide analysis or valuable information so that we can improve the Service</li>
                                    <li>To monitor the usage of the Service</li>
                                    <li>To detect, prevent and address technical issues</li>
                                </ul>
                                
                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">Security of Data</h2>
                                <p>
                                    The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                                </p>

                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">Changes to This Privacy Policy</h2>
                                <p>
                                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.
                                </p>
                                
                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">Contact Us</h2>
                                <p>
                                    If you have any questions about this Privacy Policy, please contact us by visiting the contact page on our website.
                                </p>
                            </div>
                        </TabsContent>
                        <TabsContent value="terms">
                             <div className="space-y-6">
                                <h2 className="font-headline text-2xl font-bold text-foreground">1. Agreement to Terms</h2>
                                <p>
                                    By using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We may modify these terms at any time, and such modifications will be effective immediately upon posting.
                                </p>
                                
                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">2. User Accounts</h2>
                                <p>
                                    To access some features of the service, you may be required to create an account. You are responsible for safeguarding your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                                </p>

                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">3. Intellectual Property</h2>
                                <p>
                                    The Service and its original content, features, and functionality are and will remain the exclusive property of ESystemLk and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of ESystemLk.
                                </p>

                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">4. Prohibited Activities</h2>
                                <p>You agree not to engage in any of the following prohibited activities:</p>
                                <ul>
                                    <li>Copying, distributing, or disclosing any part of the service in any medium.</li>
                                    <li>Using any automated system, including "robots," "spiders," "offline readers," etc., to access the service.</li>
                                    <li>Transmitting spam, chain letters, or other unsolicited email.</li>
                                    <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the service.</li>
                                </ul>

                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">5. Termination</h2>
                                <p>
                                    We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                                </p>
                                
                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">6. Limitation of Liability</h2>
                                <p>
                                    In no event shall ESystemLk, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                                </p>
                                
                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">7. Governing Law</h2>
                                <p>
                                    These Terms shall be governed and construed in accordance with the laws of Sri Lanka, without regard to its conflict of law provisions.
                                </p>

                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">Contact Us</h2>
                                <p>
                                    If you have any questions about these Terms, please contact us.
                                </p>
                            </div>
                        </TabsContent>
                        <TabsContent value="refund">
                            <div className="space-y-6">
                                <h2 className="font-headline text-2xl font-bold text-foreground">1. General Policy</h2>
                                <p>
                                    At ESystemLk, we are committed to providing high-quality services to our clients. Our refund policy is designed to be transparent and fair. Due to the nature of our custom web development and digital services, our policy on refunds is as follows.
                                </p>

                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">2. Non-Refundable Services</h2>
                                <p>
                                    <strong>Advance Payments & Deposits:</strong> All advance payments or deposits made to initiate a project are non-refundable. These funds are used to allocate resources, begin discovery and design phases, and secure project timelines.
                                </p>
                                <p>
                                    <strong>Services Rendered:</strong> Payments for work already completed, milestones achieved, or hours already logged are non-refundable. Once a service has been performed or a project phase has been completed as per the project agreement, the fees for that work are final.
                                </p>
                                 <p>
                                    <strong>POS System Rentals:</strong> Monthly rental fees for our Point of Sale (POS) systems are non-refundable. The initial setup fee is also non-refundable once the system has been installed or configured.
                                </p>


                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">3. Exceptional Circumstances</h2>
                                <p>
                                    In the rare event of a failure to deliver the agreed-upon services from our end, a partial or full refund may be considered on a case-by-case basis. This will be determined at the sole discretion of ESystemLk management after a thorough review of the project and circumstances.
                                </p>

                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">4. Project Cancellation</h2>
                                <p>
                                    If a client chooses to cancel a project after it has commenced, any payments made up to that point will not be refunded. The client will be responsible for payment for all work completed up to the cancellation date that has not yet been billed.
                                </p>

                                <h2 className="font-headline text-2xl font-bold text-foreground pt-4">5. Contact Us</h2>
                                <p>
                                    If you have any questions about our Refund Policy, please contact us. We are happy to discuss any concerns you may have before starting a project.
                                </p>
                            </div>
                        </TabsContent>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
      </section>
    </>
  );
}
