import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { getSession, resetPassword, supabase } from '@/api';
import styles from './adminpanel.module.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('Checking your reset link…');

  useEffect(() => {
    let active = true;
    getSession().then((result) => {
      if (!active) return;
      if (result?.data?.session) {
        setReady(true);
        setMessage('');
      } else {
        setMessage('This password-reset link is invalid or has expired. Request a new one from the admin sign-in page.');
      }
    });
    const { data: listener } = supabase?.auth.onAuthStateChange((event, session) => {
      if (active && (event === 'PASSWORD_RECOVERY' || session)) {
        setReady(true);
        setMessage('');
      }
    }) || {};
    return () => {
      active = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (password.length < 8) return setMessage('Use a password of at least 8 characters.');
    if (password !== confirmPassword) return setMessage('The passwords do not match.');
    setBusy(true);
    setMessage('');
    try {
      await resetPassword(password);
      setMessage('Password updated. Redirecting to admin sign-in…');
      window.setTimeout(() => window.location.replace(`${window.location.origin}${window.location.pathname}#/admin`), 700);
    } catch (error) {
      setMessage(error.message || 'Could not reset the password. Request a new reset link and try again.');
    } finally {
      setBusy(false);
    }
  }

  return <main className={styles.authPage}>
    <div className={styles.authPanel}>
      <p className={styles.kicker}>HOUSE OF VENTURES</p>
      <h1>Set a new password.</h1>
      <p className={styles.authIntro}>Choose a secure password for your admin account.</p>
      {ready && <form onSubmit={handleSubmit} className={styles.authForm}>
        <label>New password<input required minLength="8" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <label>Confirm new password<input required minLength="8" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
        <button className={styles.primaryButton} disabled={busy}>{busy ? 'Saving…' : 'Save new password'} <ArrowUpRight size={17} /></button>
      </form>}
      {message && <p className={styles.message} role="status">{message}</p>}
    </div>
    <div className={styles.authAside}><span>ACCOUNT RECOVERY</span><h2>Get back to work.</h2></div>
  </main>;
}
