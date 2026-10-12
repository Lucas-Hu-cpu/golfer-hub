export type Source = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  author?: string;
  published_date?: string;
  checked_on: string;
  evidence: string;
  status: 'verified' | 'indexed' | 'needs-review';
};
export type Lesson = {
  id: string;
  title: string;
  category_id: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  objective: string;
  introduction: string;
  principle: string;
  steps: string[];
  mistakes: string[];
  drill: { title: string; instructions: string[]; measure: string };
  course: string;
  diagram: 'flight' | 'target' | 'practice' | 'setup';
  sources: { id: string; supports: string }[];
  related: string[];
  forum: string;
  status: 'draft' | 'review' | 'published';
  video?: { id: string; title: string; publisher: string; evidence: string };
};
export const categories = [
  ['swing-fundamentals', 'Swing Fundamentals'],
  ['grip-stance-posture', 'Grip, Stance, and Posture'],
  ['ball-striking', 'Ball Striking'],
  ['driving', 'Driving'],
  ['iron-play', 'Iron Play'],
  ['short-game', 'Short Game'],
  ['putting', 'Putting'],
  ['bunker-play', 'Bunker Play'],
  ['course-strategy', 'Course Strategy'],
  ['rules-etiquette', 'Golf Rules and Etiquette'],
  ['mental-game', 'Mental Game'],
  ['practice-plans', 'Practice Plans'],
  ['equipment-basics', 'Equipment Basics'],
  ['tournament-preparation', 'Tournament Preparation'],
].map(([id, name], position) => ({ id, name, position }));
export const forumCategories = [
  ['swing-help', 'Swing Help'],
  ['course-strategy', 'Course Strategy'],
  ['equipment-talk', 'Equipment Talk'],
  ['tournament-experience', 'Tournament Experience'],
  ['beginner-questions', 'Beginner Questions'],
  ['coach-qa', 'Coach Q&A'],
  ['practice-routines', 'Practice Routines'],
  ['mental-game', 'Mental Game'],
  ['general-discussion', 'General Discussion'],
].map(([id, name]) => ({ id, name }));

const checked_on = '2026-10-12';
const pga = (
  id: string,
  title: string,
  slug: string,
  author?: string,
  published_date?: string,
): Source => ({
  id,
  title,
  publisher: 'PGA of America',
  url: `https://www.pga.com/story/${slug}`,
  author,
  published_date,
  checked_on,
  evidence:
    'Article text retrieved through the search index. Direct automated retrieval returned 403; original publisher link retained for readers.',
  status: 'indexed',
});
export const sources: Source[] = [
  pga(
    'grip',
    'Get a Grip: The Right Grip for You',
    'get-a-grip-the-right-grip-for-you',
    'Bernie Najar',
    '2019-11-06',
  ),
  pga(
    'takeaway',
    'Golf Tips: Three Musts for a Smooth Takeaway',
    'golf-tips-three-musts-for-a-smooth-takeaway',
    'Peter Krause',
    '2019-11-06',
  ),
  pga(
    'iron-contact',
    'A Little Lean Makes the Golf Ball Go a Long Way',
    'a-little-lean-makes-the-golf-ball-go-a-long-way',
    'Keith Stewart, PGA',
    '2021-07-15',
  ),
  pga(
    'targets',
    'Choosing Wisely: the target, the shot and the club',
    'choosing-wisely-the-target-the-shot-and-the-club',
    'Trent Wearner, PGA',
    '2019-10-07',
  ),
  pga(
    'putting',
    'Golf Tips: The Best Putting Drills to Improve Your Stroke',
    'golf-tips-the-best-putting-drills-to-improve-your-stroke',
    'Brendon Elliott, PGA',
    '2024-07-07',
  ),
  pga(
    'bunkers',
    'Bunker shots made easy',
    'instruction-master-the-game-bunker-shots-made-easy',
    'Bill Murchison III, PGA',
    '2019-10-02',
  ),
  pga(
    'short-game',
    'Golf Tips: 4 Keys for Better Chipping',
    'golf-tips-4-keys-for-better-chipping',
  ),
  pga(
    'routine',
    'Ground Your Game in a Routine to Play More Consistent Golf',
    'ground-your-game-in-a-routine-to-play-more-consistent-golf',
    'Brendon Elliott, PGA',
    '2021-06-29',
  ),
  pga(
    'practice',
    'Effective vs. Non-Effective Practice: Set Goals When Working on Your Game',
    'effective-vs-non-effective-practice-set-goals-when-working-on-your-golf-game',
    undefined,
    '2021-03-26',
  ),
  pga(
    'equipment',
    'Build your beginning golf game',
    'build-your-beginning-golf-game',
    'Jack Dillon',
    '2019-10-29',
  ),
  pga(
    'tournament',
    'Six things to do before teeing off',
    'six-things-to-do-before-teeing-off',
    'Brandi Jackson',
    '2019-10-24',
  ),
  {
    id: 'face-path',
    title: 'What is Face to Path?',
    publisher: 'Trackman',
    author: 'Trackman Editorial Team',
    published_date: '2024-09-23',
    url: 'https://www.trackman.com/blog/face-to-path',
    checked_on,
    status: 'verified',
    evidence:
      'Direct article text checked. Supports the centered-contact face-to-path relationship, not a universal slice diagnosis.',
  },
  {
    id: 'club-data',
    title: 'Tech insights: Club data definitions',
    publisher: 'Trackman',
    author: 'Trackman Editorial Team',
    published_date: '2017-08-21',
    url: 'https://www.trackman.com/blog/club-data-definitions',
    checked_on,
    status: 'verified',
    evidence: 'Direct article text checked; supports impact-location and measurement caveats.',
  },
  {
    id: 'conduct',
    title: 'Rule 1: The Game, Player Conduct and the Rules',
    publisher: 'The R&A',
    url: 'https://www.randa.org/rog/the-rules-of-golf/rule-1',
    checked_on,
    status: 'verified',
    evidence: 'Direct official rule text checked, especially Rule 1.2a and 1.3a.',
  },
  {
    id: 'bunker-rules',
    title: 'Rule 12: Bunkers',
    publisher: 'The R&A',
    url: 'https://www.randa.org/rog/the-rules-of-golf/rule-12',
    checked_on,
    status: 'verified',
    evidence:
      'Direct Rule 12.2b checked; practice-swing restrictions distinguished from practice-area drills.',
  },
  {
    id: 'equipment-rules',
    title: "Rule 4: The Player's Equipment",
    publisher: 'The R&A',
    url: 'https://www.randa.org/rog/the-rules-of-golf/rule-4',
    checked_on,
    status: 'verified',
    evidence:
      'Official Rule 4 text retrieved; consult the current rule for equipment restrictions.',
  },
  {
    id: 'usga-sand',
    title: 'Rules FAQ: Touching Sand in Bunker with Club',
    publisher: 'USGA',
    url: 'https://www.usga.org/RulesFAQ/rules_answer.asp?FAQidx=204&Rule=0&Topic=3',
    checked_on,
    status: 'indexed',
    evidence: 'Official FAQ search-index text checked; direct automated access restricted.',
  },
];

