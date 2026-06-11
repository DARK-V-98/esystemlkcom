import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout, PolicySection, PolicyList } from "@/components/home/PolicyLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | ESYSTEMLK" },
      { name: "description", content: "Terms and Conditions governing the use of the ESYSTEMLK website and the purchase of our web development, software and design services." },
      { property: "og:title", content: "Terms & Conditions | ESYSTEMLK" },
      { property: "og:url", content: "https://www.esystemlk.com/terms" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PolicyLayout title="Terms & Conditions" lastUpdated="June 11, 2026">
      <PolicySection title="Welcome">
        <p>
          Welcome to ESYSTEMLK. These Terms and Conditions govern your use of our website
          (<strong>www.esystemlk.com</strong>) and the purchase of our services, including website
          development, web applications, software systems, logo design, branding, hosting and
          maintenance. By accessing our website or placing an order, you agree to comply with these
          terms. Please read them carefully before proceeding with any transaction.
        </p>
      </PolicySection>

      <PolicySection title="1. Use of the Website">
        <PolicyList
          items={[
            "You must be at least 18 years old to purchase services from our website.",
            "You agree to provide accurate and current information when contacting us or placing an order.",
            "You may not use our website or our free browser tools for any unlawful or unauthorized purpose.",
            "You are responsible for maintaining the confidentiality of any account or dashboard credentials we provide to you (e.g. cs.esystemlk.com).",
          ]}
        />
      </PolicySection>

      <PolicySection title="2. Services, Quotations & Pricing">
        <PolicyList
          items={[
            "All prices displayed on our website are starting prices; the final cost depends on the scope and complexity of your project and will be confirmed in a written quotation before work begins.",
            "Prices may be quoted in LKR or USD and are subject to change without notice. A confirmed quotation remains valid for the period stated on it.",
            "Promotions and discounts are valid for a limited time and may be subject to additional terms.",
          ]}
        />
      </PolicySection>

      <PolicySection title="3. Orders & Payments">
        <PolicyList
          items={[
            "By confirming a quotation or placing an order, you are making an offer to purchase the selected services.",
            "We reserve the right to refuse or cancel any order for any reason, including errors in pricing, scope conflicts or suspected fraudulent activity.",
            "Projects typically require an advance payment to begin, with the balance payable on agreed milestones or on delivery.",
            "You agree to provide valid payment information and authorize us to charge the agreed amounts to your chosen payment method.",
            "We use trusted third-party payment processors (such as PayHere) to handle online payments securely. We do not store or have access to your full card details.",
          ]}
        />
      </PolicySection>

      <PolicySection title="4. Project Delivery">
        <PolicyList
          items={[
            "We will make reasonable efforts to deliver projects within the agreed timeline. Typical websites are delivered in 2–4 weeks; larger systems in 6–10 weeks depending on scope.",
            "Delivery timelines are estimates and may vary based on project complexity and how promptly you provide required content, feedback and approvals.",
            "Design approval is required before development begins. Delays in client feedback may extend the delivery date accordingly.",
          ]}
        />
      </PolicySection>

      <PolicySection title="5. Maintenance & Support">
        <PolicyList
          items={[
            "All packages include lifetime free maintenance covering bug fixes, security patches, small content updates and uptime monitoring, for as long as you remain our client.",
            "New features or major changes outside the original scope will be quoted separately.",
            "Hosting and domains managed by us are transferable to you at any time on request.",
          ]}
        />
      </PolicySection>

      <PolicySection title="6. Refunds & Cancellations">
        <p>
          Cancellations and refunds are governed by our{" "}
          <a href="/refund-policy" className="text-neon font-semibold">Refund Policy</a>. Please refer to
          it for full details on when refunds are available and how they are processed.
        </p>
      </PolicySection>

      <PolicySection title="7. Intellectual Property">
        <PolicyList
          items={[
            "Upon full payment, ownership of the final deliverables (website, application, designs) created specifically for you is transferred to you, unless otherwise agreed in writing.",
            "ESYSTEMLK retains the right to display completed work in our portfolio unless you request otherwise (NDA available on request).",
            "All content and materials on www.esystemlk.com — including text, images, logos and graphics — are the property of ESYSTEMLK or its licensors and may not be used, reproduced or modified without our prior written consent.",
            "Third-party components, libraries and licenses used in your project remain subject to their respective license terms.",
          ]}
        />
      </PolicySection>

      <PolicySection title="8. Client Responsibilities">
        <PolicyList
          items={[
            "You confirm that any content, images or materials you provide for your project do not infringe the rights of any third party.",
            "You are responsible for the legality of the business activities conducted through any website or system we build for you.",
          ]}
        />
      </PolicySection>

      <PolicySection title="9. Limitation of Liability">
        <PolicyList
          items={[
            "In no event shall ESYSTEMLK, its directors, employees or affiliates be liable for any indirect, incidental, special or consequential damages arising out of or in connection with your use of our website or services.",
            "Our total liability for any claim shall not exceed the amount you paid for the specific service giving rise to the claim.",
            "While we maintain a strong uptime record, we are not liable for downtime or data loss caused by third-party hosting providers, force majeure events or factors beyond our reasonable control.",
          ]}
        />
      </PolicySection>

      <PolicySection title="10. Governing Law">
        <p>
          These Terms and Conditions are governed by and construed in accordance with the laws of the
          Democratic Socialist Republic of Sri Lanka, and any disputes shall be subject to the exclusive
          jurisdiction of the courts of Sri Lanka.
        </p>
      </PolicySection>

      <PolicySection title="11. Amendments">
        <p>
          We reserve the right to modify, update or terminate these Terms and Conditions at any time
          without prior notice. Changes will be posted on this page with a revised "last updated" date.
          It is your responsibility to review these terms periodically.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
