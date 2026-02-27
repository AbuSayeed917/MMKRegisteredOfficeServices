import { Navbar } from "@/components/layout/navbar";
import { FooterSection } from "@/components/layout/sections/footer";

export const metadata = {
  title: "Terms & Conditions - MMK Accountants Registered Office Service",
  description:
    "Terms and conditions for the MMK Accountants registered office address service.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="container max-w-3xl py-16 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0c2d42] dark:text-white">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: 1 January 2025
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-[var(--mmk-text-secondary)]">
          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            1. Introduction
          </h2>
          <p>
            These Terms and Conditions govern the use of the registered office address service
            (&ldquo;Service&rdquo;) provided by MMK Accountants Ltd (&ldquo;Provider&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;), registered in England and Wales, with its
            principal office in Luton, United Kingdom.
          </p>
          <p>
            By registering for our Service, you (&ldquo;Client&rdquo;, &ldquo;you&rdquo;) agree to
            be bound by these Terms. If you do not agree, you must not use the Service.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            2. Service Description
          </h2>
          <p>
            We provide a registered office address for companies incorporated in England and Wales,
            as permitted under the Companies Act 2006. The Service includes:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Use of our address as your company&apos;s registered office with Companies House</li>
            <li>Receipt and secure storage of official HMRC and Companies House correspondence</li>
            <li>Notification of received mail within 2 working days via email</li>
            <li>Forwarding or scanning of mail upon request (additional charges may apply)</li>
          </ul>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            3. Eligibility
          </h2>
          <p>
            The Service is available to UK limited companies, LLPs, and other entities registered
            with Companies House. You must provide accurate company details, including your Company
            Registration Number (CRN), and keep them up to date.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            4. Fees and Payment
          </h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>The annual fee for the Service is &pound;75.00 (inclusive of VAT where applicable), payable in advance.</li>
            <li>Payment may be made by debit/credit card or BACS bank transfer.</li>
            <li>Failure to pay within 14 days of the due date may result in suspension or termination of the Service.</li>
            <li>All fees are non-refundable once the Service period has commenced, except where required by law.</li>
          </ul>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            5. Term and Renewal
          </h2>
          <p>
            The Service is provided for 12-month terms. Your subscription will automatically renew
            at the end of each term unless cancelled with at least 30 days&apos; written notice
            before the renewal date.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            6. Client Obligations
          </h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>You must notify us of any change to your company details within 14 days.</li>
            <li>You must not use the address for any unlawful purpose.</li>
            <li>You are responsible for filing your own confirmation statement (formerly annual return) with Companies House reflecting the registered office address.</li>
            <li>You must collect or arrange forwarding of mail in a timely manner. Mail uncollected for over 90 days may be disposed of.</li>
          </ul>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            7. Termination
          </h2>
          <p>
            Either party may terminate the Service by giving 30 days&apos; written notice. We reserve
            the right to terminate immediately if:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>You breach any of these Terms</li>
            <li>Your company is dissolved, struck off, or enters insolvency proceedings</li>
            <li>Payment remains outstanding for more than 30 days</li>
            <li>The address is used in connection with illegal activity</li>
          </ul>
          <p>
            Upon termination, you must change your registered office address with Companies House
            within 14 days. We will hold any mail for 30 days following termination.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            8. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, our liability in connection with the Service is
            limited to the fees paid by you in the 12-month period preceding the claim. We shall not
            be liable for any indirect, consequential, or special damages, including loss of profits,
            business, or data.
          </p>
          <p>
            We are not responsible for delays or failures in postal delivery by Royal Mail or other
            carriers, nor for the content of correspondence received at the address.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            9. Data Protection
          </h2>
          <p>
            We process your personal data in accordance with our Privacy Policy and applicable data
            protection legislation, including the UK GDPR and the Data Protection Act 2018. Please
            refer to our Privacy Policy for full details.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            10. Electronic Signatures
          </h2>
          <p>
            Agreements signed electronically through our platform are legally binding under the
            Electronic Communications Act 2000. Your typed name or hand-drawn signature, along with
            your IP address and timestamp, are recorded as evidence of your consent.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            11. Governing Law
          </h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of England and
            Wales. Any dispute arising under or in connection with these Terms shall be subject to
            the exclusive jurisdiction of the courts of England and Wales.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            12. Contact
          </h2>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
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
