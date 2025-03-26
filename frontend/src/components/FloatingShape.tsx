import React from "react";
import { motion } from "motion/react";

interface Props {
  color: string;
  size: string;
  top: string;
  left: string;
  delay: number;
}
export const FloatingShape: React.FC<Props> = ({
  color,
  size,
  top,
  left,
  delay,
}) => {
  return (
    // Use motion to create animation
    <motion.div
      animate={{
        x: ["0%", "100%", "0%"],
        y: ["0%", "100%", "0%"],

        rotate: [0, 360],
      }}
      transition={{
        delay,
        repeat: Infinity,
        ease: "linear",
        duration: 10,
      }}
      className={`${color} ${size} ${top} ${left} absolute rounded-full opacity-20 blur-xl `}
    />
  );
};
