'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileSelector from '@/components/ProfileSelector';
import { Child } from '@/lib/types';

export default function Home() {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const router = useRouter();

  const handleSelectChild = (child: Child) => {
    setSelectedChild(child);
    // Redirect to stories page
    setTimeout(() => {
      router.push('/stories');
    }, 500);
  };

  return <ProfileSelector onSelectChild={handleSelectChild} />;
}
