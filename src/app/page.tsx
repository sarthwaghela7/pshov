'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp,
  Users,
  Rocket,
  ArrowRight,
  Gem,
  Cog,
  Sprout,
} from 'lucide-react';
import SceneWrapper from '@/components/three/SceneWrapper';
import HeroScene from '@/components/three/HeroScene';
import AnimatedText from '@/components/ui/AnimatedText';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

/* ============ Fade-In Variant ============ */
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ============ Pillar Data ============ */
const pillars = [
  {
    icon: <Gem size={28} />,
    heading: 'Back a Venture',
    body: 'I am building a small, focused set of ventures. If something in the portfolio interests you, there is a way to have that conversation.',
    cta: 'Get Involved',
    href: '/invest',
    accentClass: 'accent',
  },
  {
    icon: <Cog size={28} />,
    heading: 'Join the Team',
    body: 'Internships, part-time, and full-time roles across ventures in progress. Real work. Real ownership.',
    cta: 'Get Involved',
    href: '/work',
    accentClass: 'gold',
  },
  {
    icon: <Sprout size={28} />,
    heading: 'Grow Your Business',
    body: 'Looking for a growth partner who actually works with you? I have the resources and the experience to help.',
    cta: 'Get Involved',
    href: '/grow',
    accentClass: 'teal',
  },
];

/* ============ Venture Snapshot Data ============ */
const ventureSnapshots = [
  {
    name: 'Impactshaala',
    oneLiner: 'A career growth platform for real-world exposures, upskilling, and work discovery.',
    sector: 'CareerTech / EdTech',
    stage: 'In Development',
  },
  {
    name: 'Guideshaala',
    oneLiner: 'AI-powered career counselling with personalised roadmaps for students and professionals.',
    sector: 'EdTech / AI',
    stage: 'Early Stage',
  },
  {
    name: 'Rise For Change',
    oneLiner: 'A youth-led NGO working on health, education, and leadership aligned with UN SDGs.',
    sector: 'Social Impact',
    stage: 'In Progress',
  },
  {
    name: 'Evntra',
    oneLiner: 'An event services marketplace for booking verified vendors or full event management.',
    sector: 'Marketplace',
    stage: 'Being Shaped',
  },
];

