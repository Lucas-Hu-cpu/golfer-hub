'use client';
import Link from 'next/link';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container narrow">
      <h1>We could not load this page.</h1>
      <p>
        The service may be temporarily unavailable. Your saved records have not been replaced with
        sample data.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
      <p>
        <Link href="/">Return home</Link>
      </p>
    </div>
  );
}
