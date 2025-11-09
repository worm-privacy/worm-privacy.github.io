import { ReactNode } from 'react';

export type Roadmap = {
  title: string;
  deadline: string;
  description: string;
  status: 'active' | 'passed' | 'not-yet';
};

export type TeamMemberInfo = {
  id: number;
  fullName: string;
  positions: string[];
  avatar: {
    src: string;
    size: number;
    position: {
      left: number;
      top: number;
    };
  };
  socials: { link: string; logo: string; label: string }[];
};

export type HowItWorksContent = {
  order: number;
  title: string;
  description: string;
  color: string;
  action?: ReactNode;
};

export type TokenomicsContent = {
  title: string;
  stats: {
    share: number;
    label: string;
  }[];
};

export type SocialMedia = {
  link: string;
  logo: string;
};
