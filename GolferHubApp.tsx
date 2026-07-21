"use client";

import type { ReactNode } from "react";
import { FormEvent, useMemo, useState } from "react";

type View =
  | "home"
  | "learn"
  | "article"
  | "forum"
  | "post"
  | "coaches"
  | "coach"
  | "dashboard"
  | "sources"
  | "about";

type Article = {
  id: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
  summary: string;
  source: string;
  drill: string;
  video: string;
  relatedQuestion: string;
  saved?: boolean;
};

type ArticleDetail = Article & {
  objective: string;
  keyConcept: string;
  visualTitle: string;
  visualNotes: string[];
  steps: string[];
  mistakes: string[];
  courseUse: string;
  citations: string[];
};

type Coach = {
  id: string;
  name: string;
  location: string;
  specialties: string[];
  years: number;
  level: string;
  bio: string;
  rating: string;
  philosophy: string;
  style: string;
  image: string;
};

type ForumPost = {
  id: string;
  title: string;
  category: string;
  author: string;
  avatar: string;
  time: string;
  votes: number;
  comments: number;
  tags: string[];
  body: string;
  relatedLesson: string;
  answered?: boolean;
};

const categories = [
  "Swing Fundamentals",
  "Grip, Stance, and Posture",
  "Ball Striking",
  "Driving",
  "Iron Play",
  "Short Game",
  "Putting",
  "Bunker Play",
  "Course Strategy",
  "Golf Rules and Etiquette",
  "Mental Game",
  "Practice Plans",
  "Equipment Basics",
  "Tournament Preparation",
];

const articles: Article[] = [
  {
    id: "grip",
    title: "How to Build a Reliable Golf Grip",
    category: "Grip, Stance, and Posture",
    level: "Beginner",
    readTime: "7 min",
    summary:
      "Turn grip advice into a repeatable pre-shot checkpoint for face control, pressure, and setup confidence.",
    source: "Source Basis: Ben Hogan's Five Lessons; PGA coaching resources",
    drill: "Grip checkpoint ladder",
    video: "Recommended source: PGA / recognized coach video to verify",
    relatedQuestion: "Why does my clubface feel different every swing?",
    saved: true,
  },
  {
    id: "ball-position",
    title: "Understanding Ball Position for Different Clubs",
    category: "Ball Striking",
    level: "Beginner",
    readTime: "6 min",
    summary:
      "Learn why driver, irons, wedges, and putter setups need different ball-position reference points.",
    source: "Source Basis: PGA coaching resources; Golf Digest instruction archive",
    drill: "Club-by-club setup map",
    video: "Video source to verify before public launch",
    relatedQuestion: "Should my wedge and 7-iron ball position match?",
  },
  {
    id: "driver-slice",
    title: "How to Stop Slicing the Driver",
    category: "Driving",
    level: "Intermediate",
    readTime: "9 min",
    summary:
      "Connect start line, curve, clubface, and path so driver practice becomes diagnosis instead of guessing.",
    source: "Source Basis: Golf Digest and GOLF.com instruction concepts",
    drill: "Headcover path gate",
    video: "Recommended source: Golf Digest / GOLF.com video to verify",
    relatedQuestion: "Why do I keep slicing my driver?",
    saved: true,
  },
  {
    id: "putting-distance",
    title: "Putting Distance Control",
    category: "Putting",
    level: "Beginner",
    readTime: "8 min",
    summary:
      "Build pace with ladder drills, distance windows, and feedback that transfers from carpet to course.",
    source: "Source Basis: Harvey Penick's Little Red Book; PGA coaching resources",
    drill: "3-6-9-12 pace ladder",
    video: "Recommended source: recognized putting coach video to verify",
    relatedQuestion: "What is the best way to practice putting at home?",
  },
  {
    id: "course-management",
    title: "When Not to Attack the Pin",
    category: "Course Strategy",
    level: "Intermediate",
    readTime: "10 min",
    summary:
      "Use green shape, hazard position, lie, and your own miss pattern to choose smarter approach targets.",
    source: "Source Basis: recognized course strategy coaching principles",
    drill: "Green-light / yellow-light / red-light target map",
    video: "Video source to verify before public launch",
    relatedQuestion: "When should I stop aiming at every flag?",
  },
  {
    id: "etiquette",
    title: "Basic Golf Etiquette for New Players",
    category: "Golf Rules and Etiquette",
    level: "Beginner",
    readTime: "6 min",
    summary:
      "Learn the habits that make you easy to play with: pace, safety, course care, silence, and awareness.",
    source: "Source Basis: USGA Rules Education and R&A Rules materials",
    drill: "Nine-hole etiquette scorecard",
    video: "Recommended source: USGA / R&A education video to verify",
    relatedQuestion: "What course habits should I know before joining a group?",
  },
  {
    id: "bunker-basics",
    title: "Bunker Play Without Panic",
    category: "Bunker Play",
    level: "Beginner",
    readTime: "7 min",
    summary:
      "Use a simple splash concept, stable setup, and one practice task to escape greenside sand more often.",
    source: "Source Basis: common short-game coaching principles; citation needed",
    drill: "Line-in-sand splash drill",
    video: "Video source to verify before public launch",
    relatedQuestion: "How do I stop leaving bunker shots in the sand?",
  },
  {
    id: "tournament-week",
    title: "First Tournament Week Practice Plan",
    category: "Tournament Preparation",
    level: "Intermediate",
    readTime: "11 min",
    summary:
      "Plan practice, rest, warm-up, and scoring goals without rebuilding your swing the week of competition.",
    source: "Source Basis: junior golf preparation guidance; PGA coaching resources",
    drill: "Three-session tournament taper",
    video: "Recommended source: junior golf coach video to verify",
    relatedQuestion: "What should I practice before my first tournament?",
  },
  {
    id: "clubface-path",
    title: "Clubface and Swing Path: Why the Ball Curves",
    category: "Swing Fundamentals",
    level: "Intermediate",
    readTime: "9 min",
    summary:
      "Read ball flight like a clue: start direction, curve, and contact can reveal face and path patterns.",
    source: "Source Basis: Trackman-style terminology and public ball-flight education",
    drill: "Start-line and curve journal",
    video: "Recommended source: launch-monitor education video to verify",
    relatedQuestion: "Why does the ball start right then curve farther right?",
  },
  {
    id: "mental-reset",
    title: "A Reset Routine After a Bad Hole",
    category: "Mental Game",
    level: "Beginner",
    readTime: "5 min",
    summary:
      "Use a short reset script to prevent one mistake from becoming three rushed holes.",
    source: "Source Basis: common sport psychology coaching principles",
    drill: "Two-shot memory reset",
    video: "Video source to verify before public launch",
    relatedQuestion: "How do I stay calm after a bad hole?",
  },
];

