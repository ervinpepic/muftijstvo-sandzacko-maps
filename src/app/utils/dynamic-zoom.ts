// Helper method to determine the initial zoom level based on screen size
export function getInitialZoomLevel(): number {
    const screenWidth = window.innerWidth;
    if (screenWidth < 600) {
      // Mobile devices
      return 8.1;
    } else {
      // Tablets and larger screens
      return 9;
    }
  }