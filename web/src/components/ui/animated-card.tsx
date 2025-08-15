'use client';

import { ClientMotionDiv } from '@/components/motion/client-only';
import { type Easing } from 'framer-motion';
import { Card } from './card';

interface AnimatedCardProps extends React.ComponentProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as Easing,
    },
  },
};

export function AnimatedCard({ children, className, ...props }: AnimatedCardProps) {
  return (
    <ClientMotionDiv initial="hidden" animate="visible" variants={cardVariants} layout>
      <Card className={className} {...props}>
        {children}
      </Card>
    </ClientMotionDiv>
  );
}
