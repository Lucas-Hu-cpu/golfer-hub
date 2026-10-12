'use client';
import { useState } from 'react';
import type { Lesson } from '../content/catalog';
import { Play } from 'lucide-react';

const green = '#174b36';
const gold = '#bd9652';
function Diagram({ lesson }: { lesson: Lesson }) {
  if (lesson.id === 'reliable-grip')
    return (
      <>
        <text x="40" y="38" fill={green} fontSize="20">
          Two hands, one comfortable connection
        </text>
        <rect x="100" y="116" width="445" height="22" rx="10" fill="#82968a" />
        <ellipse cx="230" cy="127" rx="84" ry="48" fill={green} opacity=".8" />
        <ellipse cx="383" cy="127" rx="84" ry="48" fill={gold} opacity=".9" />
        <text x="230" y="133" textAnchor="middle" fill="white" fontSize="18">
          Lead hand
        </text>
        <text x="383" y="133" textAnchor="middle" fill="#20382c" fontSize="18">
          Trail hand
        </text>
        <text x="320" y="208" textAnchor="middle" fill={green} fontSize="18">
          Overlap · Interlock · Ten-finger
        </text>
      </>
    );
  if (lesson.id === 'bunker-basics')
    return (
      <>
        <text x="40" y="38" fill={green} fontSize="20">
          Practice bunker: sand before the ball
        </text>
        <path d="M40 160 Q280 165 460 160 L590 135 V235 H40Z" fill="#e5cb93" />
        <path
          d="M125 85 Q175 126 245 175 Q310 205 355 120"
          stroke={green}
          strokeWidth="5"
          fill="none"
        />
        <circle cx="310" cy="159" r="9" fill="white" stroke={green} />
        <path d="M245 210 V185 M310 105 V140" stroke={green} strokeWidth="2" />
        <text x="185" y="233" fill={green} fontSize="17">
          Sand entry
        </text>
        <text x="291" y="94" fill={green} fontSize="17">
          Ball
        </text>
        <text x="450" y="212" fill={green} fontSize="17">
          Safe exit
        </text>
      </>
    );
  if (lesson.id === 'putting-distance')
    return (
      <>
        <text x="40" y="38" fill={green} fontSize="20">
          Pace ladder: repeat, then change distance
        </text>
        <path d="M80 175 H565" stroke="#9ab5a5" strokeWidth="3" />
        <circle cx="80" cy="175" r="9" fill="white" stroke={green} />
        {[240, 385, 530].map((x, i) => (
          <g key={x}>
            <rect
              x={x - 12}
              y="120"
              width="24"
              height="110"
              fill={i === 1 ? gold : green}
              opacity=".6"
            />
            <text x={x} y="96" textAnchor="middle" fill={green} fontSize="18">
              {['Short', 'Middle', 'Long'][i]}
            </text>
          </g>
        ))}
        <text x="60" y="235" fill={green} fontSize="17">
          Start
        </text>
      </>
    );
  if (lesson.id === 'smooth-takeaway')
    return (
      <>
        <text x="40" y="38" fill={green} fontSize="20">
          One slow rehearsal, one short shot
        </text>
        {[
          ['1', 'Address'],
          ['2', 'Rehearse'],
          ['3', 'Observe'],
        ].map(([n, label], i) => (
          <g key={n}>
            <circle cx={125 + i * 190} cy="120" r="38" fill={i === 1 ? gold : green} />
            <text x={125 + i * 190} y="129" fill="white" textAnchor="middle" fontSize="27">
              {n}
            </text>
            <text x={125 + i * 190} y="191" fill={green} textAnchor="middle" fontSize="19">
              {label}
            </text>
          </g>
        ))}
        <path d="M163 120 H275 M353 120 H465" stroke={green} strokeWidth="3" />
        <text x="320" y="233" textAnchor="middle" fill={green} fontSize="17">
          Comfortable movement, not a forced position
        </text>
      </>
    );
  if (lesson.id === 'equipment-start')
    return (
      <>
        <text x="40" y="38" fill={green} fontSize="20">
          Choose a usable set before adding clubs
        </text>
        {['Fit', 'Condition', 'Gaps'].map((label, i) => (
          <g key={label}>
            <rect
              x={40 + i * 200}
              y="72"
              width="170"
              height="115"
              rx="4"
              fill={i === 1 ? '#e8dbba' : '#d7e6d9'}
            />
            <text x={125 + i * 200} y="114" textAnchor="middle" fill={green} fontSize="22">
              {label}
            </text>
            <text x={125 + i * 200} y="153" textAnchor="middle" fill={green} fontSize="16">
              {['Comfortable length', 'Safe grips / shafts', 'Useful distances'][i]}
            </text>
          </g>
        ))}
        <text x="320" y="231" textAnchor="middle" fill={green} fontSize="17">
          A qualified fitter can help assess suitability.
        </text>
      </>
    );
  if (lesson.diagram === 'flight')
    return (
      <>
        <path d="M75 205 L565 55" stroke="#82968a" strokeWidth="2" strokeDasharray="6 6" />
        <path
          d="M75 205 Q270 105 385 55 Q490 25 555 115"
          stroke={green}
          strokeWidth="5"
          fill="none"
        />
        <path d="M75 205 L300 100" stroke={gold} strokeWidth="4" />
        <circle cx="75" cy="205" r="7" fill={green} />
        <text x="413" y="43" fill="#546b5c" fontSize="18">
          Target line
        </text>
        <text x="125" y="110" fill="#80602f" fontSize="18">
          Initial direction
        </text>
        <text x="395" y="162" fill={green} fontSize="18">
          Observed curve
        </text>
        <text x="40" y="242" fill={green} fontSize="16">
          Top-down example for a right-handed player
        </text>
      </>
    );
  if (lesson.diagram === 'target')
    return (
      <>
        <text x="40" y="38" fill={green} fontSize="20">
          Choose room for your normal miss
        </text>
        <ellipse cx="320" cy="145" rx="110" ry="62" fill="#a6c6ad" />
        <path d="M477 73 Q554 126 524 210" stroke="#d2ad73" strokeWidth="32" fill="none" />
        <circle cx="320" cy="145" r="7" fill={green} />
        <path d="M100 220 L320 145" stroke={green} strokeWidth="3" strokeDasharray="6 6" />
        <text x="212" y="73" fill={green} fontSize="18">
          Landing area
        </text>
        <text x="455" y="244" fill={green} fontSize="18">
          Hazard
        </text>
        <text x="213" y="238" fill={green} fontSize="18">
          Target center
        </text>
      </>
    );
  return (
    <>
      <text x="40" y="38" fill={green} fontSize="20">
        Give each session one useful question
      </text>
      {['Set a target', 'Collect feedback', 'Review'].map((label, i) => (
        <g key={label}>
          <circle cx={125 + i * 190} cy="120" r="36" fill={i === 1 ? gold : green} />
          <text x={125 + i * 190} y="128" fill="white" textAnchor="middle" fontSize="24">
            {i + 1}
          </text>
          <text x={125 + i * 190} y="194" fill={green} textAnchor="middle" fontSize="18">
            {label}
          </text>
        </g>
      ))}
      <path d="M163 120 H275 M353 120 H465" stroke={green} strokeWidth="3" />
    </>
  );
}

