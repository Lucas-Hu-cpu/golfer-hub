'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Flag, Menu, X } from 'lucide-react';
import { logout } from '../app/actions';
const links = [
  ['/', 'Home'],
  ['/learn', 'Learn'],
  ['/forum', 'Forum'],
  ['/coaches', 'Coaches'],
  ['/dashboard', 'Dashboard'],
  ['/sources', 'Source Library'],
  ['/about', 'About'],
];
export function Navbar({ signedIn }: { signedIn: boolean }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="navbar">
      <Link href="/" className="brand" onClick={() => setOpen(false)}>
        <Flag size={25} strokeWidth={1.7} />
        Golfer Hub
        <span className="brand-dot" />
      </Link>
      <button
        className="icon mobile-menu"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav aria-label="Main navigation" className={open ? 'nav-links open' : 'nav-links'}>
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={
              path === href || (href !== '/' && path.startsWith(href + '/')) ? 'page' : undefined
            }
          >
            {label}
          </Link>
        ))}
        {signedIn ? (
          <>
            <Link href="/account">Account</Link>
            <form action={logout}>
              <button className="text-button">Log out</button>
            </form>
          </>
        ) : (
          <Link className="button small" href="/signup">
            Join Golfer Hub
          </Link>
        )}
      </nav>
    </header>
  );
}
