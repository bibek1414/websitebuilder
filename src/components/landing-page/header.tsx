import React from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const Header: React.FC = () => {
  const handleGetStarted = () => {
    window.location.href = "/signup";
  };

  const handleSignIn = () => {
    window.location.href = "/login";
  };

  return (
    <header className="relative z-50 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-primary/10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Nepdora Logo" className="h-10" />
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {["Features", "Templates", "Pricing", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer font-medium"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleSignIn}
            className="text-muted-foreground hover:text-primary"
          >
            Sign In
          </Button>
          <Button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get Started Free
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