export const lessons: Lesson[] = [
  {
    id: 'read-your-ball-flight',
    title: 'Clubface and swing path: read your ball flight',
    category_id: 'swing-fundamentals',
    level: 'Intermediate',
    status: 'published',
    diagram: 'flight',
    forum: 'swing-help',
    summary: 'Separate the starting direction from the curve before changing your swing.',
    objective:
      'Describe a shot using start, curve and strike, then choose one useful practice question.',
    introduction:
      'A ball finishing to the right can come from several different patterns. Record what the ball did before deciding what your body must have done. This is an observation lesson, not an attempt to diagnose your whole swing from a single shot.',
    principle:
      'Face-to-path is the difference between face angle and club path, not the difference between face angle and the target. With centered contact, this relationship is an important influence on curve. Off-center impact on a driver complicates that picture. The diagram is a simplified top-down example for a right-handed player; mirror left/right for a left-handed player.',
    steps: [
      'Choose a visible target and establish its line from behind the ball. Do not confuse your body alignment with the target line.',
      'Hit a small group of shots with the same club and a comfortable effort. Note the initial direction separately from where each ball finishes.',
      'Classify each shot as starting left, near the target, or right; then record its curve. A pull-fade and a push-fade are not identical observations.',
      'If you have safe access to strike feedback or a coach with a launch monitor, record impact location as well. Compare patterns rather than treating one number as a verdict.',
    ],
    mistakes: [
      'Assuming every ball that finishes right needs the same correction.',
      'Ignoring heel/toe contact while interpreting driver curve.',
      'Chasing a tour-player number instead of a useful personal pattern.',
    ],
    drill: {
      title: 'The ten-shot flight notebook',
      instructions: [
        'Draw three columns: start, curve, contact. Use the same target for ten shots.',
        'Make one observation per shot before hitting the next. Mark contact unknown rather than guessing.',
        'Circle the most frequent combination and take that specific question to practice or a lesson.',
      ],
      measure:
        'Count how often the same pattern repeats. This is a baseline, not a pass/fail swing score.',
    },
    course:
      'Use your familiar ball flight to select a starting line with enough room for a normal miss. Do not attempt an unfamiliar curve over a penalty area just because the flag looks inviting.',
    sources: [
      {
        id: 'face-path',
        supports: 'Centered-contact face-to-path definition and curve relationship.',
      },
      {
        id: 'club-data',
        supports: 'Why strike location affects how driver data should be interpreted.',
      },
    ],
    related: ['driver-slice', 'choose-your-target'],
  },
  {
    id: 'reliable-grip',
    title: 'Build a reliable golf grip',
    category_id: 'grip-stance-posture',
    level: 'Beginner',
    status: 'published',
    diagram: 'setup',
    forum: 'beginner-questions',
    summary:
      'Create a comfortable hand connection you can repeat without squeezing the swing away.',
    objective: 'Rebuild your grip deliberately and compare comfort, connection and face awareness.',
    introduction:
      'Your hands are your connection to the club. A useful grip is repeatable and comfortable, but there is no single hand position that every golfer must copy. Begin with an organized starting point and use short shots to gather feedback. Lead hand means the hand nearest the target; trail hand means the other hand.',
    principle:
      'Bernie Najar describes how hand placement influences wrist movement and the clubface. Overlap, interlock and ten-finger grips are different ways to connect the hands; comfort and a consistent connection matter. The following checkpoints are starting references, not a promise that changing your grip will cure every miss.',
    steps: [
      'Set the clubface toward a nearby reference first. Let the club rest securely across the base of the lead-hand fingers rather than burying it deep in the palm.',
      'Wrap the lead hand around the handle. Notice how the club sits and whether the wrist can move comfortably. Avoid forcing the thumb into a painful stretch.',
      'Add the trail hand so it fits around the lead thumb and supports the handle. Try a comfortable overlap, interlock or ten-finger connection; do not force an interlock if it hurts.',
      'Use enough pressure to control the club without locking your forearms. Make small waist-high swings and check whether the connection stays stable.',
      'Reset fully between shots. If you change one hand position, keep everything else as steady as possible and record what changed rather than making another adjustment immediately.',
    ],
    mistakes: [
      'Squeezing harder after every poor strike.',
      'Copying a photograph without considering handedness or comfort.',
      'Changing the grip, stance and swing thought at the same time.',
    ],
    drill: {
      title: 'Five calm resets',
      instructions: [
        'At the practice area, build your grip from scratch five times without hitting a ball.',
        'For each reset, note one comfort cue and one connection cue in your notebook.',
        'Hit five short shots. If the handle slips or your fingers hurt, stop and ask a qualified coach for help.',
        'Repeat on your next visit before trying longer swings.',
      ],
      measure:
        'Can you rebuild the same comfortable connection without looking at every finger? Keep the observation, not a forced pressure number.',
    },
    course:
      'Use the same quick hand check before a routine shot. A competition round is not the place to experiment with several new grip styles.',
    sources: [
      {
        id: 'grip',
        supports: 'Hand placement, wrist movement and the three common hand connections.',
      },
    ],
    related: ['smooth-takeaway', 'read-your-ball-flight'],
  },
  {
    id: 'contact-first',
    title: 'Ball striking: collect contact feedback',
    category_id: 'ball-striking',
    level: 'Beginner',
    status: 'published',
    diagram: 'practice',
    forum: 'swing-help',
    summary: 'Measure your strike before chasing more speed.',
    objective: 'Identify a repeatable contact pattern with short, controlled shots.',
    introduction:
      'A long shot is not useful if its contact changes every time. Before adding effort, gather a small sample of strikes. You are learning what happens, not labeling yourself a good or bad golfer.',
    principle:
      'Keith Stewart emphasizes impact position and free motion through the shot. Contact feedback helps you choose a productive question. This lesson deliberately avoids prescribing a rigid impact pose or a universal body correction.',
    steps: [
      'Use a mid-iron in a safe practice area. Choose a clear target and allow enough space for a miss.',
      'Make five short swings with the same setup and a balanced finish. Record whether contact felt solid, heavy or thin.',
      'If available, use appropriate impact tape following its instructions, then remove it before playing a competitive round.',
      'Repeat without adding speed. Ask a coach about the repeated pattern if it remains unclear.',
    ],
    mistakes: [
      'Trying to manufacture a frozen impact position.',
      'Counting only the best strike.',
      'Hitting rapidly without recording feedback.',
    ],
    drill: {
      title: 'Two groups of five',
      instructions: [
        'Write down five contact observations.',
        'Pause, repeat the same target and hit another five.',
        'Compare the common miss in the two groups.',
      ],
      measure:
        'Track the number of clearly solid contacts; do not change the definition halfway through.',
    },
    course:
      'Select a club and target that accommodate the contact you are producing today rather than the longest shot you have ever hit.',
    sources: [
      {
        id: 'iron-contact',
        supports: 'Impact quality and a freely completed swing as ball-striking priorities.',
      },
    ],
    related: ['iron-carry', 'practice-with-purpose'],
  },
  {
    id: 'driver-slice',
    title: 'A better way to investigate a driver slice',
    category_id: 'driving',
    level: 'Intermediate',
    status: 'published',
    diagram: 'flight',
    forum: 'swing-help',
    summary:
      'Replace a collection of swing fixes with a clear start-line, curve and contact check.',
    objective: 'Distinguish repeated slice observations and make a safer on-course plan.',
    introduction:
      'For a right-handed golfer, a slice curves strongly to the right; for a left-handed golfer, mirror that description. A slice is an outcome, not a complete explanation of your technique. There is no responsible single fix for every golfer. Start by identifying a pattern and work with a qualified coach when you need a mechanical change.',
    principle:
      'With centered contact, the clubface relationship to the path is a major factor in expected curvature. A face open to the path can produce rightward curve for a right-handed player even when the ball starts left of the target. Driver strike location also matters, so aiming farther left or simply swinging harder may hide a symptom rather than solve it.',
    steps: [
      'Choose one target at the range. Write down the start direction and curve of five drives at comfortable effort.',
      'Note any available strike feedback. If contact is consistently near the heel or toe, do not interpret curve as face/path alone.',
      'Check your aim from behind the ball. Confirm that the target you think you are using is the one you actually selected.',
      'Practice at an effort where you can finish in balance. Keep one task for the whole group of balls rather than layering three internet tips.',
      'Bring your notebook and, if permitted and safe, a short swing recording to a coach. Ask how strike, face and path interact in your pattern.',
    ],
    mistakes: [
      'Calling a push and a slice the same thing.',
      'Trying to force a draw before contact is understood.',
      'Aiming toward trouble to compensate for a curve that is not consistent.',
    ],
    drill: {
      title: 'Start-and-curve audit',
      instructions: [
        'Hit ten drives in two groups. Record start left/center/right and curve left/none/right.',
        'Mark solid/uncertain contact; uncertain is a useful answer.',
        'Before the second group, choose only one observable aim or balance checkpoint.',
        'Compare patterns, not just distance. Stop if the practice area is crowded or the target line is unsafe.',
      ],
      measure:
        'Which combination appeared most often? That is the next coaching question, not a guaranteed self-diagnosis.',
    },
    course:
      'Use a club and starting line that keep a normal miss away from severe trouble. If driver leaves too little room, a shorter club can be a sensible decision. Do not rely on a large curve to carry over people, houses or penalty areas.',
    sources: [
      {
        id: 'face-path',
        supports: 'Face open/closed relative to path, with centered-contact qualification.',
      },
      { id: 'club-data', supports: 'Driver impact-location caveat.' },
      {
        id: 'targets',
        supports: 'Assess lie, hazards and club choice before selecting the target.',
      },
    ],
    related: ['read-your-ball-flight', 'choose-your-target'],
  },
  {
    id: 'iron-carry',
    title: 'Iron play: learn your carry window',
    category_id: 'iron-play',
    level: 'Beginner',
    status: 'published',
    diagram: 'target',
    forum: 'course-strategy',
    summary: 'Plan with your normal distance range, not your personal best.',
    objective: 'Build an honest carry estimate and use it for one approach decision.',
    introduction:
      'Carry is the distance to the first landing point; total distance also includes bounce and roll. You need the former to clear trouble and both to understand where a shot might finish.',
    principle:
      'Trent Wearner highlights lie, required carry and the distance range of each club. Conditions and contact change the result. A range with unknown yardages or reduced-flight balls cannot give a precise course carry number.',
    steps: [
      'Use known targets or a coach-assisted launch monitor where available. Confirm whether the display shows carry or total.',
      'Hit a representative group with one iron, keeping ordinary misses in the record.',
      'Record a typical window rather than the longest shot. Note wind, lie and ball type.',
      'On an approach, compare the front carry and back trouble with that window; favor room for a miss.',
    ],
    mistakes: [
      'Using total distance to clear a bunker.',
      'Discarding every ordinary mishit.',
      'Assuming wet rough behaves like a clean range lie.',
    ],
    drill: {
      title: 'One-club yardage note',
      instructions: [
        'Record ten shots with the same iron.',
        'Highlight the middle cluster and record the conditions.',
        'Draw a hypothetical green with front and back trouble; choose a target that fits the window.',
      ],
      measure:
        'A written realistic range is the outcome. Do not invent a precision yardage if your measuring setup cannot support it.',
    },
    course:
      'When a cleanly struck maximum is required to clear trouble, another target or club is often wiser.',
    sources: [
      {
        id: 'targets',
        supports: 'Club distance ranges, carry, lie and landing-surface considerations.',
      },
    ],
    related: ['choose-your-target', 'contact-first'],
  },
  {
    id: 'chipping-landing',
    title: 'Short game: choose a landing area',
    category_id: 'short-game',
    level: 'Beginner',
    status: 'published',
    diagram: 'target',
    forum: 'practice-routines',
    summary: 'Turn a vague chip toward the flag into a landing-and-roll plan.',
    objective: 'Choose a landing area and test how a simple chip rolls on a practice green.',
    introduction:
      'You do not need to learn a spectacular flop shot first. Start with a safe, repeatable chip and enough green to let the ball run. Local ground conditions will affect the result.',
    principle:
      'The landing surface, available green and lie influence the shot you can sensibly play. This plan uses the shot-selection framework in Choosing Wisely; the four-keys chipping lesson is optional further viewing, not a source for invented technical positions.',
    steps: [
      'Identify the lie and any obstacle between you and the green.',
      'Choose a generous landing area rather than a tiny exact spot.',
      'Use a club and basic motion you have practiced; ask a coach for setup advice if contact is unreliable.',
      'Watch both first bounce and rollout. Adjust the plan from observed results, not just where the ball finished.',
    ],
    mistakes: [
      'Watching only the final position.',
      'Choosing maximum loft automatically.',
      'Using a tight or buried lie as your first practice task.',
    ],
    drill: {
      title: 'Landing-area notebook',
      instructions: [
        'On an authorized practice green, mark a generous area with flat, removable markers.',
        'Chip five balls from the same easy lie.',
        'Record how many first land in the area and how far they roll; try a second safe club.',
      ],
      measure: 'Track landing success separately from final proximity.',
    },
    course:
      'A low-risk shot with enough roll space is often appropriate when there is no obstacle to carry.',
    sources: [
      { id: 'targets', supports: 'Lie, trajectory and landing-surface assessment.' },
      { id: 'short-game', supports: 'Further reading and coach-led chipping demonstration.' },
    ],
    related: ['putting-distance', 'choose-your-target'],
  },
  {
    id: 'putting-distance',
    title: 'Putting distance control: build a pace ladder',
    category_id: 'putting',
    level: 'Beginner',
    status: 'published',
    diagram: 'practice',
    forum: 'practice-routines',
    summary: 'Practice speed and start line as separate skills, then bring them together.',
    objective: 'Establish a repeatable distance-control exercise and record honest feedback.',
    introduction:
      "A long putt that finishes close gives you a manageable next putt, even when the first one does not drop. Start by understanding pace on the actual surface. A home carpet can be useful for routine and start line, but it cannot tell you the speed of tomorrow's green.",
    principle:
      "Brendon Elliott describes varying-distance practice for feel and distance control. Golfer Hub's ladder below is an original exercise adaptation: its distances and scoring are practice choices, not an official test or promise of lower scores. Separate short/long feedback from left/right feedback so you know what you are training.",
    steps: [
      'Choose a relatively level section of an authorized practice green. Check that the task will not obstruct other golfers.',
      'Make a broad stopping zone using two flat markers. Start nearby and roll three balls toward it.',
      'Observe the stopping distance before changing anything. Keep a comfortable stroke rhythm and let the result tell you whether more or less pace is needed.',
      'Move farther away and repeat. Use several distances rather than rolling ten identical putts without attention.',
      'Finally, change the line or slope. Read the putt again; a pace learned on the flat does not transfer unchanged uphill or downhill.',
    ],
    mistakes: [
      'Judging a good pace drill only by how many balls are holed.',
      'Treating a carpet and grass green as equivalent surfaces.',
      "Leaving balls and markers in another player's practice line.",
    ],
    drill: {
      title: 'Three-distance pace ladder',
      instructions: [
        'Set a generous stopping zone on a quiet practice green.',
        'Putt three balls from short, medium and longer starting points; choose distances that suit the available space.',
        'Score only whether each ball stops in the zone. Record short/long misses separately.',
        'Repeat next visit with the same zone size, then vary slope once your baseline is useful.',
      ],
      measure:
        'Record zone hits out of nine. Compare like-for-like conditions, not a dry flat green with a wet downhill putt.',
    },
    course:
      "Before a round, roll putts of several lengths to learn the day's pace. For a long putt, choose a sensible line and speed that leave a manageable second putt, while still giving the ball a chance.",
    sources: [
      {
        id: 'putting',
        supports:
          'Varying-distance practice as a way to work on putting touch and avoid three-putts.',
      },
    ],
    related: ['chipping-landing', 'practice-with-purpose'],
  },
  {
    id: 'bunker-basics',
    title: 'Greenside bunkers: practice the splash safely',
    category_id: 'bunker-play',
    level: 'Beginner',
    status: 'published',
    diagram: 'setup',
    forum: 'beginner-questions',
    summary:
      'Understand sand-first contact and separate a practice drill from the Rules during a round.',
    objective: 'Practice a sand-entry task in a designated practice bunker and know its limits.',
    introduction:
      'A normal greenside splash shot is different from an iron shot on grass: the club interacts with sand before the ball. Begin from a good lie in a practice bunker. Buried balls, compact wet sand and high lips need different decisions and often individual coaching.',
    principle:
      'Bill Murchison emphasizes forward ball position, an open face and sand-first contact for the ordinary greenside shot. Those are starting concepts, not one setup for every bunker lie. During a round, Rule 12 restricts sand contact in a practice swing and backswing; do not copy a sand drill next to your ball in play.',
    steps: [
      'Use a designated practice bunker, check for people around the green, and choose a safe landing area.',
      'Ask a coach to help match wedge loft and setup to the lie. For a normal splash, work with forward ball position and appropriate open-face setup.',
      'Practice contacting sand before adding a ball. Keep the task small and focus on where the club enters.',
      'Add a ball only after you can repeat sand contact; finish the motion instead of stopping at the sand. Rake afterwards.',
    ],
    mistakes: [
      'Performing a sand-contact practice swing during a round.',
      'Using an open-face soft-sand technique automatically for a buried lie.',
      'Aiming at a lip you cannot safely clear.',
    ],
    drill: {
      title: 'Practice-only entry line',
      instructions: [
        'In a designated practice bunker, draw a line and rehearse sand contact at it without a ball.',
        'Record five entry points. Then place a ball forward of the line and try a small group with safe clearance.',
        'Rake and remove every practice marker before leaving.',
      ],
      measure:
        'Repeatable entry is the first target. Distance and height come later with the appropriate lie-specific technique.',
    },
    course:
      'Choose escape first when the lie or lip is difficult. Consult Rule 12 and a referee/Committee for rules uncertainty.',
    sources: [
      {
        id: 'bunkers',
        supports:
          'Forward ball, open face and sand-first concepts for a typical greenside bunker shot.',
      },
      {
        id: 'bunker-rules',
        supports: 'Rule 12.2b practice-swing and backswing sand restrictions.',
      },
      { id: 'usga-sand', supports: 'Official USGA FAQ on prohibited club contact.' },
    ],
    related: ['choose-your-target', 'golf-etiquette'],
  },
  {
    id: 'choose-your-target',
    title: 'Course management: when not to attack the pin',
    category_id: 'course-strategy',
    level: 'Intermediate',
    status: 'published',
    diagram: 'target',
    forum: 'course-strategy',
    summary: 'Make a plan for your normal miss before committing to the shot.',
    objective: 'Choose a target using lie, carry, trouble and an exit strategy.',
    introduction:
      'The flag is not automatically the best target. A good decision leaves room for the range of shots you normally hit. Think about where the ball can safely finish, not only where a perfect shot would land.',
    principle:
      'Trent Wearner describes evaluating lie, required carry, hazards and a safe miss. A poor lie or narrow carry window can make a conservative option the correct one. This is a decision framework, not an exact strokes-gained calculation.',
    steps: [
      'Inspect the lie as you approach. Decide which clubs and trajectories are realistic.',
      'Identify the carry to safety and where going long becomes trouble. Compare these with your normal distance window.',
      'Choose a landing area and a safe miss, giving ordinary left/right variation space.',
      'Commit to that shot. If the conditions change, step back and reassess before addressing the ball.',
    ],
    mistakes: [
      'Planning only for perfect contact.',
      'Using your longest-ever iron as a normal carry.',
      'Confusing a conservative target with an uncommitted swing.',
    ],
    drill: {
      title: 'Three approach sketches',
      instructions: [
        'Sketch three greens from a course you know without publishing private course materials.',
        'Mark trouble and a generous landing area on each.',
        'Write the lie, required carry, safe miss and club you would select.',
      ],
      measure:
        'Can you explain why the target fits your actual game? Compare the decision with the outcome without rewriting history.',
    },
    course: 'Especially useful for tucked pins, front bunkers, wind and shots from rough.',
    sources: [
      {
        id: 'targets',
        supports: 'Lie, carry yardage, hazards, landing surface and exit strategies.',
      },
    ],
    related: ['iron-carry', 'reset-routine'],
  },
  {
    id: 'golf-etiquette',
    title: 'Golf etiquette: a considerate first round',
    category_id: 'rules-etiquette',
    level: 'Beginner',
    status: 'published',
    diagram: 'practice',
    forum: 'beginner-questions',
    summary: 'Learn safety, pace and course care without mistaking every convention for a penalty.',
    objective: 'Use a simple consideration checklist and know where to find the official rule.',
    introduction:
      'Being a good playing partner is not about having a perfect swing. It is about awareness and care. Ask your host or course staff about local expectations and follow their instructions.',
    principle:
      'Rule 1.2a expects integrity, consideration for others and care of the course. It includes safety, prompt pace and avoiding distractions. A Committee may adopt a Code of Conduct; everyday etiquette should not be presented as an automatic penalty in every situation.',
    steps: [
      'Before swinging, check that people are out of range and that the practice swing is safe. If a shot may endanger someone, immediately shout a warning such as fore.',
      'Prepare while others play when it is safe and non-distracting. Keep up with the group and follow local pace guidance.',
      'Stand where you will not distract another player, and ask where to wait if unsure.',
      "Repair damage following the course's instructions: ball marks, divots and bunker footprints. Be honest about penalties and ask the Committee when uncertain.",
    ],
    mistakes: [
      'Swinging while someone is within reach.',
      'Treating local etiquette as a universal fixed penalty.',
      'Letting embarrassment stop you asking a rules question.',
    ],
    drill: {
      title: 'A considerate nine',
      instructions: [
        'Before playing, write safety, pace, distraction and care on a note.',
        'At the end of each hole, briefly check whether one habit needs attention.',
        'Ask your playing partner one practical question, without interrupting a shot.',
      ],
      measure:
        'Choose one improved habit for the next round, not a moral score for your playing partners.',
    },
    course:
      'Use these habits from arrival to the final green. Local Rules and competition terms still need separate attention.',
    sources: [
      {
        id: 'conduct',
        supports: 'Rule 1.2a conduct expectations and Rule 1.2b local Code of Conduct distinction.',
      },
    ],
    related: ['first-tournament', 'bunker-basics'],
  },
  {
    id: 'reset-routine',
    title: 'Mental game: reset after a difficult hole',
    category_id: 'mental-game',
    level: 'Beginner',
    status: 'published',
    diagram: 'practice',
    forum: 'mental-game',
    summary: 'Give the next shot a useful decision instead of carrying the last mistake into it.',
    objective: 'Practice a short reset that returns attention to a controllable task.',
    introduction:
      'Frustration is part of learning a difficult game. You do not have to pretend a bad hole felt good. A routine is a framework for returning to the next decision, not a requirement to feel perfectly calm.',
    principle:
      'Brendon Elliott discusses a consistent but flexible routine and the importance of preparation beyond technique. The reset below is a Golfer Hub practice exercise, not therapy or a guaranteed performance method.',
    steps: [
      'Acknowledge the result briefly without inventing a technical diagnosis.',
      'Take a comfortable breath and shift attention to the next lie, distance and safe target.',
      'Choose one simple intention for the next shot. Do not rebuild your entire swing mid-round.',
      'Return to your familiar setup routine; allow flexibility when conditions require it.',
    ],
    mistakes: [
      'Trying to win back every lost stroke on the next hole.',
      'Treating emotion as evidence of personal failure.',
      'Rushing the next decision to escape the previous one.',
    ],
    drill: {
      title: 'One-shot reset rehearsal',
      instructions: [
        'At practice, after each imperfect shot pause and describe only the observable outcome.',
        'Write the next target, choose one intention and go through your usual routine.',
        'Review whether you followed the decision process, not whether every ball was perfect.',
      ],
      measure:
        'Record occasions where you returned to a clear task. This is a habit log, not a mental-health assessment.',
    },
    course:
      'Useful after a penalty, missed short putt or difficult hole; keep safety and pace in mind.',
    sources: [
      {
        id: 'routine',
        supports: 'Consistent flexible routines, emotional pressures and mental preparation.',
      },
    ],
    related: ['choose-your-target', 'first-tournament'],
  },
  {
    id: 'practice-with-purpose',
    title: 'A practice plan that asks one clear question',
    category_id: 'practice-plans',
    level: 'Beginner',
    status: 'published',
    diagram: 'practice',
    forum: 'practice-routines',
    summary: 'Turn a range visit into a focused task, useful feedback and a next step.',
    objective: 'Create a manageable practice session with a specific goal and observable result.',
    introduction:
      "A bucket of balls is not itself a plan. Choose a task you can observe and leave time to record the result. The session below is an original Golfer Hub structure; adapt it to the available space and your coach's advice.",
    principle:
      "PGA Coach Angela Buzminski's published practice lesson emphasizes setting a goal at the start of a session. A narrow goal makes feedback useful. The official publisher links the video below; playback availability depends on YouTube and is not certified by Golfer Hub.",
    steps: [
      'Write one question, such as whether your longer putts consistently finish short.',
      'Choose a safe drill that produces evidence about that question.',
      'Practice in small groups and record each result; pause between groups instead of hitting continuously.',
      'Finish by writing what you observed and the next useful task. Save that task as a goal if signed in.',
    ],
    mistakes: [
      'Changing the goal after every miss.',
      'Trying to work on every part of golf in one rushed visit.',
      'Keeping a flattering memory instead of the record.',
    ],
    drill: {
      title: 'Observe, test, review',
      instructions: [
        'Spend the first few repetitions establishing a baseline.',
        'Complete two small groups with the same task.',
        'Write one finding and one next action, then stop before concentration fades.',
      ],
      measure:
        'A completed record and a clear next question are success even if the numbers did not improve today.',
    },
    course:
      'Practice the routine and decisions you will use on the course, not only identical shots from a perfect lie.',
    sources: [
      { id: 'practice', supports: 'Setting a goal before practice; official video attribution.' },
    ],
    related: ['putting-distance', 'contact-first'],
    video: {
      id: '85Ldq6g7LSk',
      title: 'Effective vs. Non-Effective Practice',
      publisher: 'PGA of America / Angela Buzminski',
      evidence:
        'Video identifier found in the official publisher article; direct playback requires final browser verification.',
    },
  },
  {
    id: 'equipment-start',
    title: 'Equipment basics: start without overspending',
    category_id: 'equipment-basics',
    level: 'Beginner',
    status: 'published',
    diagram: 'setup',
    forum: 'equipment-talk',
    summary: 'Understand club roles and seek a comfortable starting set before buying a full bag.',
    objective:
      'Prepare sensible questions for a professional and distinguish learning needs from purchases.',
    introduction:
      'Starting golf does not require buying the newest full set. Borrowing or taking introductory lessons can help you decide what suits you before committing money.',
    principle:
      'Jack Dillon recommends beginning with instruction and working with a professional on suitable equipment once you know your involvement. The Rules impose equipment requirements and a club limit; consult current Rule 4 rather than using this overview as an equipment ruling.',
    steps: [
      'Ask the facility whether introductory lessons include clubs and what you need to bring.',
      'Discuss comfort, handedness and budget with a qualified professional.',
      'Learn what a putter, wedge, iron, hybrid and wood are used for rather than assuming every bag needs every option.',
      'Inspect grips and basic condition; avoid purchasing because a tour player uses the same model.',
    ],
    mistakes: [
      'Buying before trying an introductory session.',
      'Assuming expensive clubs replace practice.',
      'Taking unofficial forum advice as an equipment conformity ruling.',
    ],
    drill: {
      title: 'Your first-bag questions',
      instructions: [
        'Write your available budget privately, what clubs you can borrow and your learning priorities.',
        'Ask a professional which small starting set is practical.',
        'Record the advice and take time before purchasing.',
      ],
      measure:
        'A useful plan that fits your circumstances, not a particular brand or shopping total.',
    },
    course: 'Carry equipment you know how to use and check the relevant Rules for competitions.',
    sources: [
      {
        id: 'equipment',
        supports: 'Introductory instruction before purchasing and professional equipment advice.',
      },
      { id: 'equipment-rules', supports: 'Current official equipment rules for further reading.' },
    ],
    related: ['reliable-grip', 'golf-etiquette'],
  },
  {
    id: 'first-tournament',
    title: 'Your first tournament: prepare before the first tee',
    category_id: 'tournament-preparation',
    level: 'Beginner',
    status: 'published',
    diagram: 'practice',
    forum: 'tournament-experience',
    summary:
      'Organize the practical details so your first tee is about playing, not searching your bag.',
    objective: 'Build a personal preparation checklist and identify event-specific information.',
    introduction:
      'Your first competition does not need to be your best-ever round. Knowing the arrangements leaves more attention for the game. Check the event information early and ask the organizer about uncertainties.',
    principle:
      "Brandi Jackson's pre-tee checklist covers clean equipment, water/snacks, ball identification, sun protection, pin information and time to settle. Official competition terms and Local Rules also matter; your event organizer is the authority for those details.",
    steps: [
      'Confirm the start time, check-in process, format and event-specific rules with the organizer.',
      'Prepare clean equipment, clearly identifiable golf balls and suitable clothing.',
      'Bring appropriate water, snacks and protection for the weather; check personal needs with a responsible adult when appropriate.',
      'Allow time for a familiar warm-up and to read any supplied pin sheet. Follow practice restrictions and arrive at your starting point in good time.',
    ],
    mistakes: [
      'Experimenting with a new swing or unfamiliar club in the warm-up.',
      "Assuming a casual round's procedures apply to a competition.",
      'Leaving the simple bag tasks until your name is called.',
    ],
    drill: {
      title: 'The night-before checklist',
      instructions: [
        'Write equipment, event details, travel and personal essentials in four headings.',
        'Check what is ready the evening before and what must wait until the morning.',
        'After the event, record one logistical lesson for next time.',
      ],
      measure: 'The checklist reflects the actual event and your needs, not a promise about score.',
    },
    course:
      'Use it before school events, club competitions and junior tournaments; ask the Committee rather than guessing a rule.',
    sources: [
      { id: 'tournament', supports: 'Six practical preparations before teeing off.' },
      {
        id: 'conduct',
        supports: 'Rule 1.3a responsibility for Terms of Competition and Local Rules.',
      },
    ],
    related: ['reset-routine', 'golf-etiquette'],
  },
];
// Reuse the takeaway source for a full fundamentals lesson, not placeholder content.
lessons.push({
  id: 'smooth-takeaway',
  title: 'A smooth takeaway: start with simple checkpoints',
  category_id: 'swing-fundamentals',
  level: 'Beginner',
  status: 'published',
  diagram: 'setup',
  forum: 'swing-help',
  summary: 'Explore a slow start without forcing your swing onto an imaginary perfect line.',
  objective:
    'Use a comfortable address and a slow rehearsal to observe the first part of your swing.',
  introduction:
    'The takeaway is the opening movement of the backswing. A deliberate rehearsal helps you notice what happens before speed makes the pattern difficult to see.',
  principle:
    'Peter Krause connects address, face awareness and a wrist hinge that blends with body turn. His checkpoints are useful coaching references, not requirements for every body type or a reason to lock your head and arms.',
  steps: [
    'Establish a comfortable address; notice where the handle points relative to your body.',
    'Rehearse a short slow takeaway in a safe area, allowing the arms and turn to work together.',
    'Pause briefly around shaft-parallel to observe the club rather than force an exact position.',
    'Return to short shots. Ask a coach to interpret repeated patterns instead of adding corrections yourself.',
  ],
  mistakes: [
    'Holding the body rigid while moving only the hands.',
    'Rehearsing with a club where people or objects are within reach.',
    'Making slow positions the sole measure of a useful golf swing.',
  ],
  drill: {
    title: 'Rehearse, then hit',
    instructions: [
      'Alternate one safe slow rehearsal with one short shot.',
      'Record one observation for each pair.',
      'Keep the same task for five pairs before reassessing.',
    ],
    measure: 'Can you describe the first movement more clearly and retain comfortable motion?',
  },
  course: 'Use a familiar rehearsal cue rather than a long technical checklist during play.',
  sources: [
    {
      id: 'takeaway',
      supports: 'Address hand height, clubface awareness and blended wrist hinge/body turn.',
    },
  ],
  related: ['reliable-grip', 'read-your-ball-flight'],
});

export function readingMinutes(lesson: Lesson) {
  return Math.max(3, Math.ceil(JSON.stringify(lesson).split(/\s+/).length / 180));
}
export const learningPath = [
  'reliable-grip',
  'smooth-takeaway',
  'contact-first',
  'putting-distance',
  'choose-your-target',
  'golf-etiquette',
];
