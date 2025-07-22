# Reusable Search Component

This document explains how to use the new reusable search component across different pages.

## Components Created

### 1. ReusableSearch Component (`/components/Ui/ReusableSearch.tsx`)

A generic, reusable search input component that matches the design system.

**Features:**
- Clean, minimal design with bottom border
- Dark mode support
- Customizable placeholder text
- Enter key support
- Event callbacks for search and input changes

**Props:**
```typescript
interface ReusableSearchProps {
  placeholder?: string;        // Default: "Ara"
  className?: string;          // Additional CSS classes
  onSearch?: (query: string) => void;     // Called when Enter is pressed or form is submitted
  onChange?: (query: string) => void;     // Called on every input change
  defaultValue?: string;       // Initial value
  autoFocus?: boolean;         // Auto focus the input
}
```

**Usage Example:**
```tsx
import ReusableSearch from "@/components/Ui/ReusableSearch";

// Basic usage
<ReusableSearch placeholder="Search posts..." onSearch={handleSearch} />

// With real-time filtering
<ReusableSearch 
  placeholder="Filter items..."
  onChange={handleFilter}
  onSearch={handleSearch}
/>
```

### 2. EtiketlerSearch Component (`/components/EtiketlerSearch.tsx`)

A specialized search component for the hashtags/etiketler page that integrates with the URL search parameters.

**Features:**
- Maintains search state in URL parameters
- Resets pagination when searching
- Uses the ReusableSearch component internally

## Implementation in Etiketler Page

The etiketler page now uses the new search component which provides:

1. **Consistent styling** - Matches the design system with bottom border and proper dark mode support
2. **URL state management** - Search queries are reflected in the URL
3. **Pagination reset** - When searching, it automatically goes to page 1
4. **Reusable pattern** - The same component can be used on other pages

## Styling Details

The search input uses these CSS classes:
```css
placeholder:text-gray-900 bg-white dark:placeholder:text-white dark:bg-DarkerGrey border-b border-eksiCode p-2.5 text-sm w-full focus:outline-none focus:border-eksiCode focus:border-b-2 transition-colors
```

Key styling features:
- Bottom border with `border-eksiCode` color
- Responsive placeholder text colors for light/dark modes
- Focus states with thicker bottom border
- Smooth transitions

## Using in Other Pages

To implement this search component in other pages:

1. **For client-side filtering:**
```tsx
import ReusableSearch from "@/components/Ui/ReusableSearch";

const [searchQuery, setSearchQuery] = useState('');
const [filteredData, setFilteredData] = useState(data);

const handleSearch = (query: string) => {
  setSearchQuery(query);
  const filtered = data.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );
  setFilteredData(filtered);
};

return (
  <ReusableSearch 
    placeholder="Search..."
    onSearch={handleSearch}
    onChange={handleSearch} // For real-time filtering
  />
);
```

2. **For URL-based search (like etiketler page):**
Create a specialized component similar to `EtiketlerSearch` that handles URL parameters for your specific route.

## Benefits

1. **Consistency** - All search inputs across the app now have the same look and feel
2. **Maintainability** - Changes to search styling can be made in one place
3. **Reusability** - Easy to implement search functionality on any page
4. **Accessibility** - Proper form handling and keyboard support
5. **Performance** - Optimized with proper event handling
