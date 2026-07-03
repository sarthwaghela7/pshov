import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Involved | Invest, Work, or Grow With P.Sonkar House Of Ventures, Bangalore',
  description:
    'Want to invest in a venture, join a team, or grow your business with my ecosystem? Tell me what you are looking for and I will take it from there.',
  keywords: [
    'invest in startups Bangalore',
    'startup internships Bangalore',
    'business growth partner Bangalore',
    'P.Sonkar ventures get involved',
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
