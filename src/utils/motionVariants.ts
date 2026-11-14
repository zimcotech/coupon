import { Variants, Transition } from 'framer-motion';

/**
 * Shared spring physics for subtle, high-performance card animations.
 */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 28,
  mass: 0.9,
};

/**
 * Container variant with smooth staggerChildren transitions when filtering
 * categories or sorting deals.
 */
export const dealGridContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
      duration: 0.15,
    },
  },
};

/**
 * Card item variant supporting layout animations, entry staggering,
 * and exit fades when deals are filtered or re-sorted.
 */
export const dealCardItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    },
  },
};
