import { ApiPost } from '../api/posts';
import { MockPost } from '../data/mockData';
import { formatRelativeTime } from './formatRelativeTime';

const CATEGORY_COLORS: Record<string, string> = {
  technology: '#3B82F6',
  cars: '#F59E0B',
  'home-repair': '#22C55E',
  electrical: '#EAB308',
  gardening: '#84CC16',
  appliances: '#06B6D4',
};

export function adaptApiPost(post: ApiPost): MockPost {
  return {
    id: post.id,
    type: post.type,
    status: post.status,
    title: post.title,
    description: post.description,
    category: {
      name: post.category.name,
      color: CATEGORY_COLORS[post.category.slug] ?? '#6C5CE7',
    },
    author: {
      name: post.author.name,
      avatar: post.author.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      verified: post.author.reputationPoints > 5000,
    },
    thumbnail: post.attachments[0]?.url ?? post.id,
    commentsCount: post._count?.comments ?? post.commentsCount,
    likesCount: post._count?.likes ?? post.likesCount,
    isTrending: post.isTrending,
    createdAt: formatRelativeTime(post.createdAt),
  };
}
