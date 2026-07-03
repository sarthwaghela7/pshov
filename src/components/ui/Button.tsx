'use client';

import { type ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import styles from './Button.module.css';

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'glass' | 'glassOutline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  fullWidth?: boolean;
  icon?: ReactNode;
  glowing?: boolean;
}

/**
 * Premium animated button with glow effects and hover states.
 * Supports primary (filled), secondary (glass), ghost, and outline variants.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  glowing = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${
        fullWidth ? styles.fullWidth : ''
      } ${glowing ? styles.glowing : ''} ${className}`}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children}</span>
      {variant === 'primary' && <span className={styles.shine} />}
    </motion.button>
  );
}
