import Link from 'next/link';
import {
  Link2,
  AtSign,
  Share2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import styles from './Footer.module.css';

const ventureLinks = [
  { href: '/ventures', label: 'Our Ventures' },
  { href: '/contact', label: 'Get Involved' },
];

const companyLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About the Founder' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand Column */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMark}>P.</span>
            <span className={styles.logoText}>SONKAR</span>
          </Link>
          <p className={styles.tagline}>
            Ideas in Motion. Ventures in Progress.
          </p>
          <div className={styles.socials}>
            <a
              href="#"
              aria-label="LinkedIn"
              className={styles.socialLink}
            >
              <Link2 size={18} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className={styles.socialLink}
            >
              <AtSign size={18} />
            </a>
            <a
              href="#"
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
              <Link key={link.href} href={link.href} className={styles.footerLink}>
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
              <Link key={link.href} href={link.href} className={styles.footerLink}>
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
              <Mail size={14} />
              <span>hello@psonkarventures.com</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={14} />
              <span>+91 XXXXX XXXXX</span>
            </div>
            <div className={styles.contactItem}>
              <MapPin size={14} />
              <span>Bangalore, Karnataka, India</span>
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
