export type PostType = 'PROBLEM' | 'SOLUTION';
export type PostStatus = 'OPEN' | 'SOLVED' | 'CLOSED';

export interface MockPost {
  id: string;
  type: PostType;
  status: PostStatus;
  title: string;
  description: string;
  category: { name: string; color: string };
  author: {
    name: string;
    avatar: string;
    verified?: boolean;
    reputationPoints?: number;
    reputationLevel?: string;
    avatarUrl: string
  };
  thumbnail: string;
  likesCount: number;
  commentsCount: number;
  isTrending: boolean;
  isHidden?: boolean;
  createdAt: string;
  lastComment?: { authorName: string; content: string; authorAvatar: string };
}

export const categories = [
  { id: '1', name: 'Tech & Electronics', icon: '💻', color: '#3B82F6' },
  { id: '2', name: 'Automotive', icon: '🚗', color: '#F59E0B' },
  { id: '3', name: 'Home Repair', icon: '🔧', color: '#22C55E' },
  { id: '4', name: 'Gardening', icon: '🌱', color: '#84CC16' },
];

export const trendingPosts: MockPost[] = [
  {
    id: 'p1',
    type: 'PROBLEM',
    status: 'OPEN',
    title: 'Complex Motherboard Failure: Diagnostic & Pin Restoration',
    description:
      'Detailed walkthrough of a multi-stage failure, including pin-level repair to restore boot function.',
    category: { name: 'Tech & Electronics', color: '#3B82F6' },
    author: { name: 'Alex Stuart', avatar: 'AS', verified: true },
    thumbnail: 'motherboard',
    commentsCount: 42,
    likesCount: 128,
    isTrending: true,
    createdAt: '2h ago',
  },
  {
    id: 'p2',
    type: 'PROBLEM',
    status: 'OPEN',
    title: 'Strange Rattling Sound from Turbocharger',
    description: 'Hear this clip — rattling noise increasing with RPM. Worried about turbo bearing failure.',
    category: { name: 'Automotive', color: '#F59E0B' },
    author: { name: 'Diego R.', avatar: 'DR' },
    thumbnail: 'car-engine',
    commentsCount: 31,
    likesCount: 89,
    isTrending: true,
    createdAt: '5h ago',
  },
  {
    id: 'p3',
    type: 'PROBLEM',
    status: 'OPEN',
    title: 'Dishwasher Discharge Clog Fix',
    description: 'Standing water at the bottom of the dishwasher after every cycle. Need step-by-step fix.',
    category: { name: 'Home Repair', color: '#22C55E' },
    author: { name: 'Marie L.', avatar: 'ML' },
    thumbnail: 'dishwasher',
    commentsCount: 18,
    likesCount: 54,
    createdAt: '1d ago',
  },
];

export const recentSolutions: MockPost[] = [
  {
    id: 's1',
    type: 'SOLUTION',
    status: 'SOLVED',
    title: 'Smart Home Bridge: Connectivity Drop Fix',
    description: 'Our AI is investigating the bridge logs to find the root cause of intermittent device drops.',
    category: { name: 'Tech & Electronics', color: '#3B82F6' },
    author: { name: 'AI ANALYSIS', avatar: '🤖', verified: true },
    thumbnail: 'smart-home',
    commentsCount: 7,
    likesCount: 22,
    createdAt: '3h ago',
  },
];

export const solvedLibraryStats = {
  totalSolved: 124802,
  expertsVerified: 8431,
  successRate: '94.2%',
  activeProblems: 156,
};

export const leaderboard = [
  { id: 'u1', name: 'Marcus Sutton', points: 15280, rank: 1 },
  { id: 'u2', name: 'DevsHope', points: 14102, rank: 2 },
  { id: 'u3', name: 'WrenchFix', points: 12550, rank: 3 },
];