const articleDetails: Record<string, ArticleDetail> = {
  grip: {
    ...articles[0],
    objective:
      "Build a neutral, repeatable grip checkpoint that makes the clubface easier to manage before the swing begins.",
    keyConcept:
      "The grip is not a magic fix, but it changes how naturally the clubface returns to impact. Golfer Hub teaches it as a setup system: hand placement, pressure, face awareness, then repetition.",
    visualTitle: "Grip map",
    visualNotes: ["Lead hand angle", "Trail hand match", "Pressure 4/10", "Face square check"],
    steps: [
      "Place the lead hand so the grip runs diagonally through the fingers, not deep across the palm.",
      "Match the trail hand so both hands feel connected and the thumbs sit naturally on the handle.",
      "Hold the club with enough pressure to control it, but not enough to tighten the forearms.",
      "Recheck the face at waist height, then return to address and hit a short shot.",
    ],
    mistakes: [
      "Changing hand position after every miss instead of testing one checkpoint for a full practice block.",
      "Squeezing the handle until wrist hinge and tempo disappear.",
      "Copying a grip shape without checking whether the clubface is actually square.",
    ],
    courseUse:
      "Use the grip map before tee shots, wedges, and pressure putts when your hands feel tense or unfamiliar.",
    citations: [
      "Inspired by Ben Hogan's Five Lessons and common PGA coaching language about hand placement.",
      "Citation needed before publication for any direct quote, page reference, or certified instruction claim.",
    ],
  },
  "driver-slice": {
    ...articles[2],
    objective:
      "Diagnose whether your slice is mostly setup, face angle, swing path, or a combination before changing everything.",
    keyConcept:
      "A slice is not one problem. Golfer Hub frames it as a ball-flight investigation: where the ball starts, how it curves, and what your setup encourages.",
    visualTitle: "Ball-flight decoder",
    visualNotes: ["Start line", "Curve right", "Face-to-path", "Inside gate"],
    steps: [
      "Track start line first. A ball starting right and curving right tells a different story than one starting left and curving right.",
      "Check aim lines. Feet, hips, and shoulders should not quietly point far left.",
      "Rehearse a smoother path that feels less across the ball, then hit half-speed drivers before full swings.",
      "Pair the path work with face awareness so the face is not dramatically open at impact.",
    ],
    mistakes: [
      "Aiming farther left, which often encourages a more leftward swing path.",
      "Trying to flip the hands shut without learning face and path together.",
      "Buying equipment changes before checking grip, tee height, ball position, and alignment.",
    ],
    courseUse:
      "Until the pattern improves, choose left-center fairway targets and avoid heroic lines over right-side trouble.",
    citations: [
      "Inspired by public Golf Digest and GOLF.com instruction themes on slice correction.",
      "Based on common coaching principles; not a certified diagnosis of an individual swing.",
    ],
  },
  etiquette: {
    ...articles[5],
    objective:
      "Help new golfers feel comfortable on the course by learning safety, pace, care for the course, and respect for other players.",
    keyConcept:
      "Etiquette is the hidden skill that makes golf more welcoming. It protects people, protects the course, and helps a group keep rhythm.",
    visualTitle: "First-round checklist",
    visualNotes: ["Safe to swing?", "Ready golf", "Repair marks", "Watch shots"],
    steps: [
      "Be ready when it is your turn, but never swing until the group ahead is safely out of range.",
      "Keep bags, carts, and practice swings away from greens, tee markers, and fragile course areas.",
      "Repair ball marks, replace divots when appropriate, rake bunkers, and leave the course better than you found it.",
      "Stay still and quiet while others play, then help watch shots so the group can find balls quickly.",
    ],
    mistakes: [
      "Taking several practice swings when the group is already waiting.",
      "Walking across another player's putting line.",
      "Treating pace and safety as optional instead of part of good golf.",
    ],
    courseUse:
      "Use this every time you join a new group, play a school match, or visit a course for the first time.",
    citations: [
      "Source basis: USGA and R&A public rules education and player conduct resources.",
      "Golfer Hub is independent and not endorsed by the USGA, R&A, PGA, Golf Digest, or GOLF.com.",
    ],
  },
};

const videoLessons = [
  {
    title: "Grip fundamentals video support",
    source: "Recommended source: PGA / recognized coach",
    link: "https://www.youtube.com/@PGAAmerica",
    status: "Video source to verify",
    topic: "Grip, Stance, and Posture",
  },
  {
    title: "Rules and etiquette education",
    source: "Recommended source: USGA / R&A",
    link: "https://www.youtube.com/@usga",
    status: "Source verified, exact video pending",
    topic: "Golf Rules and Etiquette",
  },
  {
    title: "Driver slice correction library",
    source: "Recommended source: Golf Digest",
    link: "https://www.youtube.com/@golfdigest",
    status: "Video source to verify",
    topic: "Driving",
  },
  {
    title: "Putting pace and distance control",
    source: "Recommended source: recognized putting coach",
    link: "https://www.youtube.com/results?search_query=putting+distance+control+golf+instruction",
    status: "Citation needed before public launch",
    topic: "Putting",
  },
];

const learningPaths = [
  {
    title: "Beginner Ball Striking",
    level: "Beginner",
    lessons: 6,
    progress: 42,
    tags: ["Source Verified", "Practice Drill", "Video Support"],
    note: "Start with grip, ball position, contact, and simple face awareness.",
  },
  {
    title: "Driver Slice Fix",
    level: "Intermediate",
    lessons: 5,
    progress: 28,
    tags: ["Swing Help", "Video Lesson", "Forum Linked"],
    note: "Read ball flight, map setup, then train face and path together.",
  },
  {
    title: "Short Game Foundation",
    level: "Beginner",
    lessons: 7,
    progress: 18,
    tags: ["Practice Drill", "Coach Note", "Green Map"],
    note: "Build simple wedge, bunker, and putting decisions near the green.",
  },
  {
    title: "First Tournament Prep",
    level: "Student Golfer",
    lessons: 4,
    progress: 64,
    tags: ["Mental Game", "Checklist", "Course Strategy"],
    note: "Turn practice into a calmer tournament week with fewer late changes.",
  },
];

