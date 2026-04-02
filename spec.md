# Qicky

## Current State
- Offers page shows a 2-column grid of LenderCard components with category filter chips and sort tabs
- LenderCard has no compare/select toggle
- OffersStep has no compare mode or side-by-side comparison view
- Apply form (ApplyStep) uses SlimField/SectionCard components with sequential stacked layout
- Personal information section lists ~5 fields vertically per card — feels lengthy

## Requested Changes (Diff)

### Add
- Compare toggle button on the offers page header area ("Compare Offers" mode toggle)
- Checkbox/selector on each LenderCard when compare mode is active
- Constraint: max 3 offers selectable; if 3 already selected, disable unselected cards
- Compare panel: floating bottom drawer or modal showing 2-3 selected offers side by side with key metrics (rate, max amount, tenure, processing fee, approval chance)
- "Compare" CTA button that appears when 2+ offers selected (replaces sticky bar or shows above it)
- Personal details section in ApplyStep: 2-column grid layout for fields (Full Name + DOB on row 1, PAN + Mobile on row 2, Email spanning full width)
- Financial details: grid layout (Income + Employment on row 1, Employer + Experience on row 2)
- Loan details: 2-column grid

### Modify
- LenderCard: add optional `isCompareMode`, `isSelected`, `onToggleCompare` props
- OffersStep: add `compareMode` state, `selectedForCompare` array state
- SectionCard content: use grid layout for form fields instead of stacked SlimField
- SlimField: support full-width override for spanning both columns

### Remove
- Nothing removed

## Implementation Plan
1. Add compare mode state and selectedForCompare[] to OffersStep
2. Add a "Compare" toggle button to the offers header row
3. Extend LenderCard props to support compare checkbox overlay
4. Build CompareDrawer component: slides up from bottom, shows selected offers in columns with row-by-row metric comparison
5. Refactor personal info section (ApplyStep) to use CSS grid 2-column layout
6. Refactor financial and loan details sections similarly
