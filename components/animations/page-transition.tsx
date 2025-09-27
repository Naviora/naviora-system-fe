"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  out: {
    opacity: 0,
    x: 20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

export function PageTransition({
  children,
  className = "",
}: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        key={pathname}
        className={className}
        variants={pageVariants}
        initial='initial'
        animate='in'
        exit='out'
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Modal transition
interface ModalTransitionProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
}

const modalVariants: Variants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const backdropVariants: Variants = {
  closed: {
    opacity: 0,
  },
  open: {
    opacity: 1,
  },
};

export function ModalTransition({
  children,
  isOpen,
  onClose,
}: ModalTransitionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <motion.div
            className='fixed inset-0 bg-black/50'
            variants={backdropVariants}
            initial='closed'
            animate='open'
            exit='closed'
            onClick={onClose}
          />
          <motion.div
            className='relative z-10'
            variants={modalVariants}
            initial='closed'
            animate='open'
            exit='closed'
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Drawer transition
interface DrawerTransitionProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  direction?: "left" | "right" | "top" | "bottom";
}

const getDrawerVariants = (
  direction: "left" | "right" | "top" | "bottom"
): Variants => {
  const variants: Record<string, { x?: string; y?: string }> = {
    left: { x: "-100%" },
    right: { x: "100%" },
    top: { y: "-100%" },
    bottom: { y: "100%" },
  };

  return {
    closed: variants[direction],
    open: {
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
  };
};

export function DrawerTransition({
  children,
  isOpen,
  onClose,
  direction = "right",
}: DrawerTransitionProps) {
  const drawerVariants = getDrawerVariants(direction);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50'>
          <motion.div
            className='fixed inset-0 bg-black/50'
            variants={backdropVariants}
            initial='closed'
            animate='open'
            exit='closed'
            onClick={onClose}
          />
          <motion.div
            className={`fixed ${
              direction === "left"
                ? "left-0 top-0 h-full"
                : direction === "right"
                ? "right-0 top-0 h-full"
                : direction === "top"
                ? "top-0 left-0 w-full"
                : "bottom-0 left-0 w-full"
            }`}
            variants={drawerVariants}
            initial='closed'
            animate='open'
            exit='closed'
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
