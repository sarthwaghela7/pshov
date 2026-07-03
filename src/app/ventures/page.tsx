'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Lock } from 'lucide-react';
import AnimatedText from '@/components/ui/AnimatedText';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

/* ============ Data ============ */
const inHouseVentures = [
  {
    id: 'impactshaala',
    name: 'Impactshaala',
    description: 'A career growth platform where individuals can discover real-world exposures, upskill, and find work that genuinely fits who they are, all in one place.',
    redirectUrl: null,
    isLive: true,
    image: '/images/venture-mockup-1.png',
  },
  {
    id: 'guideshaala',
    name: 'Guideshaala',
    description: 'An AI-powered career counselling platform that uses assessments to build a personalised career roadmap for students and working professionals.',
    redirectUrl: null,
    isLive: true,
    image: '/images/venture-mockup-2.png',
  },
  {
    id: 'riseforchange',
    name: 'Rise For Change',
    description: 'A youth-led NGO working on health, quality education, and youth leadership, aligned with the UN Sustainable Development Goals.',
    redirectUrl: '#',
    isLive: true,
    image: '/images/venture-mockup-3.png',
  },
  {
    id: 'printercartridgewala',
    name: 'Printer Cartridge Wala',
    description: 'A B2B printer consumables and maintenance business offering cartridge refilling, compatible sales, and AMC contracts to corporates and institutions at significantly lower cost.',
    redirectUrl: null,
    isLive: true,
    image: '/images/venture-mockup-1.png',
  },
  {
    id: 'laptopwale',
    name: 'LaptopWale.com',
    description: 'A B2B business supplying quality-checked, warranty-backed refurbished laptops and desktops to corporates, startups, and institutions at a fraction of new device cost.',
    redirectUrl: null,
    isLive: true,
    image: '/images/venture-mockup-2.png',
  },
  {
    id: 'evntra',
    name: 'Evntra',
    description: 'An event services marketplace to discover and book verified vendors across decoration, catering, entertainment, photography, venues, and equipment, or hand the entire event over to us.',
    redirectUrl: null,
    isLive: true,
    image: '/images/venture-mockup-3.png',
  },
  {
    id: 'whole',
    name: 'W.H.O.L.E Community',
    description: 'A community for people rebuilding their sense of self after hard setbacks. A structured journey alongside others on the same road. Within. Heal. Own. Lead. Evolve.',
    redirectUrl: null,
    isLive: true,
    image: '/images/venture-mockup-1.png',
  },
];

const collaboratedServices = [
  {
    id: 'service-placeholder-1',
    name: 'Brand Identity Studio',
    description: 'A specialized design agency crafting purposeful brand identities for early-stage ventures and established corporates alike.',
    whatsappNumber: '919876543210',
    isLive: true,
    image: '/images/venture-mockup-2.png',
  }
];

/* ============ Animation Variant ============ */
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function VenturesPage() {
  const [activeTab, setActiveTab] = useState<'in-house' | 'collaborated'>('in-house');

  const handleWhatsAppClick = (serviceName: string, number: string) => {
    const message = `Hi, I am interested in ${serviceName}. Can we connect?`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <SectionLabel>The Portfolio</SectionLabel>
            <AnimatedText
              text="What I Am Building."
              as="h1"
              animation="words"
            />
            <motion.p
              className={styles.subheadline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Two categories. In-House Ventures are built and operated by me directly. Collaborated Services are engagements I am part of through active partnerships. Both are works in progress.
            </motion.p>

            <motion.div 
              className={styles.toggleContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className={styles.toggle}>
                <div 
                  className={styles.togglePill} 
                  style={{ transform: activeTab === 'in-house' ? 'translateX(0)' : 'translateX(100%)' }} 
                />
                <button
                  className={`${styles.toggleBtn} ${activeTab === 'in-house' ? styles.active : ''}`}
                  onClick={() => setActiveTab('in-house')}
                >
                  In-House Ventures
                </button>
                <button
                  className={`${styles.toggleBtn} ${activeTab === 'collaborated' ? styles.active : ''}`}
                  onClick={() => setActiveTab('collaborated')}
                >
                  Collaborated Services
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ TAB CONTENT ============ */}
      <section className={`${styles.venturesSection} section`}>
        <div className="container">
          {activeTab === 'in-house' && (
            <motion.div
              key="in-house"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.sectionHeader}>
                <SectionLabel>In-House Ventures</SectionLabel>
                <p className={styles.sectionSubtext}>
                  Ventures I have conceptualised, funded, and am actively building. Each is at its own stage of progress.
                </p>
              </div>

              <div className={styles.grid}>
                {inHouseVentures.filter(v => v.isLive).map((venture, i) => (
                  <motion.div
                    key={venture.id}
                    className={styles.card}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={cardVariants}
                  >
                    <div className={styles.imagePlaceholder}>
                      <Image 
                        src={venture.image} 
                        alt={venture.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={i < 2}
                      />
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{venture.name}</h3>
                      <p className={styles.cardDescription}>{venture.description}</p>

                      <div className={styles.cardFooter}>
                        {venture.redirectUrl ? (
                          <a href={venture.redirectUrl} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
                            Visit Website <ExternalLink size={14} />
                          </a>
                        ) : (
                          <span className={styles.cardDisabledLink}>
                            Website in progress <Lock size={12} />
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'collaborated' && (
            <motion.div
              key="collaborated"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.sectionHeader}>
                <SectionLabel>Collaborated Services</SectionLabel>
                <p className={styles.sectionSubtext}>
                  Services and businesses I am part of through active collaborations. These are managed independently but connected to this ecosystem through shared work and partnerships built over time.
                </p>
              </div>

              <div className={styles.grid}>
                {collaboratedServices.filter(s => s.isLive).map((service, i) => (
                  <motion.div
                    key={service.id}
                    className={styles.card}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={cardVariants}
                  >
                    <div className={styles.imagePlaceholder}>
                      <Image 
                        src={service.image} 
                        alt={service.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={i < 2}
                      />
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{service.name}</h3>
                      <p className={styles.cardDescription}>{service.description}</p>

                      <div className={styles.cardFooter}>
                        <button 
                          className={styles.whatsappBtn}
                          onClick={() => handleWhatsAppClick(service.name, service.whatsappNumber)}
                        >
                          Enquire on WhatsApp
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section className={`${styles.closingCTA} section`}>
        <div className="container">
          <div className={styles.closingContent}>
            <AnimatedText
              text="See something that interests you?"
              as="h2"
              animation="words"
              nowrap
            />
            <motion.p
              className={styles.subheadline}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.2, duration: 0.7 }}
              style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-8)' }}
            >
              Reach out whether you want to invest, join a team, or collaborate. I personally review every message.
            </motion.p>
            
            <motion.div
              className={styles.closingButtons}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/contact">
                <Button variant="primary" icon={<ArrowRight size={16} />}>
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
