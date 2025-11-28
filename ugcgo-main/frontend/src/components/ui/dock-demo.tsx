import {
  Home,
  Video,
  Plus,
  Settings,
  CreditCard,
  Users,
  BarChart3,
} from 'lucide-react';

import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';

const navigationData = [
  {
    title: 'Ana Sayfa',
    icon: (
      <Home className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#home',
  },
  {
    title: 'Videolarım',
    icon: (
      <Video className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#videos',
  },
  {
    title: 'Video Üret',
    icon: (
      <Plus className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#create',
  },
  {
    title: 'Analitik',
    icon: (
      <BarChart3 className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#analytics',
  },
  {
    title: 'Kullanıcılar',
    icon: (
      <Users className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#users',
  },
  {
    title: 'Planlar',
    icon: (
      <CreditCard className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#subscription',
  },
  {
    title: 'Ayarlar',
    icon: (
      <Settings className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#settings',
  },
];

export function InfluencerSeninleDock() {
  return (
    <div className='absolute bottom-4 left-1/2 max-w-full -translate-x-1/2'>
      <Dock className='items-end pb-3 bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-xl'>
        {navigationData.map((item, idx) => (
          <DockItem
            key={idx}
            className='aspect-square rounded-full bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200/50 shadow-sm'
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>{item.icon}</DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}

export function DefaultDock() {
  return (
    <div className='absolute bottom-2 left-1/2 max-w-full -translate-x-1/2'>
      <Dock className='items-end pb-3'>
        {navigationData.map((item, idx) => (
          <DockItem
            key={idx}
            className='aspect-square rounded-full bg-gray-200 dark:bg-neutral-800'
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>{item.icon}</DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}