export type Venture = {
  id: string;
  name: string;
  description: string;
  image: string;
  websiteUrl?: string;
  redirectEnabled: boolean;
};

export type CollaboratedService = {
  id: string;
  name: string;
  description: string;
  image: string;
  customWhatsapp?: string;
};

export const siteSettings = {
  primaryWhatsapp: "+919876543210", // Placeholder
  primaryEmail: "hello@psonkarventures.com", // Placeholder
  linkedinUrl: "https://linkedin.com/in/pratapsonkar", // Placeholder
  instagramHandle: "psonkarventures",
  twitterHandle: "pratapsonkar",
  footerLegalYear: new Date().getFullYear(),
};

export const inHouseVentures: Venture[] = [
  {
    id: "impactshaala",
    name: "Impactshaala",
    description: "A career growth platform where individuals can discover real-world exposures, upskill, and find work that genuinely fits who they are, all in one place.",
    image: "/images/ventures/impactshaala.png",
    redirectEnabled: false,
  },
  {
    id: "guideshaala",
    name: "Guideshaala",
    description: "An AI-powered career counselling platform that uses assessments to build a personalised career roadmap for students and working professionals.",
    image: "/images/ventures/guideshaala.png",
    redirectEnabled: false,
  },
  {
    id: "rise-for-change",
    name: "Rise For Change",
    description: "A youth-led NGO working on health, quality education, and youth leadership, aligned with the UN Sustainable Development Goals.",
    image: "/images/ventures/rise-for-change.png",
    redirectEnabled: false,
  },
  {
    id: "printer-cartridge-wala",
    name: "Printer Cartridge Wala",
    description: "A B2B printer consumables and maintenance business offering cartridge refilling, compatible sales, and AMC contracts to corporates and institutions at significantly lower cost.",
    image: "/images/ventures/printer-cartridge.png",
    redirectEnabled: false,
  },
  {
    id: "laptopwale",
    name: "LaptopWale.com",
    description: "A B2B business supplying quality-checked, warranty-backed refurbished laptops and desktops to corporates, startups, and institutions at a fraction of new device cost.",
    image: "/images/ventures/laptopwale.png",
    redirectEnabled: false,
  },
  {
    id: "evntra",
    name: "Evntra",
    description: "An event services marketplace to discover and book verified vendors across decoration, catering, entertainment, photography, venues, and equipment, or hand the entire event over to us.",
    image: "/images/ventures/evntra.png",
    redirectEnabled: false,
  },
  {
    id: "whole-community",
    name: "W.H.O.L.E Community",
    description: "A community for people rebuilding their sense of self after hard setbacks. A structured journey alongside others on the same road. Within. Heal. Own. Lead. Evolve.",
    image: "/images/ventures/whole-community.png",
    redirectEnabled: false,
  }
];

export const collaboratedServices: CollaboratedService[] = [
  // Placeholder data for Collaborated Services (can be populated later)
  {
    id: "collab-service-1",
    name: "Digital Marketing Solutions",
    description: "End-to-end digital marketing and brand strategy for growing businesses.",
    image: "/images/services/digital-marketing.png"
  },
  {
    id: "collab-service-2",
    name: "Legal & Compliance",
    description: "Company registration, legal compliance, and tax consultation for startups.",
    image: "/images/services/legal.png"
  }
];

export const homepageFeaturedVentures = ["impactshaala", "guideshaala", "rise-for-change"];
