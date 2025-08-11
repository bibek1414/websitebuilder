import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { X, GripVertical, Users } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Navbar1 } from "./navbar/navbar-1";
import { Navbar2 } from "./navbar/navbar-2";
import { Navbar3 } from "./navbar/navbar-3";
import { Hero, HeroData } from "./hero/hero";
import { Hero2, Hero2Data, defaultHero2Data } from "./hero/hero-2";
import { Footer } from "./footer/footer";
import { FooterData } from "@/types/footer";
import { Facebook, Twitter } from "lucide-react";
import { ProductsList } from "./products/product-list";
import { ProductsData } from "@/types/product";
import {
  AboutUs1,
  AboutUs1Data,
  defaultAboutUs1Data,
} from "./about/about-us-1";
import {
  AboutUs2,
  AboutUs2Data,
  defaultAboutUs2Data,
} from "./about/about-us-2";
export interface Component {
  id: string;
  type: string;
  style?: string;
  content: string;
  navbarData?: {
    logoText?: string;
    links?: Array<{ id: string; text: string; href?: string }>;
    buttons?: Array<{
      id: string;
      text: string;
      variant: "primary" | "secondary" | "outline";
      href?: string;
    }>;
  };
  heroData?: HeroData;
  hero2Data?: Hero2Data;
  aboutUs1Data?: AboutUs1Data;
  aboutUs2Data?: AboutUs2Data;
  footerData?: FooterData;
  productsData?: ProductsData;
}

interface NavbarUpdateData {
  navbarData: {
    logoText: string;
    links: Array<{ id: string; text: string; href?: string }>;
    buttons: Array<{
      id: string;
      text: string;
      variant: "primary" | "secondary" | "outline";
      href?: string;
    }>;
  };
}

interface HeroUpdateData {
  heroData: HeroData;
}

interface FooterUpdateData {
  footerData: FooterData;
}

interface TextUpdateData {
  content: string;
}

interface Hero2UpdateData {
  hero2Data: Hero2Data;
}

interface ProductsUpdateData {
  productsData: ProductsData;
}
interface AboutUs1UpdateData {
  aboutUs1Data: AboutUs1Data;
}
interface AboutUs2UpdateData {
  aboutUs2Data: AboutUs2Data;
}
export type ComponentUpdateData =
  | NavbarUpdateData
  | HeroUpdateData
  | Hero2UpdateData
  | FooterUpdateData
  | TextUpdateData
  | AboutUs1UpdateData
  | AboutUs2UpdateData
  | ProductsUpdateData;

interface ComponentRendererProps {
  component: Component;
  isPreview?: boolean;
  siteId?: string;
  onUpdate?: (componentId: string, newContent: ComponentUpdateData) => void;
  onRemove?: (componentId: string) => void;
}

