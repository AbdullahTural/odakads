"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** yon: yukaridan/asagidan/soldan/sagdan kayma */
  direction?: "up" | "down" | "left" | "right";
  as?: "div" | "section" | "li" | "span";
};

const offset = 28;

function getVariants(direction: RevealProps["direction"]): Variants {
  const map = {
    up: { x: 0, y: offset },
    down: { x: 0, y: -offset },
    left: { x: offset, y: 0 },
    right: { x: -offset, y: 0 },
  } as const;
  const from = map[direction ?? "up"];
  return {
    hidden: { opacity: 0, ...from },
    visible: { opacity: 1, x: 0, y: 0 },
  };
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      variants={getVariants(direction)}
    >
      {children}
    </MotionTag>
  );
}

/** Cocuklarini sirayla (stagger) ortaya cikaran kapsayici */
export function RevealGroup({
  children,
  className,
  stagger = 0.12,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: RevealProps["direction"];
}) {
  return (
    <motion.div
      className={className}
      variants={getVariants(direction)}
      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
