import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Service | SnipWise",
  description: "Terms for using the SnipWise desktop and website.",
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of service"
      summary="These terms explain what to expect while using the SnipWise desktop and website. Please read them before connecting an account."
    >
      <section>
        <h2>Using SnipWise</h2>
        <p>These terms apply to the SnipWise desktop app and <a href={site.url}>{site.url}</a>, operated by Akshit Bhandari. You may use SnipWise to capture, organize, convert, and sync content you are permitted to use. You are responsible for the content you copy and for complying with the rules that apply to it.</p>
        <p>You must not use SnipWise to break the law, infringe another person’s rights, interfere with the service, or attempt to access another person’s account or data.</p>
      </section>

      <section>
        <h2>Availability</h2>
        <p>SnipWise 1.0.0 is the first official release. Features are stable and support is available. The desktop app’s local capture and history work offline. Google sign-in is optional.</p>
        <p>We may release updates to improve security, compatibility, or functionality. Any future paid offering will show its price and applicable terms before you purchase it.</p>
      </section>

      <section>
        <h2>Your data and recovery words</h2>
        <p>Your clipboard history belongs to you. Local clips remain on your device. Keep your own backups of anything important. Deleting the app removes local data. Our <a href="/privacy-policy">Privacy Policy</a> explains what account information we handle.</p>
      </section>

      <section>
        <h2>Google and other services</h2>
        <p>Google sign-in is provided by Google and is subject to your Google terms and settings. Links to GitHub and other third-party sites are governed by those services. SnipWise is responsible for its own app and website, not for the availability or policies of third-party services.</p>
      </section>

      <section>
        <h2>Software rights</h2>
        <p>SnipWise and its branding belong to their respective owners. The open-source parts of the software remain available under their published licenses. These terms do not give you ownership of the SnipWise name, logo, or other users’ content.</p>
      </section>

      <section>
        <h2>Limits and changes</h2>
        <p>To the extent permitted by applicable law, SnipWise is provided as available, without a promise that it will always be uninterrupted, error-free, or suitable for every purpose. We are not responsible for losses caused by circumstances outside our reasonable control. Nothing here limits rights that cannot legally be limited.</p>
        <p>We may update these terms and show a new effective date on this page. If a change materially affects your use of the service, we will provide notice where reasonably possible. You can stop using SnipWise at any time.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>For questions about these terms, email <a href={`mailto:${site.links.contactEmail}`}>{site.links.contactEmail}</a>. Do not include secrets or private clipboard data.</p>
      </section>
    </LegalLayout>
  );
}
