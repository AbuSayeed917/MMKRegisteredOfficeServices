import { Navbar } from "@/components/layout/navbar";
import { FooterSection } from "@/components/layout/sections/footer";

export const metadata = {
  title: "Cookie Policy - MMK Accountants Registered Office Service",
  description:
    "How MMK Accountants uses cookies and similar technologies on our website.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <main className="container max-w-3xl py-16 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0c2d42] dark:text-white">
            Cookie Policy
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: 1 January 2025
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-[var(--mmk-text-secondary)]">
          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            1. What Are Cookies
          </h2>
          <p>
            Cookies are small text files stored on your device when you visit our website. They help
            us provide a better experience by remembering your preferences and keeping you signed in.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            2. Cookies We Use
          </h2>

          <h3 className="text-base font-medium text-[#0c2d42] dark:text-white">
            Essential Cookies
          </h3>
          <p>
            These cookies are necessary for the website to function and cannot be disabled.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-[var(--mmk-border-light)] rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left p-2.5 font-medium">Cookie</th>
                  <th className="text-left p-2.5 font-medium">Purpose</th>
                  <th className="text-left p-2.5 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[var(--mmk-border-light)]">
                  <td className="p-2.5 font-mono text-xs">authjs.session-token</td>
                  <td className="p-2.5">Keeps you signed in to your account</td>
                  <td className="p-2.5">Session</td>
                </tr>
                <tr className="border-t border-[var(--mmk-border-light)]">
                  <td className="p-2.5 font-mono text-xs">authjs.csrf-token</td>
                  <td className="p-2.5">Protects against cross-site request forgery</td>
                  <td className="p-2.5">Session</td>
                </tr>
                <tr className="border-t border-[var(--mmk-border-light)]">
                  <td className="p-2.5 font-mono text-xs">authjs.callback-url</td>
                  <td className="p-2.5">Redirects you after signing in</td>
                  <td className="p-2.5">Session</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-medium text-[#0c2d42] dark:text-white">
            Functional Cookies
          </h3>
          <p>
            These cookies remember your preferences to provide enhanced functionality.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-[var(--mmk-border-light)] rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left p-2.5 font-medium">Cookie</th>
                  <th className="text-left p-2.5 font-medium">Purpose</th>
                  <th className="text-left p-2.5 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[var(--mmk-border-light)]">
                  <td className="p-2.5 font-mono text-xs">theme</td>
                  <td className="p-2.5">Remembers your light/dark mode preference</td>
                  <td className="p-2.5">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            3. Third-Party Cookies
          </h2>
          <p>
            We use Stripe for payment processing. Stripe may set its own cookies to process payments
            securely and prevent fraud. Please refer to{" "}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0ea5e9] hover:underline"
            >
              Stripe&apos;s Privacy Policy
            </a>{" "}
            for details.
          </p>
          <p>
            We do not use analytics cookies, advertising cookies, or social media tracking cookies.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            4. Managing Cookies
          </h2>
          <p>
            You can control and delete cookies through your browser settings. Note that disabling
            essential cookies may prevent you from using certain features of our website, including
            signing in.
          </p>
          <p>Common browser cookie settings:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              <strong>Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies
            </li>
            <li>
              <strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data
            </li>
            <li>
              <strong>Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies
            </li>
            <li>
              <strong>Edge:</strong> Settings &gt; Cookies and Site Permissions
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            5. Changes to This Policy
          </h2>
          <p>
            We may update this Cookie Policy from time to time. Any changes will be posted on this
            page with an updated &ldquo;Last updated&rdquo; date.
          </p>

          <h2 className="text-lg font-semibold text-[#0c2d42] dark:text-white">
            6. Contact
          </h2>
          <p>
            For questions about our use of cookies, contact us at{" "}
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
