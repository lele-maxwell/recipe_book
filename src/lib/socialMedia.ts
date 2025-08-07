// Social Media Integration Utilities
// Handles URL validation, platform recognition, and username extraction

export type SocialMediaPlatform = 
  | 'youtube' 
  | 'tiktok' 
  | 'instagram' 
  | 'telegram' 
  | 'facebook' 
  | 'twitter' 
  | 'website';

export interface SocialMediaLink {
  id?: string;
  platform: SocialMediaPlatform;
  url: string;
  username?: string;
  verified?: boolean;
  clickCount?: number;
}

// Platform validation patterns
const PLATFORM_PATTERNS: Record<SocialMediaPlatform, RegExp> = {
  youtube: /^https?:\/\/(www\.)?(youtube\.com\/(channel\/|user\/|c\/|@)|youtu\.be\/)/i,
  tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+/i,
  instagram: /^https?:\/\/(www\.)?instagram\.com\/[\w.-]+/i,
  telegram: /^https?:\/\/(www\.)?t\.me\/[\w.-]+/i,
  facebook: /^https?:\/\/(www\.)?facebook\.com\/[\w.-]+/i,
  twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[\w.-]+/i,
  website: /^https?:\/\/[\w.-]+\.[a-z]{2,}/i
};

// Username extraction patterns
const USERNAME_PATTERNS: Record<SocialMediaPlatform, RegExp> = {
  youtube: /(?:youtube\.com\/(?:channel\/|user\/|c\/|@)|youtu\.be\/)([^/?]+)/i,
  tiktok: /tiktok\.com\/@([^/?]+)/i,
  instagram: /instagram\.com\/([^/?]+)/i,
  telegram: /t\.me\/([^/?]+)/i,
  facebook: /facebook\.com\/([^/?]+)/i,
  twitter: /(?:twitter\.com|x\.com)\/([^/?]+)/i,
  website: /https?:\/\/([\w.-]+)/i
};

// Platform display names
export const PLATFORM_NAMES: Record<SocialMediaPlatform, string> = {
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  telegram: 'Telegram',
  facebook: 'Facebook',
  twitter: 'Twitter/X',
  website: 'Website'
};

// Platform colors for UI
export const PLATFORM_COLORS: Record<SocialMediaPlatform, string> = {
  youtube: '#FF0000',
  tiktok: '#000000',
  instagram: '#E4405F',
  telegram: '#0088CC',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  website: '#6B7280'
};

/**
 * Validates if a URL matches a specific platform pattern
 */
export function validatePlatformUrl(platform: SocialMediaPlatform, url: string): boolean {
  const pattern = PLATFORM_PATTERNS[platform];
  return pattern.test(url);
}

/**
 * Detects the platform from a URL
 */
export function detectPlatform(url: string): SocialMediaPlatform | null {
  for (const [platform, pattern] of Object.entries(PLATFORM_PATTERNS)) {
    if (pattern.test(url)) {
      return platform as SocialMediaPlatform;
    }
  }
  return null;
}

/**
 * Extracts username/handle from a social media URL
 */
export function extractUsername(platform: SocialMediaPlatform, url: string): string | null {
  const pattern = USERNAME_PATTERNS[platform];
  const match = url.match(pattern);
  return match ? match[1] : null;
}

/**
 * Sanitizes and validates a social media URL
 */
export function sanitizeUrl(url: string): string {
  // Remove whitespace
  url = url.trim();
  
  // Add https:// if no protocol specified
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  
  // Remove trailing slashes
  url = url.replace(/\/+$/, '');
  
  return url;
}

/**
 * Validates if a URL is safe (not malicious)
 */
export function isSafeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Block suspicious protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Block localhost and private IPs
    const hostname = urlObj.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
    ) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Comprehensive validation for social media links
 */
export function validateSocialMediaLink(
  platform: SocialMediaPlatform, 
  url: string
): { isValid: boolean; error?: string; sanitizedUrl?: string; username?: string } {
  // Sanitize URL first
  const sanitizedUrl = sanitizeUrl(url);
  
  // Check if URL is safe
  if (!isSafeUrl(sanitizedUrl)) {
    return { isValid: false, error: 'URL is not safe or valid' };
  }
  
  // Validate platform-specific pattern
  if (!validatePlatformUrl(platform, sanitizedUrl)) {
    return { 
      isValid: false, 
      error: `URL doesn't match ${PLATFORM_NAMES[platform]} format` 
    };
  }
  
  // Extract username
  const username = extractUsername(platform, sanitizedUrl);
  
  return {
    isValid: true,
    sanitizedUrl,
    username: username || undefined
  };
}

/**
 * Get platform icon emoji
 */
export function getPlatformIcon(platform: SocialMediaPlatform): string {
  const icons: Record<SocialMediaPlatform, string> = {
    youtube: '🎥',
    tiktok: '🎵',
    instagram: '📸',
    telegram: '✈️',
    facebook: '👥',
    twitter: '🐦',
    website: '🌐'
  };
  return icons[platform];
}

/**
 * Format display URL for UI (shortened version)
 */
export function formatDisplayUrl(url: string, maxLength: number = 30): string {
  try {
    const urlObj = new URL(url);
    let display = urlObj.hostname + urlObj.pathname;
    
    if (display.length > maxLength) {
      display = display.substring(0, maxLength - 3) + '...';
    }
    
    return display;
  } catch {
    return url.length > maxLength ? url.substring(0, maxLength - 3) + '...' : url;
  }
}

/**
 * Get all supported platforms
 */
export function getSupportedPlatforms(): SocialMediaPlatform[] {
  return Object.keys(PLATFORM_PATTERNS) as SocialMediaPlatform[];
}