// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { NavigationLinks, NavLink } from "./navigation-link";
// import { ActionButtons, ActionButton } from "./action-buttons";
// import { MobileMenu } from "./mobile-menu";
// import { Menu } from "lucide-react";

// interface NavbarProps {
//   logoText?: string;
//   logoUrl?: string;
//   links?: NavLink[];
//   buttons?: ActionButton[];
//   isEditable?: boolean;
//   onUpdate?: (componentId: string, newContent: any) => void;
//   onRemove?: (componentId: string) => void;
//   componentId?: string;
// }

// export function Navbar({
//   logoText = "Brand",
//   logoUrl = "",
//   links = [
//     { id: "1", text: "Home", href: "#" },
//     { id: "2", text: "About", href: "#about" },
//     { id: "3", text: "Services", href: "#services" },
//     { id: "4", text: "Contact", href: "#contact" },
//   ],
//   buttons = [
//     { id: "1", text: "Login", variant: "outline", href: "#login" },
//     { id: "2", text: "Sign Up", variant: "primary", href: "#signup" },
//   ],
//   isEditable = false,
//   onUpdate,
//   onRemove,
//   componentId = "navbar",
// }: NavbarProps) {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [currentLinks, setCurrentLinks] = useState(links);
//   const [currentButtons, setCurrentButtons] = useState(buttons);
//   const [currentLogoText, setCurrentLogoText] = useState(logoText);
//   const [currentLogoUrl, setCurrentLogoUrl] = useState(logoUrl);

//   const updateComponent = (newData: any) => {
//     if (onUpdate) {
//       onUpdate(componentId, newData);
//     }
//   };

//   const handleLogoUpdate = ({
//     logoText: newLogoText,
//     logoUrl: newLogoUrl,
//   }: {
//     logoText?: string;
//     logoUrl?: string;
//   }) => {
//     if (newLogoText !== undefined) setCurrentLogoText(newLogoText);
//     if (newLogoUrl !== undefined) setCurrentLogoUrl(newLogoUrl);

//     updateComponent({
//       links: currentLinks,
//       buttons: currentButtons,
//       logoText: newLogoText !== undefined ? newLogoText : currentLogoText,
//       logoUrl: newLogoUrl !== undefined ? newLogoUrl : currentLogoUrl,
//     });
//   };

//   const handleAddLink = () => {
//     const newLink = {
//       id: Date.now().toString(),
//       text: "New Link",
//       href: "#",
//     };
//     const updatedLinks = [...currentLinks, newLink];
//     setCurrentLinks(updatedLinks);
//     updateComponent({
//       links: updatedLinks,
//       buttons: currentButtons,
//       logoText: currentLogoText,
//       logoUrl: currentLogoUrl,
//     });
//   };

//   const handleUpdateLink = (
//     linkId: string,
//     newText: string,
//     newHref?: string
//   ) => {
//     const updatedLinks = currentLinks.map((link) =>
//       link.id === linkId
//         ? { ...link, text: newText, href: newHref || link.href }
//         : link
//     );
//     setCurrentLinks(updatedLinks);
//     updateComponent({
//       links: updatedLinks,
//       buttons: currentButtons,
//       logoText: currentLogoText,
//       logoUrl: currentLogoUrl,
//     });
//   };

//   const handleRemoveLink = (linkId: string) => {
//     const updatedLinks = currentLinks.filter((link) => link.id !== linkId);
//     setCurrentLinks(updatedLinks);
//     updateComponent({
//       links: updatedLinks,
//       buttons: currentButtons,
//       logoText: currentLogoText,
//       logoUrl: currentLogoUrl,
//     });
//   };

//   const handleAddButton = () => {
//     const newButton = {
//       id: Date.now().toString(),
//       text: "New Button",
//       variant: "primary" as const,
//       href: "#",
//     };
//     const updatedButtons = [...currentButtons, newButton];
//     setCurrentButtons(updatedButtons);
//     updateComponent({
//       links: currentLinks,
//       buttons: updatedButtons,
//       logoText: currentLogoText,
//       logoUrl: currentLogoUrl,
//     });
//   };

//   const handleUpdateButton = (
//     buttonId: string,
//     newText: string,
//     newVariant: string,
//     newHref?: string
//   ) => {
//     const updatedButtons = currentButtons.map((button) =>
//       button.id === buttonId
//         ? {
//             ...button,
//             text: newText,
//             variant: newVariant as any,
//             href: newHref || button.href,
//           }
//         : button
//     );
//     setCurrentButtons(updatedButtons);
//     updateComponent({
//       links: currentLinks,
//       buttons: updatedButtons,
//       logoText: currentLogoText,
//       logoUrl: currentLogoUrl,
//     });
//   };

//   const handleRemoveButton = (buttonId: string) => {
//     const updatedButtons = currentButtons.filter(
//       (button) => button.id !== buttonId
//     );
//     setCurrentButtons(updatedButtons);
//     updateComponent({
//       links: currentLinks,
//       buttons: updatedButtons,
//       logoText: currentLogoText,
//       logoUrl: currentLogoUrl,
//     });
//   };

//   return (
//     <div
//       className={
//         isEditable ? "relative border-2 border-dashed border-border m-2" : ""
//       }
//     >
//       <nav className="bg-primary shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Desktop Navigation Links - Center */}
//             <div className=" md:block flex-1 flex justify-center">
//               <NavigationLinks
//                 links={currentLinks}
//                 isEditable={isEditable}
//                 onAddLink={handleAddLink}
//                 onUpdateLink={handleUpdateLink}
//                 onRemoveLink={handleRemoveLink}
//               />
//             </div>

//             {/* Action Buttons - Right */}
//             <div className="hidden md:block">
//               <ActionButtons
//                 buttons={currentButtons}
//                 isEditable={isEditable}
//                 onAddButton={handleAddButton}
//                 onUpdateButton={handleUpdateButton}
//                 onRemoveButton={handleRemoveButton}
//               />
//             </div>

//             {/* Mobile menu button */}
//             <div className="md:hidden">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 className="text-primary-foreground hover:text-muted-foreground hover:bg-primary/90"
//               >
//                 <Menu className="h-6 w-6" />
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <MobileMenu
//           isOpen={mobileMenuOpen}
//           links={currentLinks}
//           buttons={currentButtons}
//           onClose={() => setMobileMenuOpen(false)}
//         />
//       </nav>

//       {/* Remove button for editable mode */}
//       {isEditable && onRemove && (
//         <Button
//           variant="destructive"
//           size="sm"
//           onClick={() => onRemove(componentId)}
//           className="absolute top-1 right-1 rounded-full w-6 h-6 opacity-75 hover:opacity-100 transition-opacity z-10 flex items-center justify-center p-0 min-w-0"
//         >
//           ×
//         </Button>
//       )}
//     </div>
//   );
// }
