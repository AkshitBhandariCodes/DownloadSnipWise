import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy | SnipWise",
  description: "How SnipWise handles clipboard history, Google sign-in, optional Google Drive sync, and website data.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy policy"
      summary="SnipWise saves clipboard history on your device. If you choose Google sign-in and sync, it stores encrypted copies in your own Google Drive and keeps limited account records to run the service."
    >
      <section>
        <h2>Who this covers</h2>
        <p>This policy covers the SnipWise desktop app and the website at <a href={site.url}>{site.url}</a>. SnipWise is operated by Akshit Bhandari. Optional features described here may be unavailable in some beta builds.</p>
      </section>

      <section>
        <h2>Clipboard history on your device</h2>
        <p>The desktop app reads clipboard items to save, search, organize, convert, and paste them. The saved history and image assets are kept in a local database on your computer. Copying and using that history work without an account or internet connection.</p>
        <p>SnipWise skips clipboard items that a password manager marks as sensitive. This guard cannot identify every secret in everything you copy, so review what you save and share. You can delete clips and choose a local history cleanup period in the app.</p>
      </section>

      <section>
        <h2>Google sign-in and Drive sync</h2>
        <p>If you choose Google sign-in, SnipWise asks Google for basic identity information (your verified email address and a stable account identifier) and access to the SnipWise application data folder in your Google Drive. It requests the <code>openid</code>, <code>email</code>, and <code>drive.appdata</code> permissions. The Drive permission is limited to data the app stores in its own hidden application folder; it does not grant access to your other Drive files.</p>
        <p>The desktop app sends a Google identity token to the SnipWise account API so it can verify sign-in. The API stores your email and Google account identifier, device names and public keys, session records (which may include IP address and user agent), and account entitlements. Your Google Drive access and refresh tokens remain in your device’s operating-system credential store; they are not sent to the SnipWise API.</p>
        <p>If you turn on sync, the app encrypts clipboard operations and image data on your device, then transfers them directly to your own Google Drive application data folder. The SnipWise account API does not receive clipboard text, images, or your Drive tokens. Sync is optional. Disconnecting Drive or signing out stops future sync from that device, but does not by itself erase data already stored in Drive.</p>
      </section>

      <section>
        <h2>Encryption and recovery</h2>
        <p>Synced clipboard data is end-to-end encrypted. Your 24 recovery words are needed to unlock that data on a new device. SnipWise does not receive or store those words and cannot recover them for you. Keep a private copy; losing them may make synced data inaccessible.</p>
      </section>

      <section>
        <h2>Website and third parties</h2>
        <p>The website saves your light or dark theme preference in your browser. Interactive examples run in your browser. We have not added advertising trackers or analytics scripts to the site. Our website host may process ordinary request information, such as IP address, to serve the pages and maintain service security.</p>
        <p>We use a hosted database provider for account metadata and Google for sign-in and user-owned Drive storage. If you follow links to GitHub, X, Product Hunt, or a sponsor page, those services handle your visit under their own policies. SnipWise does not sell Google user data or use it for advertising.</p>
      </section>

      <section>
        <h2>Retention and your choices</h2>
        <p>Local clips remain on your device until you delete them or your selected cleanup setting removes them. Encrypted sync data remains in your Google Drive until it is removed there; deleting a local clip may leave encrypted history or backups for a time. Account metadata remains while your account is active and for any period needed to handle security, legal, or support obligations.</p>
        <p>You can stop using sync, revoke SnipWise’s Google access in your Google Account settings, and remove the app’s data from your Drive. To request access to or deletion of account records held by SnipWise, contact us using the support contact below. Removing the desktop app alone may not remove local data, account records, or Google Drive data.</p>
      </section>

      <section>
        <h2>Changes and contact</h2>
        <p>We will update this page when our data practices change and show a new effective date. Material changes to how Google user data is used will be disclosed before that new use.</p>
        <p>For privacy or account questions, email <a href={`mailto:${site.links.contactEmail}`}>{site.links.contactEmail}</a>. Never send recovery words, passwords, tokens, or clipboard contents in a message.</p>
      </section>
    </LegalLayout>
  );
}
