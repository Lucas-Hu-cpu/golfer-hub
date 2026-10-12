import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="container narrow">
      <span className="eyebrow">404</span>
      <h1>This page is not on the course.</h1>
      <p>The guide or discussion may have moved or may not be public.</p>
      <Link href="/learn" className="button">
        Browse learning guides
      </Link>
    </div>
  );
}
