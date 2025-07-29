/**
 * Rules Index
 * Central export for all design and development rules
 */

export { default as MOBILE_RESPONSIVE_RULES } from './mobile-responsive-design';
export * from './mobile-responsive-design';

// Re-export commonly used rule sets
export {
  DESIGN_APPROACH,
  TAILWIND_REQUIREMENTS,
  LAYOUT_REQUIREMENTS,
  TOUCH_REQUIREMENTS,
  RESPONSIVE_PATTERNS,
  TESTING_CHECKLIST,
} from './mobile-responsive-design';
