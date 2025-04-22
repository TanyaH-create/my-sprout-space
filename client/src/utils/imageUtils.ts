/**
 * Utility functions for handling image paths throughout the application
 */

/**
 * Resolves an image path to ensure it can be properly displayed
 * @param imagePath The original image path from the database or state
 * @returns A properly formatted path that can be used in img src attributes
 */
export const resolveImagePath = (imagePath: string | undefined): string => {
    if (!imagePath) {
      return 'https://cdn-icons-png.flaticon.com/128/628/628324.png'; // Default fallback image
    }
    
    // If it's already a full URL, use it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // For relative paths starting with '/images', use them directly
    // In a regular React app, the public directory is the root path
    if (imagePath.startsWith('/images/')) {
      // Simply use the path as-is since it's relative to the public folder
      return imagePath;
    }
    
    // If the path points to assets folder (typically imported in React)
    if (imagePath.includes('assets/images')) {
      // These should be properly bundled by webpack
      return imagePath;
    }
    
    // For any other case, assume it's a relative path from public
    return `/${imagePath.replace(/^\//, '')}`;
  };
  
  /**
   * Handles image loading errors by setting a default image
   * @param event The error event from the img tag
   * @param plantName Optional plant name for logging purposes
   */
  export const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>, 
    plantName?: string
  ): void => {
    const target = event.target as HTMLImageElement;
    console.log(`Failed to load image${plantName ? ` for ${plantName}` : ''}: ${target.src}`);
    target.src = 'https://cdn-icons-png.flaticon.com/128/628/628324.png';
    target.onerror = null; // Prevent infinite error loops
  };