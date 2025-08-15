'use client';

import { ClientMotionDiv } from '@/components/motion/client-only';
import { type Variants } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

const defaultVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function FadeIn({ children, delay = 0, duration = 0.4, className }: FadeInProps) {
  return (
    <ClientMotionDiv
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      variants={defaultVariants}
      className={className}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </ClientMotionDiv>
  );
}
