# Routing Architecture

This document outlines the routing architecture for the Maplesea character lookup application.

## Navigation System

### Core Components

1. **Navigation Utility** (`/src/utils/navigation.ts`)
   - Centralized routing logic
   - Type-safe navigation methods
   - URL parameter utilities
   - Custom hook for easy usage

2. **Header Component** (`/src/components/Header.tsx`)
   - Reusable header with logo navigation
   - Variants for different page types
   - Consistent navigation behavior

### Route Structure

```
/                     - Home page (character search)
/character-details    - Character details page
  ?ocid=<character_ocid>
  &name=<character_name> (optional)
```

### Navigation Methods

#### Basic Navigation
```typescript
const navigation = useNavigation();

// Navigate to home
navigation.goHome();

// Navigate to character details
navigation.goToCharacterDetails(ocid, characterName);

// Browser history navigation
navigation.goBack();
navigation.goForward();
```

#### URL Parameter Handling
```typescript
import { URLParams } from '@/utils/navigation';

// Get parameters from URL
const ocid = URLParams.getCharacterOcid(searchParams);
const characterName = URLParams.getCharacterName(searchParams);

// Build character details URL
const url = URLParams.buildCharacterUrl(ocid, characterName);
```

## Implementation Details

### Client-Side Navigation
All navigation uses Next.js App Router for:
- Fast client-side transitions
- Proper browser history management
- SEO-friendly URLs
- Prefetching capabilities

### Performance Optimizations
- Route prefetching for faster navigation
- Cached character data persists across navigation
- Optimized image loading with Next.js Image component

### Type Safety
- TypeScript interfaces for all navigation parameters
- Centralized route constants to prevent typos
- Type-safe URL parameter extraction

## Usage Examples

### Home Page Navigation
```typescript
// In character search form
const handleSearch = async () => {
  // ... search logic
  navigation.goToCharacterDetails(data.ocid, inputValue);
};
```

### Header Navigation
```typescript
// Logo click handler (automatically handled by Header component)
<Header variant="home" />     // For home page
<Header variant="details" />  // For detail pages
```

### URL Sharing
Character details pages are shareable via URL:
```
https://yourapp.com/character-details?ocid=abc123&name=PlayerName
```

## Benefits

1. **Consistency**: All navigation goes through the same utility
2. **Maintainability**: Route changes only need to be updated in one place
3. **Type Safety**: Compile-time checking for navigation parameters
4. **Performance**: Client-side navigation with caching
5. **User Experience**: Fast transitions, proper browser history
6. **SEO**: Proper URLs for character pages

## Future Enhancements

Potential additions to the routing system:

1. **Guild Details Page**
   ```
   /guild-details?guild_id=<id>&name=<guild_name>
   ```

2. **Character Comparison**
   ```
   /compare?characters=<ocid1>,<ocid2>
   ```

3. **Leaderboards**
   ```
   /leaderboard?type=<level|damage>&world=<world_name>
   ```

4. **Search History**
   ```
   /history
   ```

Each new route would follow the same pattern with:
- Type-safe navigation methods
- URL parameter utilities
- Proper caching integration
- SEO-friendly URLs