function caption(lesson: Lesson) {
  if (lesson.id === 'reliable-grip')
    return 'Lead/trail hand connection zones on the handle, not exact finger placement. Compare comfort across the three common grip styles.';
  if (lesson.id === 'bunker-basics')
    return 'Conceptual sand-first contact in a designated practice bunker. Entry and exit points are illustrative, not prescribed distances. Do not perform this sand-contact drill during a round.';
  if (lesson.id === 'putting-distance')
    return 'Start with a nearby target zone, repeat your distance feedback, then move farther away. Choose distances appropriate to the practice area.';
  if (lesson.id === 'smooth-takeaway')
    return 'Alternate a comfortable slow rehearsal with a short shot, then record one observation. There is no forced universal takeaway position.';
  if (lesson.id === 'equipment-start')
    return 'Comfort, safe club condition and useful distance gaps are starting questions. This is not a product recommendation or fitting prescription.';
  if (lesson.diagram === 'flight')
    return 'Separate the target line, initial direction and observed curve. This top-down right-handed example is schematic; mirror direction for a left-handed player. Strike location also matters.';
  if (lesson.diagram === 'target')
    return 'The green area represents room around a conservative target; the gold boundary represents trouble. It is not a measured course map.';
  return 'Choose a task, collect feedback and review your pattern before changing the next session.';
}

export function LessonMedia({ lesson }: { lesson: Lesson }) {
  const [loaded, setLoaded] = useState(false);
  const description = caption(lesson);
  return (
    <figure className="lesson-media">
      <svg viewBox="0 0 640 260" role="img" aria-label={description}>
        <rect width="640" height="260" fill="#eef4ee" />
        <Diagram lesson={lesson} />
      </svg>
      <figcaption>Golfer Hub original illustration: {description}</figcaption>
      {lesson.video && (
        <div className="video">
          {loaded ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${lesson.video.id}`}
              title={lesson.video.title}
              allowFullScreen
            />
          ) : (
            <button onClick={() => setLoaded(true)} className="button secondary">
              <Play size={17} />
              Load {lesson.video.publisher} lesson video
            </button>
          )}
          <p>
            <a
              href={`https://www.youtube.com/watch?v=${lesson.video.id}`}
              target="_blank"
              rel="noreferrer"
            >
              {lesson.video.title}
            </a>
          </p>
          <small>
            Loads YouTube only after your click. Playback may depend on region and publisher
            availability.
          </small>
        </div>
      )}
    </figure>
  );
}