const SortableWrapper = ({
  id,
  onRemove,
  children,
}: {
  id: string;
  onRemove: () => void;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group p-2">
      {children}
      <Button
        variant="destructive"
        size="icon"
        onClick={onRemove}
        className="absolute top-4 right-4 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-30"
      >
        <X className="h-3 w-3" />
      </Button>
      <div
        {...attributes}
        {...listeners}
        className="absolute top-4 left-4 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-30 cursor-grab"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
};

export function ComponentRenderer({
  component,
  isPreview = false,
  siteId,
  onUpdate,
  onRemove,
}: ComponentRendererProps) {
  const handleContentChange = (newContent: string) => {
    onUpdate?.(component.id, { content: newContent } as TextUpdateData);
  };

  const handleNavbarUpdate = (
    componentId: string,
    newNavbarData: NavbarUpdateData
  ) => {
    onUpdate?.(componentId, newNavbarData);
  };

  const handleHeroUpdate = (
    componentId: string,
    newHeroData: HeroUpdateData
  ) => {
    onUpdate?.(componentId, newHeroData);
  };
  const handleHero2Update = (
    componentId: string,
    newHero2Data: Hero2UpdateData
  ) => {
    onUpdate?.(componentId, newHero2Data);
  };
  const handleFooterUpdate = (
    componentId: string,
    newFooterData: FooterUpdateData
  ) => {
    onUpdate?.(componentId, newFooterData);
  };
  const handleAboutUs1Update = (
    componentId: string,
    newData: { aboutUs1Data: AboutUs1Data }
  ) => {
    onUpdate?.(componentId, newData);
  };

  const handleAboutUs2Update = (
    componentId: string,
    newData: { aboutUs2Data: AboutUs2Data }
  ) => {
    onUpdate?.(componentId, newData);
  };

  const handleRemove = () => {
    onRemove?.(component.id);
  };

  const renderComponent = () => {
    switch (component.type) {
      case "navbar":
        const navbarProps = {
          logoText: component.navbarData?.logoText || "Brand",
          links: component.navbarData?.links || [],
          buttons: component.navbarData?.buttons || [],
          isEditable: !isPreview,
          onUpdate: handleNavbarUpdate,
          componentId: component.id,
        };
        switch (component.style) {
          case "style-2":
            return <Navbar2 {...navbarProps} />;
          case "style-3":
            return <Navbar3 {...navbarProps} />;
          case "style-1":
          default:
            return <Navbar1 {...navbarProps} />;
        }

      case "hero":
        switch (component.style) {
          case "style-2":
            return (
              <Hero2
                heroData={component.hero2Data || defaultHero2Data}
                isEditable={!isPreview}
                onUpdate={handleHero2Update}
                componentId={component.id}
              />
            );
          case "style-1":
          default:
            const defaultHeroData: HeroData = {
              title: "Welcome to Our Amazing Platform",
              subtitle: "Build Something Great",
              description:
                "Create beautiful, responsive websites with our intuitive drag-and-drop builder. No coding required.",
              layout: "center",
              backgroundType: "gradient",
              backgroundColor: "primary",
              gradientFrom: "primary",
              gradientTo: "secondary",
              textColor: "primary-foreground",
              buttons: [
                { id: "1", text: "Get Started", variant: "primary", href: "#" },
                { id: "2", text: "Learn More", variant: "outline", href: "#" },
              ],
              showImage: false,
              imageUrl: "",
              imageAlt: "Hero image",
            };

            return (
              <Hero
                heroData={component.heroData || defaultHeroData}
                isEditable={!isPreview}
                onUpdate={handleHeroUpdate}
                componentId={component.id}
              />
            );
        }

      case "footer":
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
          ],
          socialLinks: [
            { id: "1", platform: "Facebook", href: "#", icon: Facebook },
            { id: "2", platform: "Twitter", href: "#", icon: Twitter },
          ],
          contactInfo: {
            email: "hello@company.com",
            phone: "+1 (555) 123-4567",
            address: "123 Business St, City, State 12345",
          },
          newsletter: {
            enabled: true,
            title: "Stay Updated",
            description:
              "Subscribe to our newsletter for the latest updates and news.",
          },
          copyright: "© 2025 Your Company. All rights reserved.",
        };

        return (
          <Footer
            footerData={component.footerData || defaultFooterData}
            style={component.style as "style-1" | "style-2"}
            isEditable={!isPreview}
            onUpdate={handleFooterUpdate}
            componentId={component.id}
          />
        );

      case "products":
        return (
          <ProductsList
            component={component}
            isPreview={isPreview}
            onUpdate={onUpdate}
            siteId={siteId}
          />
        );
      case "about-us":
        switch (component.style) {
          case "style-2":
            return (
              <AboutUs2
                data={component.aboutUs2Data || defaultAboutUs2Data}
                isEditable={!isPreview}
                onUpdate={handleAboutUs2Update}
                componentId={component.id}
              />
            );
          case "style-1":
          default:
            return (
              <AboutUs1
                data={component.aboutUs1Data || defaultAboutUs1Data}
                isEditable={!isPreview}
                onUpdate={handleAboutUs1Update}
                componentId={component.id}
              />
            );
        }
      case "text":
        if (isPreview) {
          return (
            <div className="py-8">
              <div className="container px-4 max-w-7xl mx-auto">
                <p className="text-foreground leading-relaxed">
                  {component.content}
                </p>
              </div>
            </div>
          );
        }
        return (
          <Card className="bg-accent p-4">
            <Textarea
              value={component.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="bg-transparent border-none w-full resize-none shadow-none focus-visible:ring-0"
              placeholder="Enter your text content"
            />
          </Card>
        );

      default:
        return (
          <Card className="bg-muted p-4">
            <span className="text-muted-foreground">{component.content}</span>
          </Card>
        );
    }
  };

  if (isPreview) {
    return renderComponent();
  }

  return (
    <SortableWrapper id={component.id} onRemove={handleRemove}>
      {renderComponent()}
    </SortableWrapper>
  );
}