const forumPosts: ForumPost[] = [
  {
    id: "slice-help",
    title: "Why do I keep slicing my driver?",
    category: "Swing Help",
    author: "Maya R.",
    avatar: "MR",
    time: "18 min ago",
    votes: 42,
    comments: 14,
    tags: ["driver", "slice", "clubface"],
    body:
      "My irons are playable, but driver starts right and keeps curving. I aim left and it still slices. What should I check first before I rebuild everything?",
    relatedLesson: "Clubface and Swing Path",
  },
  {
    id: "first-tournament",
    title: "What should I practice before my first tournament?",
    category: "Tournament Experience",
    author: "Ethan C.",
    avatar: "EC",
    time: "34 min ago",
    votes: 31,
    comments: 9,
    tags: ["junior golf", "routine", "practice"],
    body:
      "I have my first school event next week. I do not want to panic practice. What should my last few practice sessions look like?",
    relatedLesson: "First Tournament Week Practice Plan",
    answered: true,
  },
  {
    id: "bad-hole",
    title: "How do I stay calm after a bad hole?",
    category: "Mental Game",
    author: "Nina L.",
    avatar: "NL",
    time: "1 hr ago",
    votes: 27,
    comments: 8,
    tags: ["mental reset", "scoring"],
    body:
      "One double bogey turns into three holes of rushed swings. Does anyone have a reset routine that works during matches?",
    relatedLesson: "Mental Game Before Competition",
    answered: true,
  },
  {
    id: "fitted-clubs",
    title: "Should beginners invest in fitted clubs?",
    category: "Equipment Talk",
    author: "Sam P.",
    avatar: "SP",
    time: "2 hrs ago",
    votes: 19,
    comments: 11,
    tags: ["clubs", "budget", "beginner"],
    body:
      "I am six months into golf and using a hand-me-down set. Is fitting worth it now, or should I wait until my swing is more consistent?",
    relatedLesson: "Equipment Basics Before Buying Clubs",
  },
  {
    id: "home-putting",
    title: "What is the best way to practice putting at home?",
    category: "Practice Routines",
    author: "Jordan K.",
    avatar: "JK",
    time: "3 hrs ago",
    votes: 24,
    comments: 7,
    tags: ["putting", "home drills"],
    body:
      "I have a carpet and a putting mat but no real green nearby during weekdays. What drills transfer best to the course?",
    relatedLesson: "Putting Distance Control",
    answered: true,
  },
  {
    id: "pin-attack",
    title: "When should I stop aiming at every flag?",
    category: "Course Strategy",
    author: "Leo M.",
    avatar: "LM",
    time: "4 hrs ago",
    votes: 33,
    comments: 10,
    tags: ["strategy", "approach"],
    body:
      "I make more doubles from short-sided misses than from bad drives. How do better players choose smarter targets?",
    relatedLesson: "When Not to Attack the Pin",
  },
  {
    id: "wedges",
    title: "How many wedge distances should I know?",
    category: "Short Game",
    author: "Ava T.",
    avatar: "AT",
    time: "5 hrs ago",
    votes: 18,
    comments: 5,
    tags: ["wedges", "short game"],
    body:
      "My full wedge is okay, but 40-80 yards is messy. Should I learn clock positions or just feel it?",
    relatedLesson: "Short Game Foundation",
  },
  {
    id: "rules-drop",
    title: "Can someone explain penalty areas in plain English?",
    category: "Beginner Questions",
    author: "Priya S.",
    avatar: "PS",
    time: "6 hrs ago",
    votes: 21,
    comments: 6,
    tags: ["rules", "penalty area"],
    body:
      "I know red and yellow stakes are different, but I get confused about where to drop and what options I have.",
    relatedLesson: "Basic Golf Rules and Etiquette",
    answered: true,
  },
  {
    id: "coach-fit",
    title: "How do I know if a coach is a good fit?",
    category: "Coach Q&A",
    author: "Ty W.",
    avatar: "TW",
    time: "7 hrs ago",
    votes: 16,
    comments: 4,
    tags: ["coaching", "lessons"],
    body:
      "I had one lesson that felt too technical. What questions should I ask before booking with a new coach?",
    relatedLesson: "How to Use a Coach Session",
  },
  {
    id: "range-plan",
    title: "My range sessions feel random. How should I structure 60 minutes?",
    category: "Practice Routines",
    author: "Grace H.",
    avatar: "GH",
    time: "Yesterday",
    votes: 37,
    comments: 12,
    tags: ["range", "practice plan"],
    body:
      "I usually hit driver until I am tired. I want a plan that actually improves scoring.",
    relatedLesson: "Practice Plans That Transfer",
    answered: true,
  },
];

const comments = [
  {
    author: "Coach Elena",
    body:
      "Start with ball flight and setup. If aiming left makes it worse, your path may be moving more left through impact.",
  },
  {
    author: "Caleb J.",
    body:
      "Film from behind the hands, not behind the ball. I realized my shoulders were open even when my feet looked square.",
  },
  {
    author: "Maya R.",
    body:
      "That makes sense. I do feel like I swing across it when I get nervous on tight holes.",
  },
  {
    author: "Anika S.",
    body:
      "The headcover gate helped me, but I had to do it slowly for a week before trying full speed.",
  },
  {
    author: "Coach Marcus",
    body:
      "Do not chase a draw immediately. First goal: predictable start line and less curve.",
  },
  {
    author: "Jon W.",
    body:
      "A lesson saved me months here. I was adjusting driver settings when the issue was grip and alignment.",
  },
];

const coaches: Coach[] = [
  {
    id: "elena",
    name: "Elena Brooks",
    location: "Austin, TX",
    specialties: ["Swing", "Beginner Friendly", "Junior Golf"],
    years: 12,
    level: "Beginner to high school varsity",
    bio:
      "Builds simple checkpoints for players who need structure without getting buried in mechanics.",
    rating: "4.9",
    philosophy:
      "Good coaching should translate the golf swing into one clear priority, then connect that priority to better shots on the course.",
    style: "Calm, visual, one-priority lessons",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "marcus",
    name: "Marcus Lee",
    location: "Irvine, CA",
    specialties: ["Swing", "Tournament Preparation", "Course Strategy"],
    years: 15,
    level: "Intermediate and competitive juniors",
    bio:
      "Focuses on ball flight, scoring plans, and tournament routines for school-match players.",
    rating: "4.8",
    philosophy:
      "Technical work matters most when it supports confident decisions under tournament pressure.",
    style: "Ball-flight diagnosis and scoring plans",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "nadia",
    name: "Nadia Chen",
    location: "Princeton, NJ",
    specialties: ["Putting", "Short Game", "Beginner Friendly"],
    years: 9,
    level: "Beginner to intermediate",
    bio:
      "Teaches putting pace, wedge distance ladders, and greenside decisions through small games.",
    rating: "4.9",
    philosophy:
      "Short-game improvement starts with predictable contact, smart shot selection, and feedback-rich practice.",
    style: "Games, ladders, and touch training",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "thomas",
    name: "Thomas Walker",
    location: "Charlotte, NC",
    specialties: ["Swing", "Equipment Basics", "Driving"],
    years: 18,
    level: "Intermediate players",
    bio:
      "Pairs launch-monitor ideas with plain-language setup work for players fighting driver inconsistency.",
    rating: "4.7",
    philosophy:
      "Data is useful only when the player understands what to do differently on the next swing.",
    style: "Tech-informed, not tech-heavy",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sofia",
    name: "Sofia Martinez",
    location: "Scottsdale, AZ",
    specialties: ["Junior Golf", "Mental Game", "Tournament Preparation"],
    years: 11,
    level: "Student golfers and juniors",
    bio:
      "Helps student golfers build practice habits, pre-shot routines, and calm competitive mindsets.",
    rating: "5.0",
    philosophy:
      "A young golfer improves fastest when practice goals, confidence, and course behavior all point in the same direction.",
    style: "Reflective, routine-based, student-first",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  },
];

