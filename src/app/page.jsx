import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Rocket,
  ArrowRight,
  Gem,
  Cog,
  Sprout,
  Building2,
  Layers,
  Star,
} from 'lucide-react';
import SceneWrapper from '@/components/three/SceneWrapper';
import HeroScene from '@/components/three/HeroScene';
import AnimatedText from '@/components/ui/AnimatedText';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { getImageUrl, getServices, getVentures } from '@/api';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './page.module.css';

const updateCardSpotlight = (event) => {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--x', `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty('--y', `${event.clientY - bounds.top}px`);
};

function useDesktopPointer() {
  const [isDesktopPointer, setIsDesktopPointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)');
    const update = () => setIsDesktopPointer(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isDesktopPointer;
}

function createHeroScrollAnimation(gsap, ScrollTrigger) {
  gsap.to('.heroContentGrid', {
    y: -24,
    opacity: 0.86,
    scale: 0.985,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
    },
  });
}

/* ============ Pillar Data ============ */
const pillars = [
  {
    icon: <Gem size={28} />,
    heading: 'Back a Venture',
    body: 'I am building a small, focused set of ventures. If something in the portfolio interests you, there is a way to have that conversation.',
    cta: 'Get Involved',
    href: '/contact',
    accentClass: 'accent',
    number: '01',
  },
  {
    icon: <Cog size={28} />,
    heading: 'Join the Team',
    body: 'Internships, part-time, and full-time roles across ventures in progress. Real work. Real ownership.',
    cta: 'Get Involved',
    href: '/contact',
    accentClass: 'gold',
    number: '02',
  },
  {
    icon: <Sprout size={28} />,
    heading: 'Grow Your Business',
    body: 'Looking for a growth partner who actually works with you? I have the resources and the experience to help.',
    cta: 'Get Involved',
    href: '/contact',
    accentClass: 'teal',
    number: '03',
  },
];

/* ============ Stats Strip Data ============ */
const stats = [
  { icon: <Building2 size={22} />, value: '5', label: 'In-house Ventures' },
  { icon: <Cog size={22} />, value: '10+', label: 'Services' },
  { icon: <Users size={22} />, value: '15+', label: 'Venture Collaborations' },
  { icon: <Star size={22} />, value: '100%', label: 'Impact Driven' },
];

