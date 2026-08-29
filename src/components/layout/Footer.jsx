import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Share2,
} from 'lucide-react';
import styles from './Footer.module.css';
import { getContactSettings } from '@/api';

// LinkedIn Icon SVG
const LinkedInIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.736 0-9.646h3.554v1.348l-.02.031h.02v-.031c.42-.649 1.175-1.574 2.863-1.574 2.09 0 3.656 1.36 3.656 4.292v5.58zM5.337 8.855c-1.144 0-1.915-.762-1.915-1.715 0-.955.77-1.715 1.946-1.715 1.177 0 1.915.76 1.93 1.715 0 .953-.77 1.715-1.961 1.715zm1.676 11.597H3.662V9.806h3.351v10.646zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
  </svg>
);

// Instagram Icon SVG
const InstagramIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M7 12a5 5 0 1 0 10 0 5 5 0 0 0 -10 0"/>
    <circle cx="17.5" cy="6.5" r="1.5"/>
  </svg>
);

// Twitter/X Icon SVG  
const TwitterIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.614l-5.106-6.694L2.306 21.75H-1.184l7.73-8.835L-1.5 2.25h6.786l4.821 6.383L18.244 2.25zM17.25 19.52h1.833L6.486 4.176H4.382l12.868 15.344z"/>
  </svg>
);

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
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={styles.socialLink}
            >
              <LinkedInIcon size={18} />
            </a>
            <a
              href={settings.instagram_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={styles.socialLink}
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href={settings.twitter_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className={styles.socialLink}
            >
              <TwitterIcon size={18} />
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