export default function HomePage() {
  const pillarsRef = useRef<HTMLDivElement>(null);
  const venturesRef = useRef<HTMLDivElement>(null);
  const founderRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const pillarsInView = useInView(pillarsRef, { once: true, margin: '-80px' });
  const venturesInView = useInView(venturesRef, { once: true, margin: '-80px' });
  const founderInView = useInView(founderRef, { once: true, margin: '-80px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-80px' });

  return (
    <>
      {/* ============ HERO SECTION ============ */}
      <section className={styles.hero}>
        {/* Background Gradient */}
        <div className={styles.heroBackground} />

        {/* Content Container */}
        <div className={`${styles.heroContainer} container`}>
          
          {/* CONTENT GRID */}
          <div className={styles.heroContentGrid}>
            
            {/* LEFT: Intro & Primary CTAs */}
            <div className={styles.heroLeft}>
              <motion.p
                className={styles.heroTagline}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                Ideas in Motion. Ventures in Progress.
              </motion.p>

              <motion.h1
                className={styles.heroTitle}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                P.Sonkar <span className={styles.textHighlight}>House Of Ventures.</span>
              </motion.h1>


            </div>

            {/* CENTER: Cutout Image */}
            <motion.div
              className={styles.heroImageWrapper}
              initial={{ opacity: 0, y: 50, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <img 
                src="/images/founder_transparent2.png" 
                alt="Pratap Sonkar - Founder" 
                className={styles.heroImage}
              />
            </motion.div>

            {/* RIGHT: Secondary Info & Secondary CTA */}
            <div className={styles.heroRight}>
              <motion.h3
                className={styles.heroRightTitle}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                A founder-led ecosystem.
              </motion.h3>

              <motion.p
                className={styles.heroSub}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                Built around the ventures I build, the people I work with, and the opportunities I create. Based in Bangalore.
              </motion.p>

            </div>

          </div>

          {/* BOTTOM CENTER CTAs */}
          <motion.div
            className={styles.heroCenterCTAs}
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/ventures">
              <Button variant="glass" size="lg" icon={<ArrowRight size={18} />}>
                Explore Ventures
              </Button>
            </Link>
            <Link href="/ventures#services">
              <Button variant="glassOutline" size="lg">
                Explore Services
              </Button>
            </Link>
            <Link href="/invest">
              <Button variant="glassOutline" size="lg">
                Get Involved
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============ THREE PILLARS ============ */}
      <section className={`${styles.pillars} section`} ref={pillarsRef}>
        <div className="container">
          <SectionLabel>What This Ecosystem Offers</SectionLabel>
          <AnimatedText
            text="Three Ways to Be Part of This."
            as="h2"
            animation="words"
            gradient
          />

          <div className={styles.pillarGrid}>
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                className={`${styles.pillarCard} glass-card`}
                custom={i}
                initial="hidden"
                animate={pillarsInView ? 'visible' : 'hidden'}
                variants={fadeInUp}
                whileHover={{
                  y: -8,
                  rotateX: 2,
                  rotateY: i === 0 ? 3 : i === 2 ? -3 : 0,
                }}
                style={{ perspective: 1000 }}
              >
                <div className={`${styles.pillarIcon} ${styles[pillar.accentClass]}`}>
                  {pillar.icon}
                </div>
                <h3 className={styles.pillarHeading}>{pillar.heading}</h3>
                <p className={styles.pillarBody}>{pillar.body}</p>
                <Link href={pillar.href} className={styles.pillarCTA}>
                  {pillar.cta}
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ VENTURES SNAPSHOT ============ */}
      <section className={`${styles.ventures} section`} ref={venturesRef}>
        <div className="container">
          <SectionLabel>The Portfolio</SectionLabel>
          <AnimatedText
            text="Here Is What I Am Building."
            as="h2"
            animation="words"
          />
          <motion.p
            className={styles.venturesSub}
            initial={{ opacity: 0 }}
            animate={venturesInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            A set of ventures at different stages. Some are being actively developed. Some are still being shaped. All of them are being worked on with full intent.
          </motion.p>

          <div className={styles.ventureGrid}>
            {ventureSnapshots.map((venture, i) => (
              <motion.div
                key={i}
                className={`${styles.ventureCard} glass-card`}
                custom={i}
                initial="hidden"
                animate={venturesInView ? 'visible' : 'hidden'}
                variants={fadeInUp}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div className={styles.ventureHeader}>
                  <h4 className={styles.ventureName}>{venture.name}</h4>
                  <span className={styles.ventureStage}>{venture.stage}</span>
                </div>
                <p className={styles.ventureOneLiner}>{venture.oneLiner}</p>
                <span className={styles.ventureSector}>{venture.sector}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className={styles.viewAll}
            initial={{ opacity: 0 }}
            animate={venturesInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link href="/ventures">
              <Button variant="outline" icon={<ArrowRight size={16} />}>
                View All Ventures
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============ FOUNDER STRIP ============ */}
      <section className={`${styles.founder} section`} ref={founderRef}>
        <div className="container">
          <div className={styles.founderInner}>
            <div className={styles.founderContent}>
              <SectionLabel>The Person Behind This</SectionLabel>
              <AnimatedText
                text="I am Pratap Sonkar."
                as="h2"
                animation="words"
                nowrap
              />
              <motion.p
                className={styles.founderBody}
                initial={{ opacity: 0, y: 20 }}
                animate={founderInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                I build ventures, enable collaborations, and work at the intersection of people, systems, and execution. P.Sonkar House Of Ventures is the ecosystem I have built around all of it.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={founderInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link href="/about">
                  <Button variant="secondary" icon={<ArrowRight size={16} />}>
                    Read My Story
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div
              className={styles.founderVisual}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={founderInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.founderGlow} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section className={`${styles.closingCTA} section`} ref={ctaRef}>
        <div className="container" style={{ textAlign: 'center' }}>
          <AnimatedText
            text="Something here catch your eye?"
            as="h2"
            animation="words"
            gradient
            centered
          />
          <motion.p
            className={styles.closingSub}
            initial={{ opacity: 0 }}
            animate={ctaInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Whether you want to invest, join a team, or grow your business, reach out and I will take it from there.
          </motion.p>
          <motion.div
            className={styles.closingButtons}
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/invest">
              <Button variant="primary" glowing>
                Invest
              </Button>
            </Link>
            <Link href="/work">
              <Button variant="outline">Work With Me</Button>
            </Link>
            <Link href="/grow">
              <Button variant="outline">Grow With Me</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
