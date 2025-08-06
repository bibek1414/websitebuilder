import React, { useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { FooterStyle1 } from "./footer-style1";
import { FooterStyle2 } from "./footer-style2";
import { FooterEditorDialog } from "./footer-editor-dialog";
import { FooterData, FooterProps } from "@/types/footer";

const defaultFooterData: FooterData = {
  companyName: "Your Company",
  description:
    "Building amazing experiences for our customers with innovative solutions and exceptional service.",
  sections: [
    {
      id: "1",
      title: "Company",
      links: [
        { id: "1", text: "About Us", href: "#about" },
        { id: "2", text: "Our Team", href: "#team" },
        { id: "3", text: "Careers", href: "#careers" },
        { id: "4", text: "Contact", href: "#contact" },
      ],
    },
    {
      id: "2",
      title: "Services",
      links: [
        { id: "1", text: "Web Design", href: "#web-design" },
        { id: "2", text: "Development", href: "#development" },
        { id: "3", text: "Consulting", href: "#consulting" },
        { id: "4", text: "Support", href: "#support" },
      ],
    },
    {
      id: "3",
      title: "Resources",
      links: [
        { id: "1", text: "Documentation", href: "#docs" },
        { id: "2", text: "Help Center", href: "#help" },
        { id: "3", text: "Privacy Policy", href: "#privacy" },
        { id: "4", text: "Terms of Service", href: "#terms" },
      ],
    },
  ],
  socialLinks: [
    { id: "1", platform: "Facebook", href: "#", icon: Facebook },
    { id: "2", platform: "Twitter", href: "#", icon: Twitter },
    { id: "3", platform: "Instagram", href: "#", icon: Instagram },
    { id: "4", platform: "LinkedIn", href: "#", icon: Linkedin },
  ],
  contactInfo: {
    email: "hello@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, State 12345",
  },
  newsletter: {
    enabled: true,
    title: "Stay Updated",
    description: "Subscribe to our newsletter for the latest updates and news.",
  },
  copyright: "© 2024 Your Company. All rights reserved.",
};

export function Footer({
  footerData = defaultFooterData,
  style = "style-1",
  isEditable = false,
  onUpdate,
  componentId = "footer",
}: FooterProps) {
  const [currentFooterData, setCurrentFooterData] = useState(footerData);
  const [showEditor, setShowEditor] = useState(false);

  const updateComponent = (newData: FooterData) => {
    setCurrentFooterData(newData);
    onUpdate?.(componentId, { footerData: newData });
  };

  const handleEditClick = () => {
    setShowEditor(true);
  };

  const FooterComponent = style === "style-2" ? FooterStyle2 : FooterStyle1;

  return (
    <>
      <FooterComponent
        footerData={currentFooterData}
        isEditable={isEditable}
        onEditClick={handleEditClick}
      />
      {isEditable && (
        <FooterEditorDialog
          open={showEditor}
          onOpenChange={setShowEditor}
          footerData={currentFooterData}
          onSave={updateComponent}
        />
      )}
    </>
  );
}