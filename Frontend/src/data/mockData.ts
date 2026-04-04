import type { Post, User } from '../types';

export const currentUser: User = {
  id: 'u1',
  name: 'Alex Johnson',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
};

export const friendsOnline: User[] = [
  { id: 'f1', name: 'Mike P.', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', isOnline: true },
  { id: 'f2', name: 'Emily R.', avatarUrl: 'https://i.pravatar.cc/150?u=a04258114e29026702d', isOnline: true },
  { id: 'f3', name: 'Liaren R.', avatarUrl: 'https://i.pravatar.cc/150?u=a048581f4e29026701d', isOnline: true },
  { id: 'f4', name: 'Sarah J.', avatarUrl: 'https://i.pravatar.cc/150?u=a04258a2462d826712d', isOnline: true },
  { id: 'f5', name: 'Mike P.', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e24026704d', isOnline: true },
  { id: 'f6', name: 'Emily R.', avatarUrl: 'https://i.pravatar.cc/150?u=a04258114e29026703d', isOnline: true },
];

export const suggestions: User[] = [
  { id: 's1', name: 'Mike P.', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
  { id: 's2', name: 'Emily R.', avatarUrl: 'https://i.pravatar.cc/150?u=a04258114e29026705d' },
  { id: 's3', name: 'Emily L.', avatarUrl: 'https://i.pravatar.cc/150?u=a048581f4e29026704d' },
];

export const posts: Post[] = [
  {
    id: 'p1',
    userId: 'u2',
    user: {
      id: 'u2',
      name: 'Sarah Miller',
      avatarUrl: 'https://i.pravatar.cc/150?u=a04258a2462d826712d',
    },
    content: 'Beautiful day at the beach!',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop',
    timestamp: '5 mins ago',
    likes: 124,
    shares: 12,
    comments: [
      {
        id: 'c1',
        userId: 'u1',
        user: currentUser,
        content: 'Wow, looks amazing! Have fun! 😍',
        timestamp: '2 mins ago',
      },
      {
        id: 'c2',
        userId: 'f2',
        user: friendsOnline[1],
        content: 'Wish I was there right now.',
        timestamp: '1 min ago',
      }
    ],
  },
  {
    id: 'p2',
    userId: 'u2',
    user: {
      id: 'u2',
      name: 'Sarah Miller',
      avatarUrl: 'https://i.pravatar.cc/150?u=a04258a2462d826712d',
    },
    content: 'Loving the sunset views today.',
    imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2070&auto=format&fit=crop',
    timestamp: '2 hours ago',
    likes: 342,
    shares: 45,
    comments: [],
  },
];