const coachFilters = [
  "Swing",
  "Short Game",
  "Putting",
  "Course Strategy",
  "Junior Golf",
  "Tournament Preparation",
  "Beginner Friendly",
];

const forumCategories = [
  "All",
  "Swing Help",
  "Course Strategy",
  "Equipment Talk",
  "Tournament Experience",
  "Beginner Questions",
  "Coach Q&A",
  "Practice Routines",
  "Mental Game",
  "General Discussion",
];

const sourceGroups = [
  {
    group: "Rules and Governance",
    items: [
      ["USGA Rules Hub", "Official rules education", "Rules, etiquette, player conduct", "Source verified", "https://www.usga.org/rules-hub.html"],
      ["R&A Rules of Golf", "Official rules education", "Rules language and governance", "Source verified", "https://www.randa.org/rog/the-rules-of-golf"],
    ],
  },
  {
    group: "Teaching and Instruction",
    items: [
      ["PGA Coach", "Coach discovery / instruction", "Teaching language and lesson framing", "Source verified", "https://www.pga.com/coach"],
      ["Golf Digest Instruction", "Golf media instruction", "Swing, putting, short game concepts", "Source verified", "https://www.golfdigest.com/instruction"],
      ["GOLF.com Instruction", "Golf media instruction", "Public lesson ideas and drills", "Source verified", "https://golf.com/instruction/"],
    ],
  },
  {
    group: "Classic Golf Books",
    items: [
      ["Ben Hogan's Five Lessons", "Classic golf theory", "Grip, stance, posture, swing fundamentals", "Citation needed", "#"],
      ["Harvey Penick's Little Red Book", "Classic coaching notes", "Simple practice and feel-based ideas", "Citation needed", "#"],
    ],
  },
  {
    group: "Equipment and Data",
    items: [
      ["Independent equipment testing inspiration", "Equipment media", "Set makeup and beginner buying questions", "Verify before publishing", "#"],
      ["Launch monitor terminology", "Data language", "Face, path, start line, ball flight", "Verify before publishing", "#"],
    ],
  },
];