export default function HomePage() {
  const [ventureSnapshots, setVentureSnapshots] = useState([]);
  const [serviceSnapshots, setServiceSnapshots] = useState([]);
  const [portfolioIndex, setPortfolioIndex] = useState(0);
  const [isPortfolioPaused, setIsPortfolioPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isDesktopPointer = useDesktopPointer();
  const heroRef = useRef(null);
  const landingPageRef = useRef(null);
  const { scrollY } = useScroll();
  const imageScale = useTransform(scrollY, [0, 400], [1, 1.08]);
  const imageParallaxY = useTransform(scrollY, [0, 400], [0, -32]);
  const imageMouseX = useMotionValue(0);
  const imageMouseY = useMotionValue(0);
  const imageX = useSpring(imageMouseX, { stiffness: 90, damping: 18 });
  const imageMouseYSpring = useSpring(imageMouseY, { stiffness: 90, damping: 18 });
  const imageY = useTransform([imageParallaxY, imageMouseYSpring], ([scrollOffset, mouseOffset]) => scrollOffset + mouseOffset);
  const pillarsRef = useRef(null);
  const venturesRef = useRef(null);
  const founderRef = useRef(null);
  const ctaRef = useRef(null);

  const pillarsInView = useInView(pillarsRef, { once: true, margin: '-80px' });
  const venturesInView = useInView(venturesRef, { once: true, margin: '-80px' });
  const founderInView = useInView(founderRef, { once: true, margin: '-80px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-80px' });

  useGsap(heroRef, createHeroScrollAnimation);

  useEffect(() => {
    Promise.all([getVentures(), getServices()]).then(([ventures, services]) => {
      setVentureSnapshots(ventures.filter((item) => item.is_active !== false));
      setServiceSnapshots(services.filter((item) => item.is_active !== false));
    });
  }, []);

  const portfolioItems = [
    ...ventureSnapshots.map((item) => ({ ...item, kind: 'venture', href: '/ventures' })),
    ...serviceSnapshots.map((item) => ({ ...item, kind: 'service', href: '/services' })),
  ];

  useEffect(() => {
    if (prefersReducedMotion || isPortfolioPaused || portfolioItems.length < 2) return undefined;
    const interval = window.setInterval(() => {
      setPortfolioIndex((current) => (current + 1) % portfolioItems.length);
    }, 3000);
    return () => window.clearInterval(interval);
  }, [isPortfolioPaused, portfolioItems.length, prefersReducedMotion]);

  useEffect(() => {
    if (portfolioIndex >= portfolioItems.length && portfolioItems.length) setPortfolioIndex(0);
  }, [portfolioIndex, portfolioItems.length]);

  const handleHeroPointerMove = (event) => {
    if (!isDesktopPointer || prefersReducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--cursor-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--cursor-y', `${event.clientY - bounds.top}px`);
    event.currentTarget.style.setProperty('--cursor-opacity', '1');
    imageMouseX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 6);
    imageMouseY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 4);
  };

  const resetHeroPointer = () => {
    heroRef.current?.style.setProperty('--cursor-opacity', '0');
    imageMouseX.set(0);
    imageMouseY.set(0);
  };

  const handleLandingPointerMove = (event) => {
    if (!isDesktopPointer || prefersReducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--cursor-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--cursor-y', `${event.clientY - bounds.top}px`);
    event.currentTarget.style.setProperty('--cursor-opacity', '1');
  };

  const resetLandingPointer = () => {
    landingPageRef.current?.style.setProperty('--cursor-opacity', '0');
  };

  return (
    <div
      ref={landingPageRef}
      className={styles.landingPage}
      onMouseMove={handleLandingPointerMove}
      onMouseLeave={resetLandingPointer}
    >
      {/* ============ HERO SECTION ============ */}
      <section ref={heroRef} className={styles.hero} onMouseMove={handleHeroPointerMove} onMouseLeave={resetHeroPointer}>
        {/* Background Gradient */}
        <div className={styles.heroBackground} />
        <div className={styles.heroDotGrid} aria-hidden="true" />
        {/* Content Container */}
        <div className={`${styles.heroContainer} container`}>
          
          {/* CONTENT GRID */}
          <div className={styles.heroContentGrid}>
            
            {/* LEFT: Intro & Primary CTAs */}
            <div className={styles.heroLeft}>
              <motion.p
                className={styles.heroTagline}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ delay: 0, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                Ideas in Motion. Ventures in Progress.
              </motion.p>

              <h1 className={styles.heroTitle}>
                <span className={styles.heroTitleLine}>
                  <motion.span
                    initial={prefersReducedMotion ? { opacity: 1 } : { y: '110%' }}
                    animate={prefersReducedMotion ? { opacity: 1 } : { y: '0%' }}
                    transition={prefersReducedMotion
                      ? { delay: 0.12, duration: 0.3, ease: 'easeOut' }
                      : { delay: 0.12, type: 'spring', stiffness: 100, damping: 15 }}
                  >
                    P.Sonkar
                  </motion.span>
                </span>
                <span className={styles.heroTitleLine}>
                  <motion.span
                    className={styles.textHighlight}
                    initial={prefersReducedMotion ? { opacity: 1 } : { y: '110%' }}
                    animate={prefersReducedMotion ? { opacity: 1 } : { y: '0%' }}
                    transition={prefersReducedMotion
                      ? { delay: 0.21, duration: 0.3, ease: 'easeOut' }
                      : { delay: 0.21, type: 'spring', stiffness: 100, damping: 15 }}
                  >
                    House Of Ventures.
                  </motion.span>
                </span>
              </h1>


            </div>

            {/* CENTER: Cutout Image */}
            <motion.div
              className={styles.heroImageWrapper}
              style={isDesktopPointer && !prefersReducedMotion ? { scale: imageScale, x: imageX, y: imageY } : undefined}
              initial={prefersReducedMotion || !isDesktopPointer ? { opacity: 1 } : { opacity: 0, clipPath: 'inset(6% 0 0 round 2rem)' }}
              animate={prefersReducedMotion || !isDesktopPointer ? { opacity: 1 } : { opacity: 1, clipPath: 'inset(0% 0 0 round 0.5rem)' }}
              transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.heroAmbientGlow} aria-hidden="true" />
              <motion.img
                src="/images/founder_white_bg.png"
                alt="Pratap Sonkar - Founder"
                className={styles.heroImage}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>

            {/* RIGHT: Secondary Info & Secondary CTA */}
            <motion.div
              className={styles.heroRight}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(8px)' }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.95, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3
                className={styles.heroRightTitle}
              >
                A  founder-led <br></br>ecosystem.
              </h3>

              <p
                className={styles.heroSub}
              >
                Built around the ventures I build, the people I work with, and the opportunities I create. Based in Bangalore.
              </p>

            </motion.div>

          </div>

          {/* BOTTOM CENTER CTAs */}
          <div className={styles.heroCenterCTAs}>
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { delay: 1.65, duration: 0.3 } : { delay: 1.65, type: 'spring', stiffness: 100, damping: 15 }}
            >
              <Link to="/ventures">
                <Button magnetic variant="glass" size="lg" className={styles.mobileHeroCtaVentures}>
                  Explore Ventures
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { delay: 1.74, duration: 0.3 } : { delay: 1.74, type: 'spring', stiffness: 100, damping: 15 }}
            >
              <Link to="/ventures#services">
                <Button magnetic variant="glass" size="lg" className={styles.mobileHeroCtaServices}>
                  Explore Services
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { delay: 1.83, duration: 0.3 } : { delay: 1.83, type: 'spring', stiffness: 100, damping: 15 }}
            >
              <Link to="/contact">
                <Button magnetic variant="glass" size="lg" className={styles.mobileHeroCtaInvolved}>
                  Get Involved
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ STATS STRIP ============ */}
      <section className={styles.statsStrip}>
        <div className={styles.sectionBackdrop} aria-hidden="true" />
        <div className={`${styles.statsInner} container`}>
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} className={styles.statItemReveal}>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statText}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ THREE PILLARS ============ */}
      <section className={`${styles.pillars} section`} ref={pillarsRef}>
        <div className={styles.sectionBackdrop} aria-hidden="true" />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, x: -72 }}
            animate={pillarsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -72 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionLabel>What This Ecosystem Offers</SectionLabel>
            <AnimatedText
              text="Three Ways to Be Part of This."
              as="h2"
              animation="words"
              gradient
            />
          </motion.div>

          <div className={styles.pillarGrid}>
            {pillars.map((pillar, i) => (
              <Reveal key={i} className={styles.cardReveal} delay={i * 0.13}>
                <motion.div
                className={`${styles.pillarCard} glass-card`}
                  whileHover={isDesktopPointer && !prefersReducedMotion ? { y: -8 } : undefined}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  onMouseMove={isDesktopPointer ? updateCardSpotlight : undefined}
                >
                  <div className={styles.pillarTop}>
                    <div className={`${styles.pillarIcon} ${styles[pillar.accentClass]}`}>
                      {pillar.icon}
                    </div>
                    <span className={styles.pillarNumber}>{pillar.number}</span>
                  </div>
                  <h3 className={styles.pillarHeading}>{pillar.heading}</h3>
                  <p className={styles.pillarBody}>{pillar.body}</p>
                  <Link to={pillar.href} className={styles.pillarCTA}>
                    {pillar.cta}
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ VENTURES SNAPSHOT ============ */}
      <section className={`${styles.ventures} section`} ref={venturesRef}>
        <div className={styles.sectionBackdrop} aria-hidden="true" />
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

          <div
            className={styles.portfolioCarousel}
            onMouseEnter={() => setIsPortfolioPaused(true)}
            onMouseLeave={() => setIsPortfolioPaused(false)}
            onFocus={() => setIsPortfolioPaused(true)}
            onBlur={() => setIsPortfolioPaused(false)}
          >
            <AnimatePresence mode="wait">
              {portfolioItems.length > 0 && (
                <motion.div
                  key={`${portfolioItems[portfolioIndex].kind}-${portfolioItems[portfolioIndex].id || portfolioIndex}`}
                  className={styles.portfolioSlide}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={portfolioItems[portfolioIndex].href} className={styles.portfolioLink}>
                    <div className={styles.portfolioMedia}>
                      {(portfolioItems[portfolioIndex].landing_image_url || portfolioItems[portfolioIndex].image_url) && (
                        <img src={getImageUrl(portfolioItems[portfolioIndex].landing_image_url || portfolioItems[portfolioIndex].image_url)} alt="" />
                      )}
                    </div>
                    <div className={styles.portfolioSlideFooter}>
                      <span className={styles.portfolioKind}>{portfolioItems[portfolioIndex].kind}</span>
                      <h3>{portfolioItems[portfolioIndex].name}</h3>
                      <ArrowRight size={20} aria-hidden="true" />
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            {portfolioItems.length > 0 && (
              <div className={styles.portfolioControls} aria-label="Portfolio slides">
                {portfolioItems.map((item, index) => (
                  <button
                    key={`${item.kind}-${item.id || index}`}
                    type="button"
                    className={index === portfolioIndex ? styles.portfolioDotActive : styles.portfolioDot}
                    onClick={() => setPortfolioIndex(index)}
                    aria-label={`View ${item.name}`}
                    aria-pressed={index === portfolioIndex}
                  />
                ))}
              </div>
            )}
          </div>

          <motion.div
            className={styles.viewAll}
            initial={{ opacity: 0 }}
            animate={venturesInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link to="/ventures">
              <Button variant="outline" icon={<ArrowRight size={16} />}>
                View All Ventures
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" icon={<ArrowRight size={16} />}>
                View All Services
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============ FOUNDER STRIP ============ */}
      <section className={`${styles.founder} section`} ref={founderRef}>
        <div className={styles.sectionBackdrop} aria-hidden="true" />
        <Reveal>
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
              <motion.div
                className={styles.founderDivider}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
                animate={founderInView ? (prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scaleX: 1 }) : {}}
                transition={{ delay: 0.28, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
                <Link to="/about">
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
              <div className={styles.founderRing} aria-hidden="true" />
              <img
                src="/images/pratap-outdoor.jpg"
                alt="Pratap Sonkar outdoors"
                className={styles.founderPhoto}
              />
              <div className={styles.founderChip} style={{ '--chip-x': '-8%', '--chip-y': '12%' }}>
                <Layers size={16} />
                <span>Multi-venture</span>
              </div>
              <div className={styles.founderChip} style={{ '--chip-x': '68%', '--chip-y': '68%' }}>
                <Rocket size={16} />
                <span>Founder-led</span>
              </div>
            </motion.div>
          </div>
        </div>
        </Reveal>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section className={`${styles.closingCTA} section`} ref={ctaRef}>
        <div className={styles.sectionBackdrop} aria-hidden="true" />
        <Reveal>
        <div className={`container ${styles.closingBox}`} style={{ textAlign: 'center' }}>
          <AnimatedText
            text="Something here catch your eye?"
            as="h2"
            animation="words"
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
          <div className={styles.closingButtons}>
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={ctaInView ? (prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to="/contact">
              <Button variant="secondary" glowing>
                Invest
              </Button>
            </Link>
            </motion.div>
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={ctaInView ? (prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to="/contact">
              <Button variant="glassOutline">Work With Me</Button>
            </Link>
            </motion.div>
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={ctaInView ? (prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
              transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to="/contact">
              <Button variant="glassOutline">Grow With Me</Button>
            </Link>
            </motion.div>
          </div>
        </div>
        </Reveal>
      </section>
    </div>
  );
}
