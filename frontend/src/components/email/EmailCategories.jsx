/**
 * EmailCategories Component
 * 
 * Category filter tabs using Shadcn Tabs
 */

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { EMAIL_CATEGORIES } from '@/lib/constants'

export default function EmailCategories({ activeCategory, onCategoryChange, counts = {} }) {
  return (
    <Tabs value={activeCategory} onValueChange={onCategoryChange} className="w-full">
      <TabsList className="w-full justify-start">
        {/* All Category */}
        {/* <TabsTrigger value="all" className="gap-2">
          All
          {counts.all > 0 && (
            <Badge variant="secondary" className="ml-1">
              {counts.all}
            </Badge>
          )}
        </TabsTrigger> */}

        {/* Other Categories */}
        {/* {EMAIL_CATEGORIES.map((category) => (
          <TabsTrigger key={category.value} value={category.value} className="gap-2">
            <span>{category.icon}</span>
            <span>{category.label}</span>
            {counts[category.value] > 0 && (
              <Badge variant="secondary" className="ml-1">
                {counts[category.value]}
              </Badge>
            )}
          </TabsTrigger>
        ))} */}
      </TabsList>
    </Tabs>
  )
}
 * 
 * Alternative Layout (Vertical Sidebar):
 * ┌──────────────────┐
 * │ 📧 All       (45)│
 * │ 🔴 Important (12)│
 * │ 👥 Social     (8)│
 * │ 🎁 Promotions(25)│
 * │ 📢 Updates    (0)│
 * │ 🚫 Spam       (0)│
 * └──────────────────┘
 * 
 * Features:
 * 
 * 1. Category List:
 *    - All (default, shows everything)
 *    - Important
 *    - Social
 *    - Promotions
 *    - Updates
 *    - Spam
 *    - Others
 * 
 * 2. Visual Indicators:
 *    - Icon/emoji for each category
 *    - Count badge (number of emails)
 *    - Active state highlight
 *    - Hover effect
 * 
 * 3. Category Icons:
 *    - Important: Red circle / Star
 *    - Social: People icon
 *    - Promotions: Gift box
 *    - Updates: Bell / Megaphone
 *    - Spam: Ban icon
 *    - Others: Generic email
 * 
 * 4. Color Coding:
 *    - Important: Red
 *    - Social: Blue
 *    - Promotions: Purple
 *    - Updates: Green
 *    - Spam: Gray
 * 
 * 5. Active State:
 *    - Bold text
 *    - Underline or background
 *    - Border bottom
 *    - Different color
 * 
 * 6. Click Behavior:
 *    - Click category
 *    - Call onCategoryChange callback
 *    - Parent filters emails by category
 *    - Update active state
 * 
 * Data Flow:
 * 1. Parent fetches categorized emails
 * 2. Parent passes category counts
 * 3. User clicks category
 * 4. Component calls onCategoryChange('social')
 * 5. Parent filters and displays social emails
 * 
 * Props:
 * - categories: Array of {value, label, icon, count}
 * - activeCategory: string (current selected)
 * - onCategoryChange: function(category)
 * - layout: 'horizontal' | 'vertical'
 * 
 * Category Object:
 * {
 *   value: 'important',
 *   label: 'Important',
 *   icon: '🔴',
 *   count: 12
 * }
 * 
 * Usage:
 * <EmailCategories
 *   categories={EMAIL_CATEGORIES}
 *   activeCategory={selectedCategory}
 *   onCategoryChange={(cat) => setSelectedCategory(cat)}
 *   layout="horizontal"
 * />
 */

// Will import Shadcn Tabs or custom styled buttons
// Will import category icons from lucide-react
// Will handle active state and click events
// Will display counts and labels
