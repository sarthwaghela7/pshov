import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import AnimatedText from '@/components/ui/AnimatedText';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import { getImageUrl, getServices, getVentures } from '@/api';
import { useGsap } from '@/hooks/useGsap';
import styles from './page.module.css';

function uniqueByName(items) {
  const seen = new Set();
  return items.filter((item) => {
    const name = item.name.trim().toLowerCase();
    if (seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}

function createShowcaseAnimation(gsap, ScrollTrigger) {
  gsap.utils.toArray('[data-venture-card]').forEach((card, index) => {
    gsap.fromTo(card,
      { y: 28 },
      {
        y: 0,
        duration: 0.7,
        delay: index * 0.04,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true,
        },
      },
    );

    const image = card.querySelector('[data-venture-image]');
    if (image) {
      gsap.fromTo(image,
        { scale: 1.06 },
        {
          scale: 1,
          duration: 0.9,
          delay: index * 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 84%',
            once: true,
          },
        },
      );
    }
  });
}

export default function VenturesPage() {
  const [activeTab, setActiveTab] = useState('in-house');
  const [activeCard, setActiveCard] = useState(0);
  const [inHouseVentures, setInHouseVentures] = useState([]);
  const [collaboratedServices, setCollaboratedServices] = useState([]);
  const showcaseRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/services' || location.hash === '#services') setActiveTab('collaborated');
  }, [location.pathname, location.hash]);

  const visibleItems = activeTab === 'in-house'
    ? uniqueByName(inHouseVentures.filter((venture) => venture.is_active !== false))
    : uniqueByName(collaboratedServices.filter((service) => service.is_active !== false));

  useGsap(showcaseRef, createShowcaseAnimation, [activeTab, visibleItems.length]);

  useEffect(() => {
    Promise.all([getVentures(), getServices()]).then(([ventures, services]) => {
      setInHouseVentures(ventures);
      setCollaboratedServices(services);
    });
  }, []);

  useEffect(() => {
    setActiveCard(0);
  }, [activeTab]);

  useEffect(() => {
    const cards = showcaseRef.current?.querySelectorAll('[data-venture-card]');
    if (!cards?.length) return undefined;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveCard(Number(entry.target.dataset.index));
      });
    }, { rootMargin: '-30% 0px -42% 0px', threshold: 0.55 });

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [activeTab, visibleItems.length]);

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
      <section ref={showcaseRef} id="services" className={`${styles.venturesSection} section`}>
        <div className="container">
          <div className={styles.showcaseProgress} aria-label={`Venture ${visibleItems.length ? activeCard + 1 : 0} of ${visibleItems.length}`}>
            <span>{String(visibleItems.length ? activeCard + 1 : 0).padStart(2, '0')} / {String(visibleItems.length).padStart(2, '0')}</span>
            <span className={styles.showcaseProgressTrack} aria-hidden="true">
              <span className={styles.showcaseProgressFill} style={{ transform: `scaleX(${visibleItems.length ? (activeCard + 1) / visibleItems.length : 0})` }} />
            </span>
          </div>
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
                {visibleItems.map((venture, i) => (
                  <motion.div
                    key={venture.id}
                    className={`${styles.card} ${i === activeCard ? styles.cardActive : ''}`}
                    data-venture-card
                    data-index={i}
                    aria-current={i === activeCard ? 'step' : undefined}
                  >
                    <div className={styles.imagePlaceholder}>
                      {venture.image_url ? <img data-venture-image src={getImageUrl(venture.image_url)} alt={venture.name} /> : <span>Image coming soon</span>}
                    </div>
                    <div className={styles.cardContent}>
                      <span className={styles.cardNumber} aria-label={`Venture ${i + 1}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className={styles.cardTitle}>{venture.name}</h3>
                      <p className={styles.cardDescription}>{venture.description}</p>

                      <div className={styles.cardFooter}>
                        <div className={styles.cardActions}>
                          {venture.website_url && (
                            <a href={venture.website_url} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
                              Visit Website <ExternalLink size={14} />
                            </a>
                          )}
                          {!venture.website_url && (
                            <span className={styles.cardDisabledLink} aria-disabled="true">
                              Website locked/private <ExternalLink size={14} />
                            </span>
                          )}
                          <Link to={`/contact?venture=${encodeURIComponent(venture.name)}`} className={styles.cardLink}>
                            Enquire about this venture <ArrowRight size={14} />
                          </Link>
                        </div>
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
                {visibleItems.map((service, i) => (
                  <motion.div
                    key={service.id}
                    className={`${styles.card} ${i === activeCard ? styles.cardActive : ''}`}
                    data-venture-card
                    data-index={i}
                    aria-current={i === activeCard ? 'step' : undefined}
                  >
                    <div className={styles.imagePlaceholder}>
                      {service.image_url ? <img data-venture-image src={getImageUrl(service.image_url)} alt={service.name} /> : <span>Image coming soon</span>}
                    </div>
                    <div className={styles.cardContent}>
                      <span className={styles.cardNumber} aria-label={`Service ${i + 1}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className={styles.cardTitle}>{service.name}</h3>
                      <p className={styles.cardDescription}>{service.description}</p>

                      <div className={styles.cardFooter}>
                        <div className={styles.cardActions}>
                          <Link to={`/contact?venture=${encodeURIComponent(service.name)}`} className={styles.cardLink}>Enquire about this service <ArrowRight size={14} /></Link>
                        </div>
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
              centered
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
              <Link to="/contact">
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
