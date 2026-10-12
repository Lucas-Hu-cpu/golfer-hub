import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '../components/navigation';
import { currentUser } from '../lib/supabase';
import { siteOrigin } from '../lib/site-origin';
import './globals.css';
import './responsive.css';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: { default: 'Golfer Hub | Learn. Practice. Connect.', template: '%s | Golfer Hub' },
  description:
    'An independent student-built golf learning library and community. Sourced lessons, purposeful practice and honest coaching connections.',
  robots: { index: false, follow: false },
  openGraph: { title: 'Golfer Hub', description: 'Learn. Practice. Connect.', images: ['/og.png'] },
  icons: { icon: '/favicon.svg' },
};
export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar signedIn={Boolean(user)} />
        <main id="main">{children}</main>
        <footer>
          <div className="footer-top">
            <Link href="/" className="brand">
              Golfer Hub
            </Link>
            <p>
              Built by a student golfer.
              <br />
              For the game, and everyone learning it.
            </p>
            <div>
              <Link href="/about">Our story</Link>
              <Link href="/sources">Source Library</Link>
              <Link href="/guidelines">Community guidelines</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Golfer Hub. Independent educational project.</span>
            <span>No official partnerships or endorsements.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
