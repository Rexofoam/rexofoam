/**
 * Rexofoam custom AI Rules
 * Mobile Responsive Design Rules
 * These rules ensure all generated designs are mobile-first and responsive across all devices
 */

export const MOBILE_RESPONSIVE_RULES = {
  // Core Principles
  DESIGN_APPROACH: {
    strategy: 'mobile-first',
    description: 'Always design for mobile first, then scale up to larger screens',
    breakpoints: {
      mobile: '320px - 768px',
      tablet: '768px - 1024px',
      desktop: '1024px+',
    },
  },

  // Required Responsive Classes
  TAILWIND_REQUIREMENTS: {
    containers: [
      'Always use responsive padding: p-4 sm:p-6 md:p-8 lg:p-12',
      'Use responsive widths: w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl',
      'Implement responsive margins: m-2 sm:m-4 md:m-6 lg:m-8',
    ],
    typography: [
      'Text sizing: text-sm sm:text-base md:text-lg lg:text-xl',
      'Headings: text-lg sm:text-xl md:text-2xl lg:text-3xl',
      'Line height: leading-relaxed sm:leading-normal',
    ],
    spacing: [
      'Gaps: gap-2 sm:gap-4 md:gap-6 lg:gap-8',
      'Space between: space-y-2 sm:space-y-4 md:space-y-6',
    ],
  },

  // Layout Rules
  LAYOUT_REQUIREMENTS: {
    flexbox: [
      'Use flex-col on mobile, flex-row on larger screens when appropriate',
      'Always include items-center and justify-center for proper alignment',
      'Use flex-wrap for multi-item layouts',
    ],
    grid: [
      'Grid layouts: grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      'Always include gap classes: gap-2 sm:gap-4 md:gap-6',
    ],
    positioning: [
      'Avoid fixed positioning on mobile unless absolutely necessary',
      'Use relative/absolute positioning carefully with responsive considerations',
    ],
  },

  // Touch and Interaction
  TOUCH_REQUIREMENTS: {
    targets: [
      'Minimum touch target size: 44px x 44px (h-11 w-11 or larger)',
      'Button padding: px-4 py-2 sm:px-6 sm:py-3',
      'Input fields: py-3 px-4 minimum for easy touch',
    ],
    spacing: [
      'Adequate spacing between clickable elements',
      'Use space-y-4 or gap-4 minimum between interactive elements',
    ],
  },

  // Content Rules
  CONTENT_REQUIREMENTS: {
    text: [
      'Keep text readable on small screens',
      'Use appropriate line-height for mobile reading',
      'Ensure sufficient color contrast (4.5:1 minimum)',
    ],
    images: [
      'Always use responsive images with proper sizing',
      'Use object-cover or object-contain appropriately',
      'Include alt text for accessibility',
    ],
  },

  // Navigation
  NAVIGATION_REQUIREMENTS: {
    mobile: [
      'Use hamburger menu or tab bar for mobile navigation',
      'Ensure navigation is thumb-accessible',
      'Keep primary actions within easy reach',
    ],
    desktop: [
      'Expand navigation for larger screens',
      'Use horizontal layouts where appropriate',
    ],
  },

  // Form Design
  FORM_REQUIREMENTS: {
    inputs: [
      'Full width inputs on mobile: w-full',
      'Adequate spacing between form elements',
      'Large enough labels and placeholders',
      'Use appropriate input types for mobile keyboards',
    ],
    validation: [
      'Clear, visible error states',
      'Accessible form validation messages',
    ],
  },

  // Performance
  PERFORMANCE_REQUIREMENTS: {
    loading: [
      'Optimize images for different screen densities',
      'Use lazy loading for images below the fold',
      'Minimize layout shifts',
    ],
    animations: [
      'Respect prefers-reduced-motion',
      'Keep animations smooth on lower-end devices',
    ],
  },

  // Testing Requirements
  TESTING_CHECKLIST: [
    'Test on actual mobile devices, not just browser dev tools',
    'Verify touch interactions work properly',
    'Check text readability without zooming',
    'Ensure all interactive elements are easily tappable',
    'Test in both portrait and landscape orientations',
    'Verify content doesn\'t overflow horizontally',
    'Check loading performance on slower connections',
  ],

  // Common Patterns
  RESPONSIVE_PATTERNS: {
    hero_section: 'text-center py-12 sm:py-16 md:py-20 lg:py-24',
    card_grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
    container: 'w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
    button_primary: 'w-full sm:w-auto px-6 py-3 text-base sm:text-lg',
    form_input: 'w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2',
  },

  // Forbidden Practices
  AVOID: [
    'Fixed pixel values without responsive alternatives',
    'Horizontal scrolling on mobile',
    'Tiny touch targets (< 44px)',
    'Text smaller than 16px on mobile',
    'Overcrowded interfaces',
    'Non-responsive images that overflow',
    'Desktop-only navigation patterns',
  ],
} as const;

// Export individual rule sets for easy import
export const { 
  DESIGN_APPROACH, 
  TAILWIND_REQUIREMENTS, 
  LAYOUT_REQUIREMENTS,
  TOUCH_REQUIREMENTS,
  CONTENT_REQUIREMENTS,
  NAVIGATION_REQUIREMENTS,
  FORM_REQUIREMENTS,
  PERFORMANCE_REQUIREMENTS,
  TESTING_CHECKLIST,
  RESPONSIVE_PATTERNS,
  AVOID 
} = MOBILE_RESPONSIVE_RULES;

export default MOBILE_RESPONSIVE_RULES;
