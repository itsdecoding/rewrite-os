export interface ContentCard {
  id: string;
  title: string;
  type: string; // 'IG Carousel' | 'IG Reel · Standard' | 'IG B-roll · Trial' | 'LinkedIn' | 'X / Twitter' | 'YouTube Long'
  status: string; // 'Idea' | 'Scripting' | 'Filming (Approved)' | 'In Editing' | 'For Review' | 'Requires Revision' | 'Approved' | 'Posted' | 'Dismissed'
  category?: string; // 'AI News' | 'Sales/Conversion' | etc.
  priority?: string; // 'Low' | 'Medium' | 'High'
  assignee?: string; // e.g. 'B'
  slidesCount?: number;
  slideCopy?: string;
  caption?: string;
  hashtags?: string;
  briefUrl?: string;
  finalFilesUrl?: string;
  coverImageUrl?: string;
  supportingAssetsUrl?: string;
  postedUrl?: string;
  owner?: string;
  pm?: string;
  designer?: string;
  writer?: string;
  dueDate?: string;
  postedAt?: string;
  tags?: string;
  activityLog?: { text: string; time: string }[];
}

export const INITIAL_CARDS: ContentCard[] = [
  {
    id: "rm-idea-1",
    title: "The Illusion of Multitasking: Why Context Switching Destroys Dopamine Baselines",
    type: "IG Reel · Standard",
    status: "Idea",
    category: "Cognitive Science",
    priority: "High",
    assignee: "M",
    caption: "Every time you switch between tasks, your brain pays a switching cost. Here is how to protect your cognitive bandwidth.",
    hashtags: "#RewriteMinds #DeepWork #Focus #MentalModels",
    writer: "Muzammil",
  },
  {
    id: "rm-idea-2",
    title: "Stoic Dichotomy of Control: 4 Daily Mental Filters to Eliminate Anxiety",
    type: "IG Carousel",
    status: "Idea",
    category: "Applied Philosophy",
    priority: "Medium",
    slidesCount: 8,
    slideCopy: "Slide 1: What is actually in your control vs out of it.\nSlide 2: Epictetus rule of reaction.",
    caption: "Stop leaking emotional energy into things you can never change.",
    hashtags: "#Stoicism #MentalClarity #Philosophy",
    writer: "Muzammil",
  },
  {
    id: "rm-script-1",
    title: "The 20-Second Activation Rule: How Friction Dictates Every Habit You Have",
    type: "IG Reel · Standard",
    status: "Scripting",
    category: "Behavioral Change",
    priority: "High",
    assignee: "M",
    caption: "Make bad habits take 20 seconds longer. Make good habits 20 seconds easier.",
    hashtags: "#Habits #AtomicHabits #Discipline",
    writer: "Muzammil",
  },
  {
    id: "rm-script-2",
    title: "Parkinson's Law: How Tight Deadlines Force Cognitive Clarity",
    type: "LinkedIn",
    status: "Scripting",
    category: "Productivity",
    priority: "Medium",
    caption: "Work expands to fill the time available for its completion. Shrink the container.",
    hashtags: "#Productivity #Execution #Mindset",
    writer: "Muzammil",
  },
  {
    id: "rm-film-1",
    title: "Dopamine Detox Fallacy: What Neuroscience Actually Says About Boredom",
    type: "IG Reel · Standard",
    status: "Filming (Approved)",
    category: "Neuroscience",
    priority: "High",
    assignee: "M",
    caption: "You cannot eliminate dopamine—nor should you. You need to reset your sensitivity.",
    hashtags: "#Neuroscience #Focus #Mindset",
    writer: "Muzammil",
  },
  {
    id: "rm-edit-1",
    title: "Why Modern Work Environments Prevent Peak Flow States",
    type: "IG B-roll · Trial",
    status: "In Editing",
    category: "Deep Work",
    priority: "Medium",
    assignee: "AI",
    caption: "Silent ambient study flow breakdown.",
    hashtags: "#FlowState #DeepWork #Study",
    writer: "Muzammil",
  },
  {
    id: "rm-review-1",
    title: "How to Build an Unbreakable Morning Routine Without Burning Out",
    type: "IG Reel · Standard",
    status: "For Review",
    category: "Daily Routine",
    priority: "High",
    assignee: "M",
    caption: "Cut the 14-step morning routines. Stick to these 3 core fundamentals.",
    hashtags: "#MorningRoutine #Discipline #Habits",
    writer: "Muzammil",
  },
  {
    id: "rm-rev-1",
    title: "5 Mental Models Elite Thinkers Use to Solve Hard Problems",
    type: "IG Carousel",
    status: "Requires Revision",
    category: "Mental Models",
    priority: "Medium",
    slidesCount: 7,
    caption: "First Principles, Inversion, Second-Order Thinking, Occam's Razor, Regret Minimization.",
    hashtags: "#MentalModels #CriticalThinking",
    writer: "Muzammil",
  },
  {
    id: "rm-app-1",
    title: "The Compounding Effect of 1% Daily Identity Shifts",
    type: "IG Reel · Standard",
    status: "Approved",
    category: "Identity",
    priority: "High",
    assignee: "M",
    caption: "True behavior change is identity change. When you change who you are, what you do follows.",
    hashtags: "#Identity #SelfMastery",
    writer: "Muzammil",
  },
  {
    id: "rm-post-1",
    title: "Why Willpower Is an Overrated Resource for Habit Formation",
    type: "X / Twitter",
    status: "Posted",
    category: "Psychology",
    priority: "Medium",
    caption: "Willpower depletes. Systems and environments persist. Build the moat, don't rely on willpower.",
    hashtags: "#Habits #Discipline #Systems",
    writer: "Muzammil",
  }
];

