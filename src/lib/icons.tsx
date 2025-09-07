import { Github, Linkedin, Twitter, Link as LinkIcon, Mail, User, Dribbble, Instagram, Youtube } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { FC } from 'react';

export const Icons: { [key: string]: FC<LucideProps> } = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  portfolio: User,
  email: Mail,
  dribbble: Dribbble,
  instagram: Instagram,
  youtube: Youtube,
  default: LinkIcon,
};

export const getIconForLabel = (label: string): FC<LucideProps> => {
  const normalizedLabel = label.toLowerCase();
  for (const key in Icons) {
    if (normalizedLabel.includes(key)) {
      return Icons[key];
    }
  }
  return Icons.default;
};
