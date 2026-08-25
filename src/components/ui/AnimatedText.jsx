import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Text component that animates in by words, letters, or lines
 * when scrolled into view. Used for headings and feature text.
 */
export default function AnimatedText({
  text,
  className = '',
  as: Tag = 'h2',
  animation = 'words',
  delay = 0,
  gradient = false,
  stagger = 0.04,
  centered = false,
  nowrap = false,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const elements =
    animation === 'letters'
      ? text.split('')
      : animation === 'lines'
      ? text.split('\n')
      : text.split(' ');

  return (
    <Tag
      className={`${className} ${gradient ? 'gradient-text' : ''} ${nowrap ? 'animated-text-nowrap' : ''}`}
      style={{ display: 'flex', flexWrap: nowrap ? 'nowrap' : 'wrap', justifyContent: centered ? 'center' : 'flex-start', gap: animation === 'letters' ? 0 : '0.3em', whiteSpace: nowrap ? 'nowrap' : 'normal' }}
      ref={ref}
    >
      {elements.map((element, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', flexShrink: 0, paddingBottom: '0.1em', marginBottom: '-0.1em' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '100%', opacity: 0 }}
            animate={
              isInView
                ? { y: 0, opacity: 1 }
                : { y: '100%', opacity: 0 }
            }
            transition={{
              duration: 0.6,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {element === ' ' ? '\u00A0' : element}
            {animation === 'letters' ? '' : ''}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  );
}