export const CONTENT_TYPE_STATS = [
  { name: "IG Reel · Standard", count: 100, max: 100 },
  { name: "IG B-roll · Trial", count: 21, max: 100 },
  { name: "IG Carousel", count: 73, max: 100 },
  { name: "LinkedIn", count: 45, max: 100 },
  { name: "X / Twitter", count: 12, max: 100 },
  { name: "YouTube Long", count: 11, max: 100 },
];

export const STATUS_STATS = [
  { name: "Idea", count: 15, colorDot: "#9CA3AF", pillBg: "#F3F4F6", pillText: "#4B5563" },
  { name: "Scripting", count: 22, colorDot: "#60A5FA", pillBg: "#EFF6FF", pillText: "#1D4ED8" },
  { name: "Filming (Approved)", count: 3, colorDot: "#F472B6", pillBg: "#FDF2F8", pillText: "#BE185D" },
  { name: "In Editing", count: 18, colorDot: "#FF5A1F", pillBg: "#FFF3EC", pillText: "#D9531E" },
  { name: "For Review", count: 7, colorDot: "#F59E0B", pillBg: "#FEF9EE", pillText: "#B47D14" },
  { name: "Requires Revision", count: 11, colorDot: "#EF4444", pillBg: "#FEECEC", pillText: "#DC2626" },
  { name: "Approved", count: 1, colorDot: "#10B981", pillBg: "#EEF9F1", pillText: "#1E8E3E" },
  { name: "Posted", count: 169, colorDot: "#059669", pillBg: "#ECFDF5", pillText: "#047857" },
];

export const COLUMNS = [
  { id: "Idea", title: "Idea", colorDot: "#6B7280" },
  { id: "Scripting", title: "Scripting", colorDot: "#6B7280" },
  { id: "Filming (Approved)", title: "Filming (Approved)", colorDot: "#6B7280" },
  { id: "In Editing", title: "In Editing", colorDot: "#FF5A1F", isOrange: true },
  { id: "For Review", title: "For Review", colorDot: "#B47D14", isYellow: true },
  { id: "Requires Revision", title: "Requires Revision", colorDot: "#DC2626", isRed: true },
  { id: "Approved", title: "Approved", colorDot: "#10B981", isGreen: true },
  { id: "Posted", title: "Posted", colorDot: "#059669", isMint: true },
];
