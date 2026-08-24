import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileTabBar from '@/components/layout/MobileTabBar';
import PageTransition from '@/components/layout/PageTransition';
import SmoothScroll from '@/components/layout/SmoothScroll';
import HomePage from '@/app/page.jsx';
import AboutPage from '@/app/about/page.jsx';
import VenturesPage from '@/app/ventures/page.jsx';
import ContactPage from '@/app/contact/page.jsx';
import AdminPanel from '@/adminpanel';

const pageTitles = {
  '/': 'Pratap Sonkar | P.Sonkar House Of Ventures, Bangalore',
  '/about': 'About | P.Sonkar House Of Ventures',
  '/ventures': 'Ventures | P.Sonkar House Of Ventures',
  '/services': 'Services | P.Sonkar House Of Ventures',
  '/contact': 'Get Involved | P.Sonkar House Of Ventures',
};

function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = pageTitles[pathname] || pageTitles['/'];
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isAdmin = window.location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <><PageTitle /><Routes><Route path="/admin" element={<AdminPanel />} /><Route path="*" element={<Navigate to="/admin" replace />} /></Routes></>;
  }

  return (
    <SmoothScroll>
      <PageTitle />
      <Header />
      <main className="publicMain">
        <PageTransition
          renderPage={(pageLocation) => (
            <Routes location={pageLocation}>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/ventures" element={<VenturesPage />} />
              <Route path="/services" element={<VenturesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        />
      </main>
      <Footer />
      <MobileTabBar />
    </SmoothScroll>
  );
}