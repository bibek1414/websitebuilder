import React from "react";
import { ChevronRight } from "lucide-react";

// Utility function for className concatenation
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(" ");
};

interface GridOptions {
  angle?: number;
  cellSize?: number;
  opacity?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

// Fix: Use GridOptions directly instead of empty interface extension
const RetroGrid: React.FC<GridOptions> = ({
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  primaryColor = "#3b82f6", // Blue-500
  secondaryColor = "#6366f1", // Indigo-500
}) => {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--primary-color": primaryColor,
    "--secondary-color": secondaryColor,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
        `opacity-[var(--opacity)]`
      )}
      style={gridStyles}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className="animate-grid [background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:200vw]"
          style={{
            backgroundImage: `linear-gradient(to right, var(--primary-color) 1px, transparent 0), linear-gradient(to bottom, var(--primary-color) 1px, transparent 0)`,
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-gray-900" />
    </div>
  );
};

interface SubtitleProps {
  regular: string;
  gradient: string;
}

interface BottomImageProps {
  light: string;
  dark: string;
}

interface ColorScheme {
  primary: string;
  secondary: string;
  accent?: string;
}

interface HeroSectionProps {
  className?: string;
  title?: string;
  subtitle?: SubtitleProps;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  bottomImage?: BottomImageProps;
  gridOptions?: GridOptions;
  colors?: ColorScheme;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  className,
  title = "Build products for everyone",
  subtitle = {
    regular: "Designing your projects faster with ",
    gradient: "the largest figma UI kit.",
  },
  description = "Sed ut perspiciatis unde omnis iste natus voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.",
  ctaText = "Browse courses",
  ctaHref = "#",
  bottomImage = {
    light: "https://farmui.vercel.app/dashboard-light.png",
    dark: "https://farmui.vercel.app/dashboard.png",
  },
  gridOptions,
  colors = {
    primary: "#3b82f6", // Blue-500
    secondary: "#6366f1", // Indigo-500
    accent: "#8b5cf6", // Violet-500
  },
}) => {
  const colorStyles = {
    "--primary": colors.primary,
    "--secondary": colors.secondary,
    "--accent": colors.accent || colors.secondary,
  } as React.CSSProperties;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={colorStyles}
    >
      {/* Background gradient using primary color */}
      <div
        className="absolute top-0 z-[0] h-screen w-full opacity-10"
        style={{
          background: `radial-gradient(ellipse 20% 80% at 50% -20%, ${colors.primary}40, transparent)`,
        }}
      />

      <section className="relative max-w-full mx-auto z-1">
        <RetroGrid
          {...gridOptions}
          primaryColor={colors.primary}
          secondaryColor={colors.secondary}
        />

        <div className="max-w-screen-xl z-10 mx-auto px-4 py-28 gap-12 md:px-8">
          <div className="space-y-5 max-w-3xl leading-0 lg:leading-5 mx-auto text-center">
            {/* Title badge with primary color */}
            <h1 className="text-sm text-gray-700 dark:text-gray-300 group font-medium mx-auto px-5 py-2 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-3xl w-fit shadow-sm">
              {title}
              <ChevronRight
                className="inline w-4 h-4 ml-2 group-hover:translate-x-1 duration-300"
                style={{ color: colors.primary }}
              />
            </h1>

            {/* Main heading with gradient */}
            <h2 className="text-4xl tracking-tighter font-bold mx-auto md:text-6xl text-gray-900 dark:text-white">
              {subtitle.regular}
              <br />
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                {subtitle.gradient}
              </span>
            </h2>

            {/* CTA Button with primary/secondary gradient */}
            <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
              <span className="relative inline-block overflow-hidden rounded-full p-[2px]">
                <span
                  className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite]"
                  style={{
                    background: `conic-gradient(from 90deg at 50% 50%, ${colors.primary}, ${colors.secondary}, ${colors.primary})`,
                  }}
                />
                <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white dark:bg-gray-900 text-sm font-medium backdrop-blur-3xl">
                  <a
                    href={ctaHref}
                    className="inline-flex rounded-full text-center group items-center w-full justify-center text-white font-medium border-0 hover:opacity-90 transition-all sm:w-auto py-4 px-10"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                  >
                    {ctaText}
                  </a>
                </div>
              </span>
            </div>
          </div>

          {/* Bottom image */}
          {bottomImage && (
            <div className="mt-32 mx-4 md:mx-10 relative z-10">
              <img
                src={bottomImage.light}
                className="w-full shadow-2xl rounded-lg border border-gray-200 dark:hidden"
                alt="Dashboard preview"
              />
              <img
                src={bottomImage.dark}
                className="hidden w-full shadow-2xl rounded-lg border border-gray-700 dark:block"
                alt="Dashboard preview"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