export default function GolferHubApp() {
  const [view, setView] = useState<View>("home");
  const [selectedArticle, setSelectedArticle] = useState("grip");
  const [selectedPost, setSelectedPost] = useState("slice-help");
  const [selectedCoach, setSelectedCoach] = useState("elena");
  const [articleQuery, setArticleQuery] = useState("");
  const [articleCategory, setArticleCategory] = useState("All");
  const [coachQuery, setCoachQuery] = useState("");
  const [coachFilter, setCoachFilter] = useState("All");
  const [forumCategory, setForumCategory] = useState("All");
  const [forumSort, setForumSort] = useState("Hot");
  const [voted, setVoted] = useState<Record<string, number>>({});

  const navTo = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openArticle = (id: string) => {
    setSelectedArticle(id);
    navTo("article");
  };

  const openPost = (id: string) => {
    setSelectedPost(id);
    navTo("post");
  };

  const openCoach = (id: string) => {
    setSelectedCoach(id);
    navTo("coach");
  };

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        articleCategory === "All" || article.category === articleCategory;
      const matchesQuery = `${article.title} ${article.summary} ${article.source} ${article.drill}`
        .toLowerCase()
        .includes(articleQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [articleCategory, articleQuery]);

  const filteredCoaches = useMemo(() => {
    return coaches.filter((coach) => {
      const matchesFilter =
        coachFilter === "All" || coach.specialties.includes(coachFilter);
      const matchesQuery = `${coach.name} ${coach.location} ${coach.bio} ${coach.specialties.join(" ")} ${coach.style}`
        .toLowerCase()
        .includes(coachQuery.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [coachFilter, coachQuery]);

  const filteredPosts = useMemo(() => {
    const byCategory = forumPosts.filter((post) => {
      if (forumCategory === "All") return true;
      return post.category === forumCategory;
    });
    if (forumSort === "New") return [...byCategory].reverse();
    if (forumSort === "Top") return [...byCategory].sort((a, b) => b.votes - a.votes);
    if (forumSort === "Unanswered") return byCategory.filter((post) => !post.answered);
    return byCategory;
  }, [forumCategory, forumSort]);

  const article = articleDetails[selectedArticle] ?? articleDetails.grip;
  const post = forumPosts.find((item) => item.id === selectedPost) ?? forumPosts[0];
  const coach = coaches.find((item) => item.id === selectedCoach) ?? coaches[0];

  return (
    <div className="site-shell">
      <Navbar view={view} onNav={navTo} />
      {view === "home" && (
        <HomePage
          onNav={navTo}
          openArticle={openArticle}
          openPost={openPost}
          openCoach={openCoach}
        />
      )}
      {view === "learn" && (
        <LearnPage
          query={articleQuery}
          setQuery={setArticleQuery}
          category={articleCategory}
          setCategory={setArticleCategory}
          filteredArticles={filteredArticles}
          openArticle={openArticle}
        />
      )}
      {view === "article" && (
        <ArticlePage article={article} openPost={openPost} openCoach={openCoach} />
      )}
      {view === "forum" && (
        <ForumPage
          category={forumCategory}
          setCategory={setForumCategory}
          sort={forumSort}
          setSort={setForumSort}
          posts={filteredPosts}
          voted={voted}
          setVoted={setVoted}
          openPost={openPost}
        />
      )}
      {view === "post" && (
        <PostPage
          post={post}
          voted={voted}
          setVoted={setVoted}
          openArticle={openArticle}
          openCoach={openCoach}
        />
      )}
      {view === "coaches" && (
        <CoachesPage
          query={coachQuery}
          setQuery={setCoachQuery}
          filter={coachFilter}
          setFilter={setCoachFilter}
          coaches={filteredCoaches}
          openCoach={openCoach}
        />
      )}
      {view === "coach" && <CoachProfile coach={coach} />}
      {view === "dashboard" && <DashboardPage openArticle={openArticle} openCoach={openCoach} />}
      {view === "sources" && <SourceLibrary />}
      {view === "about" && <AboutPage />}
      <Footer onNav={navTo} />
    </div>
  );
}

function Navbar({ view, onNav }: { view: View; onNav: (view: View) => void }) {
  const links: [View, string][] = [
    ["home", "Home"],
    ["learn", "Learn"],
    ["forum", "Forum"],
    ["coaches", "Coaches"],
    ["dashboard", "Dashboard"],
    ["sources", "Source Library"],
    ["about", "About"],
  ];

  return (
    <header className="navbar">
      <button className="brand" onClick={() => onNav("home")} aria-label="Golfer Hub home">
        <span className="brand-mark">GH</span>
        <span>
          <strong>Golfer Hub</strong>
          <small>Student-built golf system</small>
        </span>
      </button>
      <nav aria-label="Main navigation">
        {links.map(([target, label]) => (
          <button
            key={target}
            className={view === target ? "active" : ""}
            onClick={() => onNav(target)}
          >
            {label}
          </button>
        ))}
      </nav>
      <button className="join-button" onClick={() => onNav("dashboard")}>
        Join Golfer Hub
      </button>
    </header>
  );
}

function HomePage({
  onNav,
  openArticle,
  openPost,
  openCoach,
}: {
  onNav: (view: View) => void;
  openArticle: (id: string) => void;
  openPost: (id: string) => void;
  openCoach: (id: string) => void;
}) {
  return (
    <main>
      <section className="hero">
        <SwingPathGraphic variant="hero" />
        <div className="hero-yardage">
          <YardageNote label="150y" title="Approach" text="Turn scattered advice into a clear next shot." />
          <YardageNote label="Green Map" title="Learning System" text="Concept. Question. Drill. Coach note." />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Youth golf learning, rebuilt</p>
          <h1>Golf learning, rebuilt for the next generation.</h1>
          <p className="hero-text">
            Golfer Hub helps student golfers and everyday players learn from trusted
            resources, discuss real golf problems, and connect with coaching guidance.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => onNav("learn")}>Start Learning</button>
            <button className="secondary" onClick={() => onNav("forum")}>Explore Forum</button>
            <button className="secondary dark" onClick={() => onNav("coaches")}>Find Coaches</button>
          </div>
        </div>
        <TrainingCard />
      </section>

      <section className="wide-section start-section">
        <SectionHeader
          eyebrow="Choose your starting point"
          title="A cleaner way to learn, ask, and improve."
        />
        <div className="path-choice-grid">
          {[
            ["Learn the Game", "Build fundamentals with source-based lessons and practice drills.", ["Beginner", "Source Verified", "Practice Drill"], "learn"],
            ["Fix a Problem", "Start with a real miss, then follow the related lesson path.", ["Swing Help", "Video Support", "Forum Linked"], "learn"],
            ["Join a Discussion", "Turn a question into advice, examples, and a next practice task.", ["Community", "Coach Q&A", "Related Lesson"], "forum"],
          ].map(([title, text, tags, target]) => (
            <button className="start-card" key={title as string} onClick={() => onNav(target as View)}>
              <span className="yardage-index">0{title === "Learn the Game" ? "1" : title === "Fix a Problem" ? "2" : "3"}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <div className="tag-row">
                {(tags as string[]).map((tag) => <SkillTag key={tag}>{tag}</SkillTag>)}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="content-band">
        <SectionHeader eyebrow="Learning paths" title="Learn the concept. Watch the move. Try the drill." action="Open Learn" onClick={() => onNav("learn")} />
        <div className="path-grid">
          {learningPaths.map((path) => <LearningPathCard key={path.title} path={path} />)}
        </div>
      </section>

      <section className="split-section forum-home">
        <div>
          <SectionHeader eyebrow="From the forum" title="Golf questions become learning paths." />
          <div className="stack">
            {forumPosts.slice(0, 4).map((forumPost) => (
              <ForumPostCard
                key={forumPost.id}
                post={forumPost}
                voteOffset={0}
                onVote={() => undefined}
                onOpen={openPost}
              />
            ))}
          </div>
        </div>
        <aside className="coach-notes-panel">
          <SectionHeader eyebrow="Coach notes" title="Guidance, not a sales wall." />
          {coaches.slice(0, 3).map((coach) => (
            <button className="coach-note" key={coach.id} onClick={() => openCoach(coach.id)}>
              <span>{coach.name}</span>
              <strong>{coach.specialties[0]} · {coach.style}</strong>
            </button>
          ))}
        </aside>
      </section>

      <section className="founder-strip wide-section">
        <YardageNote label="Founder Note" title="Built by a student golfer" text="Golfer Hub started from a simple problem: golf advice is everywhere, but clear learning paths are hard to find." />
        <button onClick={() => onNav("about")}>Read the story</button>
      </section>
    </main>
  );
}

function LearnPage({
  query,
  setQuery,
  category,
  setCategory,
  filteredArticles,
  openArticle,
}: {
  query: string;
  setQuery: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  filteredArticles: Article[];
  openArticle: (id: string) => void;
}) {
  return (
    <main className="page-wrap">
      <PageHero
        eyebrow="Knowledge Hub"
        title="A real learning product, not a plain blog list."
        text="Every topic connects the concept, video support, practice drill, source basis, and related forum questions."
      />
      <div className="toolbar">
        <input
          aria-label="Search learning articles"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search lesson, drill, source, or problem"
        />
        <select aria-label="Filter learning category" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option>All</option>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="learning-path-strip">
        {learningPaths.map((path) => <LearningPathCard key={path.title} path={path} compact />)}
      </div>
      <div className="learning-layout">
        <aside className="sidebar yardage-sidebar">
          <h3>Course notebook</h3>
          <button className={category === "All" ? "selected" : ""} onClick={() => setCategory("All")}>All Topics</button>
          {categories.map((item) => (
            <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </aside>
        <section>
          <div className="card-grid two">
            {filteredArticles.map((article) => (
              <LessonCard key={article.id} article={article} onOpen={openArticle} />
            ))}
          </div>
          <SectionHeader eyebrow="Video support" title="Recommended viewing lanes" />
          <div className="video-grid">
            {videoLessons.map((video) => <VideoLessonCard key={video.title} video={video} />)}
          </div>
        </section>
      </div>
      <section className="source-note">
        <h3>Honest source handling</h3>
        <p>
          Golfer Hub uses source-basis labels and video-support placeholders instead of fake
          citations. Any public launch should verify exact videos, quotes, and organization
          references directly.
        </p>
      </section>
    </main>
  );
}

function ArticlePage({
  article,
  openPost,
  openCoach,
}: {
  article: ArticleDetail;
  openPost: (id: string) => void;
  openCoach: (id: string) => void;
}) {
  return (
    <main className="page-wrap article-page">
      <div className="detail-header lesson-cover">
        <SwingPathGraphic />
        <p className="eyebrow">{article.category}</p>
        <h1>{article.title}</h1>
        <div className="meta-row">
          <SkillTag>{article.level}</SkillTag>
          <SkillTag>{article.readTime}</SkillTag>
          <SkillTag>Video Support</SkillTag>
          <SkillTag>Practice Drill</SkillTag>
        </div>
      </div>
      <article className="lesson-body">
        <VideoSupport article={article} />
        <h2>Main objective</h2>
        <p>{article.objective}</p>
        <h2>Key concept</h2>
        <p>{article.keyConcept}</p>
        <VisualLessonBlock article={article} />
        <h2>Step-by-step learning</h2>
        <ol>
          {article.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <h2>Common mistakes</h2>
        <ul>
          {article.mistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}
        </ul>
        <h2>Practice drill</h2>
        <p>{article.drill}</p>
        <h2>When to use it on the course</h2>
        <p>{article.courseUse}</p>
        <h2>Source basis / further reading</h2>
        <ul>
          {article.citations.map((citation) => <li key={citation}>{citation}</li>)}
        </ul>
      </article>
      <aside className="related-panel">
        <YardageNote label="Related Thread" title="Community question" text={article.relatedQuestion} />
        <button onClick={() => openPost(article.id === "driver-slice" ? "slice-help" : "range-plan")}>
          Open related discussion
        </button>
        <YardageNote label="Coach Match" title="Suggested guidance" text={article.id === "driver-slice" ? "Thomas Walker · driver consistency" : "Elena Brooks · beginner fundamentals"} />
        <button onClick={() => openCoach(article.id === "driver-slice" ? "thomas" : "elena")}>
          View coach
        </button>
      </aside>
    </main>
  );
}

function ForumPage({
  category,
  setCategory,
  sort,
  setSort,
  posts,
  voted,
  setVoted,
  openPost,
}: {
  category: string;
  setCategory: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  posts: ForumPost[];
  voted: Record<string, number>;
  setVoted: (value: Record<string, number>) => void;
  openPost: (id: string) => void;
}) {
  const [draftTitle, setDraftTitle] = useState("");

  const createPost = (event: FormEvent) => {
    event.preventDefault();
    setDraftTitle("");
  };

  return (
    <main className="page-wrap">
      <PageHero
        eyebrow="Forum"
        title="Your golf questions deserve better answers."
        text="The forum is built around questions that turn into related lessons, drills, and coaching guidance."
      />
      <div className="forum-layout">
        <aside className="sidebar forum-sidebar">
          <h3>Discussion lanes</h3>
          {forumCategories.map((item) => (
            <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </aside>
        <section>
          <div className="forum-controls">
            <div className="segmented" role="group" aria-label="Forum sort">
              {["Hot", "New", "Top", "Unanswered"].map((item) => (
                <button key={item} className={sort === item ? "selected" : ""} onClick={() => setSort(item)}>
                  {item}
                </button>
              ))}
            </div>
            <button className="primary small">Create Post</button>
          </div>
          <form className="create-post" onSubmit={createPost}>
            <input
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              placeholder="Ask about your swing, practice, rules, mindset, or tournament prep"
              aria-label="Create post title"
            />
            <button type="submit">Post Draft</button>
          </form>
          <div className="stack">
            {posts.map((forumPost) => (
              <ForumPostCard
                key={forumPost.id}
                post={forumPost}
                voteOffset={voted[forumPost.id] ?? 0}
                onVote={(delta) => setVoted({ ...voted, [forumPost.id]: delta })}
                onOpen={openPost}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function PostPage({
  post,
  voted,
  setVoted,
  openArticle,
  openCoach,
}: {
  post: ForumPost;
  voted: Record<string, number>;
  setVoted: (value: Record<string, number>) => void;
  openArticle: (id: string) => void;
  openCoach: (id: string) => void;
}) {
  const vote = voted[post.id] ?? 0;
  return (
    <main className="page-wrap post-detail">
      <section className="post-main">
        <div className="post-votes">
          <button onClick={() => setVoted({ ...voted, [post.id]: 1 })} aria-label="Upvote post">▲</button>
          <strong>{post.votes + vote}</strong>
          <button onClick={() => setVoted({ ...voted, [post.id]: -1 })} aria-label="Downvote post">▼</button>
        </div>
        <article className="post-content">
          <div className="author-row">
            <span className="avatar">{post.avatar}</span>
            <span>{post.author}</span>
            <SkillTag>{post.category}</SkillTag>
            <small>{post.time}</small>
          </div>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
          <div className="tag-row">
            {post.tags.map((tag) => <SkillTag key={tag}>{tag}</SkillTag>)}
          </div>
          <div className="related-lesson-chip">Related Lesson: {post.relatedLesson}</div>
        </article>
      </section>
      <section className="comments">
        <h2>{comments.length} comments</h2>
        {comments.map((comment) => (
          <article key={`${comment.author}-${comment.body}`} className="comment">
            <strong>{comment.author}</strong>
            <p>{comment.body}</p>
          </article>
        ))}
        <form className="reply-box" onSubmit={(event) => event.preventDefault()}>
          <textarea aria-label="Reply to discussion" placeholder="Share a helpful answer or ask a clarifying question" />
          <button className="primary">Reply</button>
        </form>
      </section>
      <aside className="related-panel">
        <YardageNote label="Learning route" title={post.relatedLesson} text="Open the connected guide, then return with a practice update." />
        <button onClick={() => openArticle(post.id === "slice-help" ? "driver-slice" : "course-management")}>
          Open lesson
        </button>
        <YardageNote label="Coach note" title="Suggested coach" text={post.id === "slice-help" ? "Thomas Walker · driver consistency" : "Marcus Lee · tournament strategy"} />
        <button onClick={() => openCoach(post.id === "slice-help" ? "thomas" : "marcus")}>
          View coach
        </button>
      </aside>
    </main>
  );
}

function CoachesPage({
  query,
  setQuery,
  filter,
  setFilter,
  coaches: coachList,
  openCoach,
}: {
  query: string;
  setQuery: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  coaches: Coach[];
  openCoach: (id: string) => void;
}) {
  return (
    <main className="page-wrap">
      <PageHero
        eyebrow="Coach Connection"
        title="Future-facing guidance, without making coaching the whole product."
        text="Compare teaching style, student level, specialties, and session focus in a clean discovery prototype."
      />
      <div className="toolbar">
        <input
          aria-label="Search coaches"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, style, location, or skill"
        />
        <select aria-label="Filter coach specialty" value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option>All</option>
          {coachFilters.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="chip-row">
        {["All", ...coachFilters].map((item) => (
          <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>{item}</button>
        ))}
      </div>
      <section className="card-grid two">
        {coachList.map((coach) => <CoachCard key={coach.id} coach={coach} onOpen={openCoach} />)}
      </section>
    </main>
  );
}

function CoachProfile({ coach }: { coach: Coach }) {
  return (
    <main className="page-wrap">
      <section className="coach-profile">
        <img src={coach.image} alt={`${coach.name} portrait`} />
        <div>
          <p className="eyebrow">Coach Profile</p>
          <h1>{coach.name}</h1>
          <p>{coach.location}</p>
          <div className="tag-row">
            {coach.specialties.map((specialty) => <SkillTag key={specialty}>{specialty}</SkillTag>)}
          </div>
          <p className="profile-copy">{coach.philosophy}</p>
          <div className="stats-grid">
            <span><strong>{coach.years}</strong> years experience</span>
            <span><strong>{coach.rating}</strong> rating</span>
            <span><strong>{coach.level}</strong></span>
          </div>
        </div>
      </section>
      <section className="split-section">
        <div className="lesson-body compact-body">
          <h2>Teaching style</h2>
          <p>{coach.style}</p>
          <h2>Example lesson topics</h2>
          <ul>
            <li>Pre-shot routine and pressure practice</li>
            <li>One-swing priority for the next two weeks</li>
            <li>Short-game distance ladder or driver start-line plan</li>
            <li>Course strategy for school matches and qualifying rounds</li>
          </ul>
          <h2>Student reviews</h2>
          <p>"Explained my slice in plain English and gave me a practice plan I could actually follow."</p>
          <p>"The lesson notes were simple, and the drills connected directly to my next tournament."</p>
        </div>
        <form className="request-form" onSubmit={(event) => event.preventDefault()}>
          <h2>Request a session</h2>
          <label>
            Name
            <input placeholder="Your name" />
          </label>
          <label>
            Goal
            <select>
              <option>Fix driver slice</option>
              <option>Improve putting</option>
              <option>Prepare for tournament</option>
              <option>Build beginner fundamentals</option>
            </select>
          </label>
          <label>
            Availability
            <input placeholder="Weekdays after school, weekends, etc." />
          </label>
          <button className="primary">Send Request</button>
          <p className="fine-print">Prototype only. No payment or real booking is processed.</p>
        </form>
      </section>
    </main>
  );
}

function DashboardPage({ openArticle, openCoach }: { openArticle: (id: string) => void; openCoach: (id: string) => void }) {
  return (
    <main className="page-wrap">
      <PageHero
        eyebrow="Player cockpit"
        title="Your current path: Beginner Ball Striking."
        text="A lightweight student golfer dashboard for saved lessons, practice goals, forum activity, coaches, and the next session focus."
      />
      <section className="dashboard-top">
        <ProgressCard title="Path progress" value={42} label="Beginner Ball Striking" />
        <ProgressCard title="Practice streak" value={71} label="5 of 7 days logged" />
        <ProgressCard title="Problem this week" value={28} label="Driver start line" />
      </section>
      <section className="dashboard-grid">
        <DashboardWidget title="Saved lessons">
          <button onClick={() => openArticle("grip")}>Reliable Golf Grip</button>
          <button onClick={() => openArticle("driver-slice")}>Stop Slicing the Driver</button>
          <button onClick={() => openArticle("putting-distance")}>Putting Distance Control</button>
        </DashboardWidget>
        <DashboardWidget title="Next session focus">
          <p>Warm up with wedge contact, then spend 20 minutes on driver start line using the headcover gate.</p>
          <SkillTag>Clubface & Swing Path</SkillTag>
        </DashboardWidget>
        <DashboardWidget title="Weekly checklist">
          {["Grip checkpoint", "Putting ladder", "Nine-hole strategy notes", "Rules review"].map((item, index) => (
            <label key={item} className="check-row">
              <input type="checkbox" defaultChecked={index < 2} /> {item}
            </label>
          ))}
        </DashboardWidget>
        <DashboardWidget title="Forum activity">
          <p>Asked: Why do I keep slicing my driver?</p>
          <p>Commented: How should I structure 60 minutes?</p>
        </DashboardWidget>
        <DashboardWidget title="Saved coaches">
          <button onClick={() => openCoach("elena")}>Elena Brooks</button>
          <button onClick={() => openCoach("thomas")}>Thomas Walker</button>
        </DashboardWidget>
        <DashboardWidget title="Suggested next lesson">
          <p>Clubface and Swing Path: Why the Ball Curves</p>
          <button onClick={() => openArticle("clubface-path")}>Open guide</button>
        </DashboardWidget>
      </section>
    </main>
  );
}

function SourceLibrary() {
  return (
    <main className="page-wrap">
      <PageHero
        eyebrow="Source Library"
        title="A curated research wall for the learning system."
        text="Golfer Hub shows what each source helps with and marks whether it is verified, needs citation, or needs extra checking before public use."
      />
      <section className="source-board">
        {sourceGroups.map((group) => (
          <article key={group.group} className="source-column">
            <h2>{group.group}</h2>
            {group.items.map(([name, type, helps, status, link]) => (
              <div className="source-card" key={name}>
                <div>
                  <strong>{name}</strong>
                  <span>{type}</span>
                </div>
                <p>{helps}</p>
                <SkillTag>{status}</SkillTag>
                {link !== "#" && <a href={link} target="_blank" rel="noreferrer">Open source</a>}
              </div>
            ))}
          </article>
        ))}
      </section>
      <section className="source-note">
        <h3>Independence disclaimer</h3>
        <p>
          Golfer Hub is an independent educational project and is not officially affiliated
          with USGA, PGA, Golf Digest, GOLF.com, R&A, Trackman, MyGolfSpy, or any listed
          source unless an official partnership is stated.
        </p>
      </section>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="page-wrap">
      <PageHero
        eyebrow="Founder story"
        title="Built by a young golfer who wanted structure, not noise."
        text="Golfer Hub is personal, reflective, and practical: a student-built project for golfers who want clearer learning paths and better questions."
      />
      <section className="about-story">
        <article>
          <h2>Why I built this</h2>
          <p>
            I noticed that golf advice is everywhere, but it often arrives as isolated tips.
            A beginner can watch five videos, ask three people for help, and still not know
            what to practice next.
          </p>
          <p>
            Golfer Hub turns that scattered advice into a system: learn the concept, ask the
            community, try a drill, and connect with coaching guidance when self-practice is not enough.
          </p>
        </article>
        <article>
          <h2>The problem I noticed</h2>
          <p>
            Student golfers need trustworthy fundamentals, a place to ask specific questions,
            and a way to understand when coaching could help. Those pieces usually live in
            separate places.
          </p>
          <h2>Future vision</h2>
          <p>
            Future versions could include verified coach accounts, team pages, practice-plan
            builders, saved swing notes, and optional video analysis tools.
          </p>
        </article>
      </section>
      <section className="founder-note">
        <h2>Founder note</h2>
        <p>
          "I built Golfer Hub because learning golf should feel challenging, not confusing.
          My goal is to help players ask better questions, practice with purpose, and feel
          less lost between lessons."
        </p>
      </section>
    </main>
  );
}

function TrainingCard() {
  return (
    <aside className="training-card" aria-label="Golfer Hub learning system preview">
      <div className="training-head">
        <span>Learning System</span>
        <SkillTag>Live Prototype</SkillTag>
      </div>
      {[
        ["Current Path", "Beginner Ball Striking"],
        ["Next Lesson", "Clubface & Swing Path"],
        ["Community", "10 live discussion prompts"],
        ["Source Library", "USGA / PGA / classic golf texts"],
      ].map(([label, value]) => (
        <div className="training-row" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </aside>
  );
}

function LearningPathCard({
  path,
  compact = false,
}: {
  path: typeof learningPaths[number];
  compact?: boolean;
}) {
  return (
    <article className={`learning-path-card ${compact ? "compact" : ""}`}>
      <div className="yardage-index">{path.lessons}L</div>
      <h3>{path.title}</h3>
      <p>{path.note}</p>
      <div className="progress-line" aria-label={`${path.progress}% complete`}>
        <span style={{ width: `${path.progress}%` }} />
      </div>
      <div className="tag-row">
        <SkillTag>{path.level}</SkillTag>
        {path.tags.map((tag) => <SkillTag key={tag}>{tag}</SkillTag>)}
      </div>
    </article>
  );
}

function LessonCard({ article, onOpen }: { article: Article; onOpen: (id: string) => void }) {
  return (
    <article className="lesson-card">
      <div className="lesson-thumb">
        <span>{article.category}</span>
        <SwingPathGraphic />
      </div>
      <div className="card-topline">
        <SkillTag>{article.level}</SkillTag>
        <span>{article.readTime}</span>
      </div>
      <h3>{article.title}</h3>
      <p>{article.summary}</p>
      <div className="lesson-meta-grid">
        <YardageMini label="Video" value={article.video} />
        <YardageMini label="Drill" value={article.drill} />
        <YardageMini label="Forum" value={article.relatedQuestion} />
      </div>
      <div className="source-basis">{article.source}</div>
      <div className="card-actions">
        <button onClick={() => onOpen(article.id)}>Open lesson</button>
        <button className={article.saved ? "saved" : ""}>{article.saved ? "Saved" : "Save"}</button>
      </div>
    </article>
  );
}

function VideoLessonCard({ video }: { video: typeof videoLessons[number] }) {
  return (
    <article className="video-card">
      <div className="video-thumb">
        <span className="play-dot">Play</span>
        <span>{video.topic}</span>
      </div>
      <h3>{video.title}</h3>
      <p>{video.source}</p>
      <SkillTag>{video.status}</SkillTag>
      <a href={video.link} target="_blank" rel="noreferrer">Open external source</a>
    </article>
  );
}

function VideoSupport({ article }: { article: ArticleDetail }) {
  return (
    <section className="video-support">
      <div className="video-thumb large">
        <span className="play-dot">Video</span>
        <span>{article.video}</span>
      </div>
      <div>
        <h2>Video support</h2>
        <p>
          This lesson is designed to pair with a credible public instruction video.
          The exact video should be verified before public launch; no partnership or endorsement is claimed.
        </p>
        <SkillTag>{article.video}</SkillTag>
      </div>
    </section>
  );
}

function VisualLessonBlock({ article }: { article: ArticleDetail }) {
  return (
    <section className="visual-lesson">
      <div className="diagram-card">
        <SwingPathGraphic />
        <h3>{article.visualTitle}</h3>
        <div className="diagram-grid">
          {article.visualNotes.map((note, index) => (
            <span key={note}>{index + 1}. {note}</span>
          ))}
        </div>
      </div>
      <YardageNote label="Visual explanation" title="Diagram placeholder" text="This area is intentionally designed for future swing-path, ball-flight, grip, or putting-ladder visuals." />
    </section>
  );
}

function ForumPostCard({
  post,
  voteOffset,
  onVote,
  onOpen,
}: {
  post: ForumPost;
  voteOffset: number;
  onVote: (delta: number) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <article className="forum-card">
      <div className="vote-column">
        <button onClick={() => onVote(1)} aria-label={`Upvote ${post.title}`}>▲</button>
        <strong>{post.votes + voteOffset}</strong>
        <button onClick={() => onVote(-1)} aria-label={`Downvote ${post.title}`}>▼</button>
      </div>
      <div className="forum-card-body">
        <div className="author-row">
          <span className="avatar">{post.avatar}</span>
          <span>{post.author}</span>
          <small>{post.time}</small>
          <SkillTag>{post.category}</SkillTag>
        </div>
        <button className="title-button" onClick={() => onOpen(post.id)}>{post.title}</button>
        <p>{post.body}</p>
        <div className="forum-meta">
          <span>{post.comments} comments</span>
          {post.tags.map((tag) => <SkillTag key={tag}>{tag}</SkillTag>)}
        </div>
        <div className="related-lesson-chip">Related Lesson: {post.relatedLesson}</div>
      </div>
    </article>
  );
}

function CoachCard({ coach, onOpen }: { coach: Coach; onOpen: (id: string) => void }) {
  return (
    <article className="coach-card">
      <img src={coach.image} alt={`${coach.name} coach portrait`} />
      <div>
        <div className="coach-card-head">
          <h3>{coach.name}</h3>
          <SkillTag>{coach.rating} rating</SkillTag>
        </div>
        <p>{coach.location} · {coach.level}</p>
        <p>{coach.bio}</p>
        <YardageMini label="Teaching style" value={coach.style} />
        <div className="tag-row">
          {coach.specialties.map((specialty) => <SkillTag key={specialty}>{specialty}</SkillTag>)}
        </div>
        <div className="card-actions">
          <button onClick={() => onOpen(coach.id)}>View Profile</button>
          <button>Request Session</button>
        </div>
      </div>
    </article>
  );
}

function DashboardWidget({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="dashboard-widget">
      <h3>{title}</h3>
      <div className="widget-content">{children}</div>
    </article>
  );
}

function ProgressCard({ title, value, label }: { title: string; value: number; label: string }) {
  return (
    <article className="progress-card">
      <span>{title}</span>
      <strong>{label}</strong>
      <div className="progress-line">
        <span style={{ width: `${value}%` }} />
      </div>
      <small>{value}% signal</small>
    </article>
  );
}

function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="page-hero">
      <SwingPathGraphic />
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  action,
  onClick,
}: {
  eyebrow: string;
  title: string;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <div className="section-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action && <button onClick={onClick}>{action}</button>}
    </div>
  );
}

function SkillTag({ children }: { children: ReactNode }) {
  return <span className="skill-tag">{children}</span>;
}

function YardageNote({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <div className="yardage-note">
      <span>{label}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

function YardageMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="yardage-mini">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SwingPathGraphic({ variant }: { variant?: "hero" }) {
  return (
    <div className={`swing-path ${variant === "hero" ? "hero-swing" : ""}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function Footer({ onNav }: { onNav: (view: View) => void }) {
  return (
    <footer className="footer">
      <div>
        <strong>Golfer Hub</strong>
        <p>Student-built golf learning system: structured lessons, real questions, future coach connection.</p>
      </div>
      <div className="footer-links">
        <button onClick={() => onNav("learn")}>Learn</button>
        <button onClick={() => onNav("forum")}>Forum</button>
        <button onClick={() => onNav("coaches")}>Coaches</button>
        <button onClick={() => onNav("sources")}>Sources</button>
      </div>
    </footer>
  );
}
