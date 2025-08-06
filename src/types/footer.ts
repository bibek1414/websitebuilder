import React from "react";

export interface FooterLink {
  id: string;
  text: string;
  href?: string;
}

export interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  id: string;
  platform: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface FooterData {
  companyName: string;
  description: string;
  sections: FooterSection[];
  socialLinks: SocialLink[];
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  };
  newsletter: {
    enabled: boolean;
    title: string;
    description: string;
  };
  copyright: string;
}

export interface ComponentUpdate {
  footerData: FooterData;
}

export interface FooterProps {
  footerData?: FooterData;
  style?: "style-1" | "style-2";
  isEditable?: boolean;
  onUpdate?: (componentId: string, newContent: ComponentUpdate) => void;
  onRemove?: (componentId: string) => void;
  componentId?: string;
}