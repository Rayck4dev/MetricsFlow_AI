"use client";

import { motion, type Variants } from "framer-motion";
import { features } from "@/types/features";

const cardAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.07,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

interface FeatureCardProps {
  feature: (typeof features)[number];
  index: number;
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <motion.article
      custom={index}
      variants={cardAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        margin: "-80px",
      }}
      className="
        group
        relative
        flex
        min-h-[235px]
        flex-col
        overflow-hidden
        rounded-2xl
        border border-surface-border
        bg-surface-panel/70
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:bg-surface-panel
      "
    >
      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-32
          w-32
          rounded-full
          ${feature.background}
          opacity-0
          blur-3xl
          transition-opacity
          duration-500
          group-hover:opacity-100
        `}
      />

      <span
        aria-hidden="true"
        className="
          absolute
          right-6
          top-6
          text-[10px]
          font-bold
          tracking-wider
          text-slate-700
        "
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div
        className={`
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          ${feature.background}
          ${feature.border}
          transition-transform
          duration-300
          group-hover:scale-105
        `}
      >
        <Icon size={20} className={feature.color} aria-hidden="true" />
      </div>

      <div className="relative mt-5">
        <span
          className={`
            inline-flex
            rounded-md
            border
            ${feature.border}
            ${feature.background}
            px-2
            py-1
            text-[9px]
            font-semibold
            ${feature.color}
          `}
        >
          {feature.tag}
        </span>
      </div>

      <h3
        className="
          relative
          mt-3
          font-heading
          text-base
          font-bold
          text-white
          transition-colors
          duration-300
          group-hover:text-brand-300
        "
      >
        {feature.title}
      </h3>

      <p
        className="
          relative
          mt-2
          text-xs
          leading-5
          text-slate-400
        "
      >
        {feature.description}
      </p>

      <div
        aria-hidden="true"
        className="
          absolute
          bottom-0
          left-6
          right-6
          h-px
          origin-left
          scale-x-0
          bg-gradient-to-r
          from-brand-500/50
          to-transparent
          transition-transform
          duration-500
          group-hover:scale-x-100
        "
      />
    </motion.article>
  );
}
