import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Pratap Sonkar | Founder, P.Sonkar House Of Ventures, Bangalore',
  description:
    'I am Pratap Sonkar, founder of P.Sonkar House Of Ventures. Here is my story, how I work, and what drives the ventures I build in Bangalore.',
  keywords: [
    'Pratap Sonkar founder',
    'about Pratap Sonkar',
    'P.Sonkar ventures Bangalore',
    'venture builder India Bangalore',
  ],
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
