'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Briefcase } from 'lucide-react';
import AnimatedText from '@/components/ui/AnimatedText';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

/* ============ Fade-In Variant ============ */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function AboutPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <SectionLabel>About Pratap Sonkar</SectionLabel>
            <AnimatedText
              text="Builder. Operator. Founder."
              as="h1"
              animation="words"
              nowrap
            />
            <motion.p
              className={styles.subheadline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Here is my story and what I am building.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ============ THE STORY & PRINCIPLES ============ */}
      <section className={`${styles.contentSection} section`}>
        <div className="container">
          <div className={styles.grid}>
            {/* Left Sidebar */}
            <div className={styles.sidebar}>
              <h2 className={styles.sidebarTitle}>The Story</h2>
            </div>
            
            {/* Right Content */}
            <div className={styles.mainContent}>
              <motion.div
                className={styles.prose}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeInUp}
                custom={0}
              >
                <p>
                  P.Sonkar House Of Ventures did not come together through a single plan. It came together through years of working on things I genuinely believed needed to exist, starting from scratch, figuring things out on the ground, and building across areas I found myself drawn to.
                </p>
                <p>
                  Over time, what started as individual projects began to take shape as a connected ecosystem. P.Sonkar House Of Ventures is the formal structure that holds all of it together. It is the parent entity behind every venture I build and every collaboration I am part of.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW PRATAP WORKS ============ */}
      <section className={`${styles.contentSection} section`}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.sidebar}>
              <h2 className={styles.sidebarTitle}>How I Work</h2>
            </div>
            
            <div className={styles.mainContent}>
              <motion.div
                className={styles.prose}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeInUp}
                custom={0}
              >
                <div className={styles.principlesList}>
                  <div className={styles.principle}>
                    <h3 className={styles.principleTitle}>Start With Clarity</h3>
                    <p>Every venture I work on begins with a clear understanding of the problem being solved, who it is being solved for, and whether there is a sustainable model behind it. Clarity before action, always.</p>
                  </div>
                  
                  <div className={styles.principle}>
                    <h3 className={styles.principleTitle}>Stay Close to the Work</h3>
                    <p>I stay operationally close to what I build. Not from a distance. I am inside the decisions, the conversations, and the details that actually determine whether something works or not.</p>
                  </div>

                  <div className={styles.principle}>
                    <h3 className={styles.principleTitle}>Build Systems, Not Dependencies</h3>
                    <p>The goal is always to build something that does not depend entirely on me. Systems and teams are built alongside what we are building, not after it.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PHILOSOPHY ============ */}
      <section className={`${styles.contentSection} section`}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.sidebar}>
              <h2 className={styles.sidebarTitle}>What Drives the Portfolio</h2>
            </div>
            
            <div className={styles.mainContent}>
              <motion.div
                className={styles.prose}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeInUp}
                custom={0}
              >
                <p>
                  Each venture in this ecosystem exists because there was a real gap worth addressing. The sectors vary but the reasoning is consistent: a problem that is large enough, a solution that is practical, and a model that can be made to work.
                </p>

                <h3 className={styles.sidebarTitle} style={{ marginTop: '2rem' }}>In My Own Words</h3>
                <div className={styles.noteBox}>
                  <p className={styles.noteQuote}>
                    &quot;I did not set out to build a venture studio. I set out to work on things I believed needed to exist. This is what that looks like so far.
                  </p>
                  <p className={styles.noteQuote} style={{ marginTop: '1rem' }}>
                    Along the way, I also built a network of people, businesses, and collaborations that became just as much a part of this ecosystem as the ventures I own. The Collaborated Services side of this is not separate from what I do. It is a reflection of the relationships and partnerships I have built over time for responsible and quality work getting delivered.&quot;
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section className={`${styles.closingCTA} section`}>
        <div className="container">
          <div className={styles.closingContent}>
            <AnimatedText
              text="Curious about the ventures or want to connect?"
              as="h2"
              animation="words"
              centered
            />
            
            <motion.div
              className={styles.closingButtons}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/ventures">
                <Button variant="primary" icon={<Briefcase size={16} />}>
                  View My Ventures
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" icon={<ArrowRight size={16} />}>
                  Get Involved
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
