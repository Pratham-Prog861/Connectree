// Utility functions for managing profile storage and short URL generation

/**
 * Generate a short hash from a string
 */
export function generateShortHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to base36 and take first 6 characters for a short URL
  return Math.abs(hash).toString(36).substring(0, 6);
}

/**
 * Store a profile with a short hash and return the hash
 */
export function storeProfile(profileJson: string): string {
  if (typeof window === 'undefined') {
    throw new Error('Profile storage is only available in the browser');
  }
  
  // Generate hash from profile content + timestamp for uniqueness
  const timestamp = Date.now().toString();
  const hashInput = profileJson + timestamp;
  const hash = generateShortHash(hashInput);
  
  // Store in localStorage with hash as key
  const storageKey = `profile_${hash}`;
  localStorage.setItem(storageKey, profileJson);
  
  // Also store metadata for cleanup purposes
  const metadataKey = `profile_meta_${hash}`;
  const metadata = {
    created: timestamp,
    lastAccessed: timestamp,
    hash: hash
  };
  localStorage.setItem(metadataKey, JSON.stringify(metadata));
  
  return hash;
}

/**
 * Retrieve a profile by its hash
 */
export function getProfile(hash: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const storageKey = `profile_${hash}`;
  const profile = localStorage.getItem(storageKey);
  
  if (profile) {
    // Update last accessed time
    const metadataKey = `profile_meta_${hash}`;
    const metadata = localStorage.getItem(metadataKey);
    if (metadata) {
      try {
        const meta = JSON.parse(metadata);
        meta.lastAccessed = Date.now().toString();
        localStorage.setItem(metadataKey, JSON.stringify(meta));
      } catch (e) {
        // If metadata is corrupted, ignore
      }
    }
  }
  
  return profile;
}

/**
 * Clean up old profiles (older than 30 days)
 */
export function cleanupOldProfiles(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const keysToRemove: string[] = [];
  
  // Check all localStorage keys for profile metadata
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('profile_meta_')) {
      try {
        const metadata = JSON.parse(localStorage.getItem(key) || '{}');
        const lastAccessed = parseInt(metadata.lastAccessed || '0');
        
        if (lastAccessed < thirtyDaysAgo) {
          const hash = metadata.hash;
          keysToRemove.push(`profile_${hash}`);
          keysToRemove.push(`profile_meta_${hash}`);
        }
      } catch (e) {
        // If metadata is corrupted, remove it
        keysToRemove.push(key);
      }
    }
  }
  
  // Remove old profiles
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Get storage statistics
 */
export function getStorageStats(): { totalProfiles: number; storageSize: string } {
  if (typeof window === 'undefined') {
    return { totalProfiles: 0, storageSize: '0 KB' };
  }
  
  let totalProfiles = 0;
  let totalSize = 0;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('profile_')) {
      const value = localStorage.getItem(key) || '';
      totalSize += key.length + value.length;
      
      if (key.startsWith('profile_meta_')) {
        totalProfiles++;
      }
    }
  }
  
  const sizeInKB = Math.round(totalSize / 1024 * 100) / 100;
  return {
    totalProfiles,
    storageSize: `${sizeInKB} KB`
  };
}
