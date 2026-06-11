import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout, PolicySection, PolicyList } from "@/components/home/PolicyLayout";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy | ESYSTEMLK" },
      { name: "description", content: "Refund Policy of ESYSTEMLK — how refunds, cancellations and revisions work for our web development, software and design services." },
      { property: "og:title", content: "Refund Policy | ESYSTEMLK" },
      { property: "og:url", content: "https://www.esystemlk.com/refund-policy" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/refund-policy" }],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refund Policy" lastUpdated="June 11, 2026">
      <PolicySection title="Overview">
        <p>
          Thank you for choosing ESYSTEMLK. We provide digital services including website development,
          web applications, software systems, logo design, branding, hosting and maintenance. We value
          your satisfaction and strive to deliver the best possible result on every project. If, for any
          reason, you are not completely satisfied with a purchase, this policy explains how
          cancellations and refunds are handled.
        </p>
      </PolicySection>

      <PolicySection title="Project Cancellations & Refunds">
        <PolicyList
          items={[
            <><strong>Before work begins:</strong> If you cancel a project before design or development work has started, you are entitled to a full refund of any advance payment made.</>,
            <><strong>After work has started:</strong> If you cancel after design or development has begun, a partial refund may be issued after deducting the cost of work already completed, calculated based on the project milestones reached.</>,
            <><strong>After delivery & approval:</strong> Once a project milestone or final deliverable has been completed and approved by you, payments for that completed work are non-refundable.</>,
          ]}
        />
      </PolicySection>

      <PolicySection title="Revisions Instead of Refunds">
        <p>
          We work on a revision-based process. If you are not satisfied with a design or feature, we will
          revise it until it meets the agreed requirements — design mockups are revised until you approve
          them before development begins. We encourage you to use the included revisions before
          requesting a cancellation.
        </p>
      </PolicySection>

      <PolicySection title="Non-Refundable Items">
        <p>Certain items are non-refundable once purchased or delivered, as they involve third-party costs or completed digital work:</p>
        <PolicyList
          items={[
            "Domain name registrations and renewals",
            "Hosting fees, SSL certificates and other third-party services already provisioned",
            "Software licenses purchased on your behalf",
            "Completed and approved design or development work",
            "Monthly maintenance or subscription fees for periods already used",
          ]}
        />
      </PolicySection>

      <PolicySection title="Defects & Service Issues">
        <p>
          If a delivered website, application or system has defects or does not function as agreed, we
          will fix it free of charge under our lifetime free maintenance commitment. If we are unable to
          resolve a confirmed defect within a reasonable time, you may be entitled to a partial or full
          refund for the affected portion of the work.
        </p>
      </PolicySection>

      <PolicySection title="Refund Processing Time">
        <p>
          Approved refunds will be processed within <strong>7–14 business days</strong> to your original
          method of payment (bank transfer, card payment or online payment gateway). Please note that it
          may take additional time for the refund to appear in your account depending on your bank or
          payment provider. Any payment gateway transaction fees may be deducted from the refunded amount.
        </p>
      </PolicySection>

      <PolicySection title="How to Request a Refund">
        <p>
          To request a cancellation or refund, contact us by email at{" "}
          <a href="mailto:esystemlk@gmail.com" className="text-neon font-semibold">esystemlk@gmail.com</a>{" "}
          or by phone/WhatsApp at +94 76 571 1396 with your name, project details and the reason for the
          request. We will review and respond within 3 business days.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
