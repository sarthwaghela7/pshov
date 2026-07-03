import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ventures | P.Sonkar House Of Ventures Portfolio, Bangalore',
  description:
    'Explore the ventures I am building and the services I collaborate on through P.Sonkar House Of Ventures. Everything here is a work in progress, being built with full intent.',
  keywords: [
    'P.Sonkar ventures portfolio',
    'Pratap Sonkar startups Bangalore',
    'in-house ventures Bangalore',
    'collaborated services ecosystem',
  ],
};

export default function VenturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
