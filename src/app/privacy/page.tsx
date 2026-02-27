import { Navbar } from "@/components/layout/navbar";
import { FooterSection } from "@/components/layout/sections/footer";

export const metadata = {
  title: "Privacy Policy - MMK Accountants Registered Office Service",
  description:
    "How MMK Accountants collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="container max-w-3xl py-16 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0c2d42] dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: 1 January 2025
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-[var(--mmk-text-secondary)]">
          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            1. Data Controller
          </h2>
          <p>
            MMK Accountants Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is the data controller
            responsible for your personal data. We are registered in England and Wales with our
            principal office in Luton, United Kingdom.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            2. Data We Collect
          </h2>
          <p>We collect the following categories of personal data:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Account information:</strong> name, email address, password (hashed)</li>
            <li><strong>Business details:</strong> company name, CRN, registered address, SIC code, incorporation date, director information</li>
            <li><strong>Payment data:</strong> payment method, transaction records (card details are processed by Stripe and never stored by us)</li>
            <li><strong>Agreement data:</strong> signature type, signature data, IP address, timestamp</li>
            <li><strong>Technical data:</strong> IP address, browser type, device information, login timestamps</li>
            <li><strong>Communication data:</strong> support ticket messages, email correspondence</li>
          </ul>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            3. Legal Basis for Processing
          </h2>
          <p>We process your data under the following legal bases:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Contract performance:</strong> to provide the registered office service you have subscribed to</li>
            <li><strong>Legal obligation:</strong> to comply with Companies House regulations, HMRC requirements, and anti-money laundering legislation</li>
            <li><strong>Legitimate interests:</strong> to improve our services, prevent fraud, and communicate with you about your account</li>
            <li><strong>Consent:</strong> for marketing communications (where applicable)</li>
          </ul>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            4. How We Use Your Data
          </h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>To provide and manage your registered office address service</li>
            <li>To process payments and manage subscriptions</li>
            <li>To notify you of received mail and service updates</li>
            <li>To generate and store signed agreements</li>
            <li>To respond to support enquiries</li>
            <li>To comply with legal and regulatory obligations</li>
          </ul>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            5. Data Sharing
          </h2>
          <p>We may share your data with:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Payment processors:</strong> Stripe, for processing card payments</li>
            <li><strong>Cloud providers:</strong> for secure data hosting and storage</li>
            <li><strong>Companies House:</strong> as required for registered office address filings</li>
            <li><strong>Legal authorities:</strong> where required by law or court order</li>
          </ul>
          <p>
            We do not sell your personal data to third parties. We do not share your data for
            marketing purposes without your explicit consent.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            6. Data Retention
          </h2>
          <p>
            We retain your personal data for as long as your account is active and for a period of 6
            years after termination, in accordance with our legal and regulatory obligations. Payment
            records are retained for 7 years as required by HMRC.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            7. Data Security
          </h2>
          <p>
            We implement appropriate technical and organisational measures to protect your data,
            including encryption in transit (TLS) and at rest, secure password hashing, access
            controls, and regular security reviews.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            8. Your Rights
          </h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Access</strong> your personal data</li>
            <li><strong>Rectify</strong> inaccurate or incomplete data</li>
            <li><strong>Erase</strong> your data (subject to legal retention requirements)</li>
            <li><strong>Restrict</strong> processing in certain circumstances</li>
            <li><strong>Data portability</strong> — receive your data in a structured format</li>
            <li><strong>Object</strong> to processing based on legitimate interests</li>
            <li><strong>Withdraw consent</strong> where processing is based on consent</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:info@mmkaccountants.co.uk" className="text-[#0ea5e9] hover:underline">
              info@mmkaccountants.co.uk
            </a>.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            9. Complaints
          </h2>
          <p>
            If you are not satisfied with how we handle your data, you have the right to lodge a
            complaint with the Information Commissioner&apos;s Office (ICO) at{" "}
            <a
              href="https://ico.org.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0ea5e9] hover:underline"
            >
              ico.org.uk
            </a>.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            10. Contact
          </h2>
          <p>
            For privacy-related enquiries, contact us at{" "}
            <a href="mailto:info@mmkaccountants.co.uk" className="text-[#0ea5e9] hover:underline">
              info@mmkaccountants.co.uk
            </a>.
          </p>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
