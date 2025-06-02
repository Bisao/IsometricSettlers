
// Responsive utility functions
export const getResponsiveValue = <T>(mobile: T, desktop: T, isMobile: boolean): T => {
  return isMobile ? mobile : desktop;
};

export const getResponsiveClasses = (
  mobileClasses: string,
  desktopClasses: string,
  isMobile: boolean
): string => {
  return isMobile ? mobileClasses : desktopClasses;
};

export const getButtonSize = (isMobile: boolean): "sm" | "default" => {
  return isMobile ? "default" : "sm";
};

export const getCardPadding = (isMobile: boolean): string => {
  return isMobile ? "p-3" : "p-4";
};

export const getTextSize = (isMobile: boolean): string => {
  return isMobile ? "text-sm" : "text-base";
};

export const getSpacing = (isMobile: boolean): string => {
  return isMobile ? "space-y-2" : "space-y-3";
};

// Mobile viewport height fix
export const setViewportHeight = (): void => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Initialize viewport height fix
if (typeof window !== 'undefined') {
  setViewportHeight();
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 100);
  });
}
