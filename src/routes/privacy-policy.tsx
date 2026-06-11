import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout, PolicySection, PolicyList } from "@/components/home/PolicyLayout";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | ESYSTEMLK" },
      { name: "description", content: "Privacy Policy of ESYSTEMLK — how we collect, use and protect your personal information when you use our website and services." },
      { property: "og:title", content: "Privacy Policy | ESYSTEMLK" },
      { property: "og:url", content: "https://www.esystemlk.com/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/privacy-policy" }],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="June 11, 2026">
      <PolicySection title="Introduction">
        <p>
          At ESYSTEMLK, we are committed to protecting the privacy and security of our customers'
          personal information. This Privacy Policy outlines how we collect, use and safeguard your
          information when you visit <strong>www.esystemlk.com</strong>, contact us, or purchase our
          services. By using our website, you consent to the practices described in this policy.
        </p>
      </PolicySection>

      <PolicySection title="Information We Collect">
        <p>We may collect the following information about you:</p>
        <PolicyList
          items={[
            "Personal identification information (name, email address, phone number, business name and address) provided voluntarily by you through our contact forms, WhatsApp, email or during project onboarding.",
            "Payment and billing information necessary to process your orders. Card details are securely handled by trusted third-party payment processors (such as PayHere) — we do not store your full card details on our servers.",
            "Project-related information you share with us, such as content, images and business requirements needed to deliver your website or software.",
            "Browsing information, such as your IP address, browser type and device information, collected automatically using cookies and similar technologies.",
          ]}
        />
      </PolicySection>

      <PolicySection title="How We Use Your Information">
        <PolicyList
          items={[
            "To deliver the services you have ordered, including websites, web apps, software systems and design work.",
            "To process payments and issue invoices and receipts.",
            "To communicate with you about your projects, provide customer support and respond to inquiries.",
            "To send you service updates, maintenance notices and (with your consent) promotions.",
            "To improve our website and services based on feedback and usage patterns.",
            "To detect and prevent fraud, unauthorized activity and abuse of our website.",
          ]}
        />
      </PolicySection>

      <PolicySection title="Information Sharing">
        <p>
          We respect your privacy and do not sell, trade or otherwise transfer your personal information
          to third parties without your consent, except in the following circumstances:
        </p>
        <PolicyList
          items={[
            <><strong>Trusted service providers:</strong> We may share information with third-party providers who assist us in operating our services — such as payment gateways (e.g. PayHere), hosting providers and domain registrars. These providers are obligated to handle your data securely and confidentially.</>,
            <><strong>Legal requirements:</strong> We may disclose information if required to do so by law or in response to valid legal requests or orders.</>,
          ]}
        />
      </PolicySection>

      <PolicySection title="Data Security">
        <p>
          We implement industry-standard security measures — including SSL encryption, access controls
          and secure storage — to protect your personal information from unauthorized access, alteration,
          disclosure or destruction. However, no method of transmission over the internet or electronic
          storage is 100% secure, and we cannot guarantee absolute security. Client project data is
          additionally covered by NDA on request.
        </p>
      </PolicySection>

      <PolicySection title="Cookies & Tracking Technologies">
        <p>
          We use cookies and similar technologies to enhance your browsing experience, analyze website
          traffic and understand how visitors interact with our website. You can disable cookies through
          your browser settings, but this may limit certain features of our website.
        </p>
      </PolicySection>

      <PolicySection title="Your Rights">
        <p>
          You may request access to, correction of, or deletion of the personal information we hold about
          you at any time by contacting us at{" "}
          <a href="mailto:esystemlk@gmail.com" className="text-neon font-semibold">esystemlk@gmail.com</a>.
          We will respond to verified requests within a reasonable time.
        </p>
      </PolicySection>

      <PolicySection title="Changes to This Privacy Policy">
        <p>
          We reserve the right to update or modify this Privacy Policy at any time. Any changes will be
          posted on this page with a revised "last updated" date. We encourage you to review this page
          periodically to stay informed about how we protect your information.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
