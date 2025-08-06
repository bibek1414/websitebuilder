import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  Heart,
  Edit3,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { FooterData, SocialLink } from "@/types/footer";

interface FooterStyle1Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
}

// Icon mapping to resolve serialized icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
};

// Helper function to render social icons with proper fallback
const renderSocialIcon = (social: SocialLink) => {
  // First, try to get the icon from the mapping based on platform name
  const IconFromMap = iconMap[social.platform];
  if (IconFromMap) {
    return <IconFromMap className="h-4 w-4" />;
  }

  // If the icon is a proper React component (function), use it directly
  if (typeof social.icon === "function") {
    const IconComponent = social.icon;
    return <IconComponent className="h-4 w-4" />;
  }

  // Fallback to a default icon if nothing else works
  return <Facebook className="h-4 w-4" />;
};

export function FooterStyle1({
  footerData,
  isEditable,
  onEditClick,
}: FooterStyle1Props) {
  const [email, setEmail] = useState("");

  const handleLinkClick = (href: string | undefined, e: React.MouseEvent) => {
    if (!href) {
      e.preventDefault();
      return;
    }
    if (href.includes("/preview?")) {
      e.preventDefault();
      window.location.href = href;
    }
  };

  return (
    <div className="relative">
      {isEditable && (
        <Button
          onClick={onEditClick}
          variant="secondary"
          size="sm"
          className="absolute top-4 right-4 z-10 opacity-75 hover:opacity-100"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Footer
        </Button>
      )}

      <footer className="bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-foreground mb-4">
                {footerData.companyName}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {footerData.description}
              </p>

              {/* Contact Info */}
              <div className="space-y-2 mb-6">
                {footerData.contactInfo.email && (
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {footerData.contactInfo.email}
                    </span>
                  </div>
                )}
                {footerData.contactInfo.phone && (
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {footerData.contactInfo.phone}
                    </span>
                  </div>
                )}
                {footerData.contactInfo.address && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {footerData.contactInfo.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {footerData.socialLinks.map((social) => (
                  <Button
                    key={social.id}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:bg-accent"
                    onClick={(e) => handleLinkClick(social.href, e)}
                  >
                    {renderSocialIcon(social)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Link Sections */}
            {footerData.sections.map((section) => (
              <div key={section.id}>
                <h4 className="font-semibold text-foreground mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.id}>
                      <button
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left"
                        onClick={(e) => handleLinkClick(link.href, e)}
                      >
                        {link.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          {footerData.newsletter.enabled && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="max-w-md mx-auto text-center">
                <h4 className="font-semibold text-foreground mb-2">
                  {footerData.newsletter.title}
                </h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  {footerData.newsletter.description}
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    disabled={isEditable}
                  />
                  <Button variant="default" disabled={isEditable}>
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
              {footerData.copyright}
              <Heart className="h-3 w-3 text-red-500 inline" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
