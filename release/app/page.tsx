import Link from 'next/link';
import { ArrowRight, BookOpen, MessageSquare, Flag } from 'lucide-react';
import { catalog, feed, coaches, voteStates } from '../lib/queries';
import { currentUser } from '../lib/supabase';
import { ArticleCard, ForumPostCard, CoachCard, Empty } from '../components/ui';
export const metadata = { alternates: { canonical: '/' } };
export default async function Home() {
  const [content, discussions, teachers, user] = await Promise.all([
    catalog(),
    feed(),
    coaches(),
    currentUser(),
  ]);
  const votes = await voteStates(
    user?.id,
    discussions.posts.slice(0, 3).map((post) => post.id),
  );
  return (
    <>
      <section className="hero">
        <img
          src="/fairway.jpg"
          alt="A golfer finishing a tee shot on a tree-lined course"
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="eyebrow">A better way into the game</span>
          <h1>
            Golfer Hub
            <span>
              Learn smarter.
              <br />
              Play with purpose.
            </span>
          </h1>
          <p>
            Reliable learning, thoughtful conversations, and a clearer path to improving your game.
          </p>
          <div className="actions">
            <Link className="button gold" href="/learn">
              Start learning
              <ArrowRight size={17} />
            </Link>
            <Link className="hero-link" href="/forum">
              Explore the forum
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-note">
            <span>STUDENT-BUILT</span>
            <span>OPEN TO EVERY GOLFER</span>
          </div>
        </div>
      </section>
      <section className="container intro">
        <p className="eyebrow">Find your next step</p>
        <h2>
          More understanding.
          <br />
          More confidence on the course.
        </h2>
        <p className="intro-copy">
          Golfer Hub helps golfers learn from reliable resources, discuss their game with a
          community, and discover experienced coaches.
        </p>
        <div className="feature-grid">
          {[
            [
              BookOpen,
              'Learn golf',
              'From your first grip to a smarter course strategy.',
              '/learn',
            ],
            [
              MessageSquare,
              'Join the conversation',
              'Bring a specific question. Share what you have learned.',
              '/forum',
            ],
            [
              Flag,
              'Find your coach',
              'Explore authorized coaching profiles as our directory grows.',
              '/coaches',
            ],
          ].map(([Icon, title, copy, url]) => {
            const I = Icon as typeof BookOpen;
            return (
              <Link href={url as string} className="feature" key={title as string}>
                <I size={28} />
                <h3>{title as string}</h3>
                <p>{copy as string}</p>
                <ArrowRight size={19} />
              </Link>
            );
          })}
        </div>
      </section>
      <section className="band">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">The learning library</span>
              <h2>Build your game, one guide at a time.</h2>
            </div>
            <Link className="arrow-link" href="/learn">
              All learning guides
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="card-grid">
            {['reliable-grip', 'putting-distance', 'choose-your-target']
              .map((id) => content.lessons.find((l) => l.id === id))
              .filter((l) => Boolean(l))
              .map((l) => (
                <ArticleCard key={l!.id} lesson={l!} sources={content.sources} />
              ))}
          </div>
        </div>
      </section>
      <section className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Around the clubhouse</span>
            <h2>Good questions make better golfers.</h2>
          </div>
          <Link className="arrow-link" href="/forum">
            Explore forum
            <ArrowRight size={17} />
          </Link>
        </div>
        {discussions.posts.length ? (
          discussions.posts
            .slice(0, 3)
            .map((post) => (
              <ForumPostCard
                key={post.id}
                post={post}
                signedIn={Boolean(user)}
                myVote={votes.get(post.id)}
              />
            ))
        ) : (
          <Empty title="The first conversation starts with you.">
            <p>This new community has no published discussions yet.</p>
            <Link className="button secondary" href="/forum/new">
              Ask a golf question
            </Link>
          </Empty>
        )}
      </section>
      <section className="green-band">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">A little guidance goes a long way</span>
              <h2>Make room for a fresh perspective.</h2>
            </div>
            <Link className="button gold" href="/coaches">
              Find coaches
              <ArrowRight size={17} />
            </Link>
          </div>
          {teachers.length ? (
            <div className="card-grid">
              {teachers.slice(0, 3).map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))}
            </div>
          ) : (
            <p>
              Our coach directory is being built with permission. In the meantime, explore the{' '}
              <a href="https://www.pga.com/coach" target="_blank" rel="noreferrer">
                PGA Coach directory
              </a>{' '}
              for independent coaching options.
            </p>
          )}
        </div>
      </section>
      <section className="container founder-teaser">
        <span className="eyebrow">From one student golfer to another</span>
        <h2>A project with a purpose.</h2>
        <p>
          “Learning golf should feel less scattered and more connected. That is the idea behind
          Golfer Hub.”
        </p>
        <Link className="arrow-link" href="/about">
          Meet the founder
          <ArrowRight size={17} />
        </Link>
      </section>
    </>
  );
}
