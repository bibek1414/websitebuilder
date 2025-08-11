export const envConfig = {
  // Base domain (e.g., localhost:3000 or yourdomain.com)
  baseDomain: process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost:3000',
  
  // Protocol (http or https)
  protocol: process.env.NEXT_PUBLIC_PROTOCOL || 'http',
  
  // Enable subdomain routing
  enableSubdomainRouting: process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING === 'true',
  
  // API URL if you have a separate backend
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
};

// Helper functions
export const buildSiteUrl = (siteSlug: string, path: string = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (envConfig.enableSubdomainRouting) {
    // For subdomain routing: sitename.domain.com/path
    const baseUrl = `${envConfig.protocol}://${siteSlug}.${envConfig.baseDomain}`;
    return path ? `${baseUrl}${cleanPath}` : baseUrl;
  } else {
    // Fallback to query parameter routing: domain.com/preview?site=sitename&path=path
    const baseUrl = `${envConfig.protocol}://${envConfig.baseDomain}`;
    if (path && path !== '/') {
      return `${baseUrl}/preview?site=${siteSlug}&page=${encodeURIComponent(cleanPath.slice(1))}`;
    }
    return `${baseUrl}/preview?site=${siteSlug}`;
  }
};

export const buildBuilderUrl = (siteSlug: string) => {
  if (envConfig.enableSubdomainRouting) {
    return `${envConfig.protocol}://${siteSlug}.${envConfig.baseDomain}/builder`;
  } else {
    // For fallback, you'd need to pass additional parameters
    // This would require modifications to your existing builder route
    return `${envConfig.protocol}://${envConfig.baseDomain}/builder?site=${siteSlug}`;
  }
};

export const getMainSiteUrl = () => {
  return `${envConfig.protocol}://${envConfig.baseDomain}`;
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const isLocalhost = () => {
  return envConfig.baseDomain.includes('localhost');
};

// Helper to create URL-friendly slug from site name
export const createSiteSlug = (siteName: string): string => {
  return siteName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 50); // Limit length for practical subdomain usage
};

// Helper to validate subdomain
export const isValidSubdomain = (subdomain: string): boolean => {
  // Basic subdomain validation
  const subdomainRegex = /^[a-z0-9]([a-z0-9-]{0,48}[a-z0-9])?$/;
  return subdomainRegex.test(subdomain);
};

// Helper to get current subdomain
export const getCurrentSubdomain = (): string | null => {
  if (typeof window === "undefined" || !envConfig.enableSubdomainRouting) {
    return null;
  }

  const hostname = window.location.hostname;
  const baseDomain = envConfig.baseDomain;
  
  if (hostname.endsWith(`.${baseDomain}`) && hostname !== baseDomain) {
    return hostname.replace(`.${baseDomain}`, '');
  }
  
  return null;
};