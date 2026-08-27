import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Link2,
  AtSign,
  Share2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import styles from './Footer.module.css';
import { getContactSettings } from '@/api';

const ventureLinks = [
  { href: '/ventures', label: 'Our Ventures' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Get Involved' },
];

const companyLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About the Founder' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    getContactSettings().then(setSettings);
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand Column */}
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            <img className={styles.logoImage} src="/images/White logo.png" alt="P.Sonkar House of Ventures" />
          </Link>
          <p className={styles.tagline}>
            Ideas in Motion. Ventures in Progress.
          </p>
          <div className={styles.socials}>
            <a
              href={settings.linkedin_url || '#'}
              aria-label="LinkedIn"
              className={styles.socialLink}
            >
              <Link2 size={18} />
            </a>
            <a
              href={settings.instagram_url || '#'}
              aria-label="Instagram"
              className={styles.socialLink}
            >
              <AtSign size={18} />
            </a>
            <a
              href={settings.twitter_url || '#'}
              aria-label="Twitter / X"
              className={styles.socialLink}
            >
              <Share2 size={18} />
            </a>
          </div>
        </div>

        {/* Ecosystem Links */}
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Ecosystem</h4>
          <nav className={styles.linkList}>
            {ventureLinks.map((link) => (
              <Link key={link.href} to={link.href} className={styles.footerLink}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Company Links */}
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Company</h4>
          <nav className={styles.linkList}>
            {companyLinks.map((link) => (
              <Link key={link.href} to={link.href} className={styles.footerLink}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact Column */}
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Get in Touch</h4>
          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}><Mail size={14} /></span>
              <a href={`mailto:${settings.primary_email || ''}`}>{settings.primary_email || 'hello@psonkarventures.com'}</a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}><Phone size={14} /></span>
              <a href={`tel:${settings.primary_whatsapp || ''}`}>{settings.primary_whatsapp || '+91 XXXXX XXXXX'}</a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}><MapPin size={14} /></span>
              <span>{settings.location || 'Bangalore, Karnataka, India'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} P.Sonkar House Of Ventures. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
