import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Heading } from '../../components/ui';
import { ActionForm } from '../../components/forms';
import { authAction, profileAction } from '../actions';
import { currentUser, database } from '../../lib/supabase';
import { catalog } from '../../lib/queries';
export default async function SupportingPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { section } = await params;
  const query = await searchParams;
  if (['signup', 'login', 'recover'].includes(section)) {
    const signup = section === 'signup';
    return (
      <div className="container auth-page">
        <Heading
          eyebrow="Your next chapter"
          title={
            signup
              ? 'Join Golfer Hub.'
              : section === 'recover'
                ? 'Reset your password.'
                : 'Good to see you again.'
          }
          description={
            signup ? 'An account for your learning, practice and conversations.' : undefined
          }
        />
        {section === 'login' && query.notice === 'confirmation-failed' && (
          <p className="notice error" role="alert">
            This email link could not be verified. Open the latest link in the same browser where
            you requested it, or request a new password-recovery email.
          </p>
        )}
        <ActionForm
          action={authAction}
          label={
            signup ? 'Create account' : section === 'recover' ? 'Send recovery email' : 'Sign in'
          }
        >
          <input type="hidden" name="mode" value={section} />
          <input type="hidden" name="next" value={query.next || '/dashboard'} />
          {signup && (
            <label>
              Display name
              <input
                name="display_name"
                required
                minLength={2}
                maxLength={50}
                autoComplete="nickname"
              />
            </label>
          )}
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required maxLength={254} />
          </label>
          {section !== 'recover' && (
            <label>
              Password
              <input
                name="password"
                type="password"
                minLength={signup ? 12 : undefined}
                maxLength={128}
                required
                autoComplete={signup ? 'new-password' : 'current-password'}
              />
              {signup && <small>At least 12 characters.</small>}
            </label>
          )}
          {signup && (
            <label className="checkbox-label">
              <input type="checkbox" name="agreement" value="yes" required />
              <span>
                I agree to the <Link href="/guidelines">community guidelines</Link> and have read
                the <Link href="/privacy">privacy notice</Link>.
              </span>
            </label>
          )}
        </ActionForm>
        <p>
          {signup ? (
            <>
              Already a member? <Link href="/login">Sign in</Link>
            </>
          ) : (
            <>
              New here? <Link href="/signup">Create account</Link>
            </>
          )}
        </p>
        {section === 'login' && <Link href="/recover">Forgot your password?</Link>}
      </div>
    );
  }
  if (section === 'account') {
    const user = await currentUser();
    if (!user) redirect('/login?next=/account');
    const db = await database();
    const profile = await db!.from('profiles').select('*').eq('id', user.id).single();
    if (profile.error) throw new Error('Account unavailable.');
    return (
      <div className="container narrow">
        <Heading eyebrow="Your account" title="Make yourself at home." />
        <p>Signed in as {user.email}</p>
        <ActionForm action={profileAction} label="Update profile">
          <label>
            Display name
            <input
              name="display_name"
              defaultValue={profile.data.display_name}
              required
              minLength={2}
              maxLength={50}
            />
          </label>
          <label>
            Skill level
            <select name="skill_level" defaultValue={profile.data.skill_level}>
              {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
        </ActionForm>
        <p>
          <Link href="/recover">Request a password-reset email</Link>
        </p>
      </div>
    );
  }
  if (section === 'sources') {
    const { sources } = await catalog();
    return (
      <div className="container">
        <Heading
          eyebrow="Follow the evidence"
          title="The source library."
          description="A transparent reading trail, not a claim of partnership or certification."
        />
        <div className="prose wide">
          <h2>How our lessons are developed</h2>
          <p>
            Golfer Hub writes original explanations and practical drills around established
            principles. Every guide identifies which sources support which ideas. Official rules
            remain the authority for competitions; a community comment is not a verified source.
          </p>
          <p>
            “Verified” means official page text was retrieved. “Indexed” means article text was
            checked through a search index while direct automated access was restricted. These
            labels do not certify the instruction.
          </p>
        </div>
        <div className="source-list">
          {sources.map((s) => (
            <article key={s.id} className="citation">
              <div className="meta">
                {s.publisher} · {s.status} · Checked {s.checked_on}
              </div>
              <h2>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.title}
                </a>
              </h2>
              {s.author && (
                <p>
                  {s.author}
                  {s.published_date ? ` · ${s.published_date}` : ''}
                </p>
              )}
              <p>{s.evidence}</p>
            </article>
          ))}
        </div>
        <div className="prose wide">
          <h2>Classic books and additional perspectives</h2>
          <p>
            Ben Hogan’s <em>Five Lessons</em> and Harvey Penick’s <em>Little Red Book</em> are
            recognized golf-learning texts. They are further-reading suggestions, not verified page
            citations in this release. We do not reproduce their diagrams or passages.
          </p>
          <p>
            <a href="https://www.golfdigest.com/instruction" target="_blank" rel="noreferrer">
              Golf Digest instruction
            </a>
            ,{' '}
            <a href="https://golf.com/instruction/" target="_blank" rel="noreferrer">
              GOLF.com instruction
            </a>
            , and public professional-coach lessons can provide further reading. Equipment testing
            and launch-monitor measurements need context rather than automatic purchase
            recommendations.
          </p>
          <h2>Independence</h2>
          <p>
            No endorsement, certification or official partnership with USGA, The R&A, PGA of
            America, Golf Digest, GOLF.com or Trackman is claimed.
          </p>
          <h2>Photography and illustrations</h2>
          <p>
            Golf photograph by{' '}
            <a href="https://unsplash.com/@courtneymcook" target="_blank" rel="noreferrer">
              Courtney Cook
            </a>{' '}
            on{' '}
            <a href="https://unsplash.com/photos/SsIIw_MET0E" target="_blank" rel="noreferrer">
              Unsplash
            </a>
            , used under the{' '}
            <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">
              Unsplash License
            </a>
            . The golfer pictured is not presented as a Golfer Hub member or coach. Lesson diagrams
            are original simplified illustrations, not individual swing diagnoses.
          </p>
        </div>
      </div>
    );
  }
  if (section === 'about')
    return (
      <div className="container">
        <Heading
          eyebrow="The story behind Golfer Hub"
          title="One student. A shared love of the game."
          description="A passion project built around a simple idea: make golf learning more connected."
        />
        <div className="about-photo">
          <img src="/fairway.jpg" alt="A golfer finishing a tee shot on a tree-lined course" />
        </div>
        <div className="prose">
          <h2>Why I started</h2>
          <p>
            I’m Lucas, a student golfer. I started playing golf in 2018. As I learned, I kept coming
            back to the same problem: useful advice was scattered across videos, articles,
            conversations and practice sessions.
          </p>
          <p>
            One lesson might explain a grip, another a swing path, but it was harder to understand
            what to practise next or how to ask a precise question. Golfer Hub grew from that gap.
          </p>
          <h2>A clearer path through the game</h2>
          <p>
            This platform brings structured learning, community discussion and coaching discovery
            into one place. It is especially for beginners, intermediate players and student golfers
            who want to improve without feeling overwhelmed.
          </p>
          <h2>Our mission</h2>
          <p>
            Make reliable golf learning easier to find, easier to understand, and easier to turn
            into purposeful practice.
          </p>
          <h2>Built independently</h2>
          <p>
            My student experience in Wales, including Bridgend and the UWC community, informs this
            project. Golfer Hub is independent; no school, golf club or professional organization is
            presented as an official partner.
          </p>
          <h2>What comes next</h2>
          <p>
            The next steps are to listen to real members, improve the learning paths, and welcome
            coaches who give permission for their profiles. Growth should follow useful content and
            trust, not invented membership numbers or testimonials.
          </p>
          <h2>A founder’s note</h2>
          <p>
            “I am still learning the game myself. My aim is not to pretend I have every answer, but
            to build a place where golfers can find good starting points, ask better questions, and
            keep improving together.”
          </p>
          <p>Lucas · Founder, Golfer Hub</p>
        </div>
      </div>
    );
  if (section === 'privacy')
    return (
      <div className="container narrow prose">
        <Heading eyebrow="Privacy notice" title="Your data, clearly explained." />
        <p>
          Preview notice · Updated 12 October 2026. Do not enter sensitive personal information into
          this test environment.
        </p>
        <h2>What is collected</h2>
        <p>
          Supabase Auth stores your account email and authentication records. Golfer Hub stores your
          display name, skill level, public posts, comments and votes, along with private saves,
          practice records, progress, enquiries and reports.
        </p>
        <h2>What is public</h2>
        <p>
          Your display name, skill level and community contributions are public. Account email,
          bookmarks, goals, session requests and reports are not displayed publicly. Administrators
          can review private operational records for support and moderation.
        </p>
        <h2>Service providers</h2>
        <p>
          The independent preview uses Supabase in the Europe region for authentication and data.
          Vercel may host a verified preview. These providers process operational information
          according to their own terms. Media links leave Golfer Hub; YouTube loads only after you
          choose to load a lesson video.
        </p>
        <h2>Cookies and retention</h2>
        <p>
          Authentication cookies keep you signed in. No advertising or analytics trackers are
          installed in this release. Test data is retained until the owner reviews the pilot; a
          final retention schedule and verified support contact are required before production
          launch.
        </p>
        <h2>Requests and contact</h2>
        {process.env.NEXT_PUBLIC_PRIVACY_EMAIL ? (
          <p>
            For access, correction or deletion requests, contact{' '}
            <a href={`mailto:${process.env.NEXT_PUBLIC_PRIVACY_EMAIL}`}>
              {process.env.NEXT_PUBLIC_PRIVACY_EMAIL}
            </a>
            .
          </p>
        ) : (
          <p>
            A verified privacy contact is not yet configured. This is a production-release blocker;
            the preview is for controlled testing only.
          </p>
        )}
        <h2>Young golfers</h2>
        <p>
          Use age-appropriate judgment and involve a parent or guardian before sharing personal
          information or contacting a coach. Never publish your school schedule, private address or
          another person’s details.
        </p>
      </div>
    );
  if (section === 'guidelines')
    return (
      <div className="container narrow prose">
        <Heading eyebrow="Community guidelines" title="Respect the game. Respect each other." />
        <h2>Be constructive</h2>
        <p>
          Share context and personal experience. Avoid insults, harassment, discrimination, sexual
          content, spam and sales pitches. Critique an idea, not a person.
        </p>
        <h2>Keep advice honest</h2>
        <p>
          Do not claim credentials you do not hold. Identify uncertainty. A swing problem cannot
          always be diagnosed from a short description; medical pain needs qualified care, not a
          forum correction.
        </p>
        <h2>Protect privacy and rights</h2>
        <p>
          Only share media you have permission to share. Do not expose private contact details,
          school information, passwords or someone else’s personal data.
        </p>
        <h2>Moderation</h2>
        <p>
          Report a discussion that violates these standards. Moderators can hide or restore content
          and review reports. Hidden discussions disappear from public feeds. Repeated rapid posts
          or comments are limited at the database level.
        </p>
        <h2>Sorting and feedback</h2>
        <p>
          Votes express usefulness, not a person’s worth. Community popularity does not make
          instruction correct. Use the Source Library and a qualified coach to explore technical
          claims.
        </p>
      </div>
    );
  notFound();
}
