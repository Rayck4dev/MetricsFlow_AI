import { type Variants } from "framer-motion";

export const sectionAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const benefitAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const comparisonAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
