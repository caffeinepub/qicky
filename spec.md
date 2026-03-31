# Qicky — Application Form + Thank You Page

## Current State
The app has 4 steps: landing → OTP → analysis → offers. The Offers page shows 5 lenders (Poonawala, ABCL, Hero Fincorp, Unity SFB, SMFG) with "Apply Now" buttons on each card. Currently tapping "Apply Now" does nothing.

## Requested Changes (Diff)

### Add
- `apply` step: Pre-filled loan application form with Equifax credit bureau banner, showing all fields auto-populated from bureau data (name, DOB, PAN, mobile, email, monthly income, employment type, employer name, city, loan amount, loan purpose). Ultra-modern dark UI matching existing #0A0A0F theme.
- `thankyou` step: Confirmation page per lender with their UTM link, asking customer to continue the journey on lender's platform.
- `selectedLender` state to track which lender was selected.
- Equifax trust banner at top of form with shield icon, bureau seal design.
- Each lender has a unique UTM link in the data model.

### Modify
- `Step` type: add `"apply" | "thankyou"` variants.
- `Lender` interface: add `utmLink: string` field.
- `LENDERS` data: add UTM links per lender.
- `LenderCard` component: "Apply Now" button now calls `onApply(lender)` callback.
- `OffersStep`: accept `onApply` prop, pass it to LenderCard. Also sticky bar "Apply Now" should also call `onApply` with the best lender.
- `App` root: add `selectedLender` state, `handleApply`, `handleSubmitForm`, `handleBackToOffers` handlers, render `apply` and `thankyou` steps.

### Remove
- Nothing removed.

## Implementation Plan
1. Add `utmLink` to `Lender` interface and LENDERS data.
2. Update `Step` type.
3. Add `selectedLender` state in App root.
4. Update `LenderCard` to accept and call `onApply(lender: Lender)` on Apply Now button.
5. Update `OffersStep` to accept `onApply` prop and pass it down.
6. Build `ApplicationFormStep` component:
   - Sticky header with Qicky logo + lender name + back button
   - Equifax credit bureau banner (green shield, "Bureau data pulled" message)
   - All fields pre-filled: Full Name, Date of Birth, PAN Number, Mobile, Email, Monthly Net Income, Employment Type, Employer Name, City, Loan Amount Required, Loan Purpose
   - Editable fields (user can modify if needed)
   - "Fields are auto-filled from your Equifax credit report" sub-note
   - Submit CTA: "Submit Application →" in lender brand color
7. Build `ThankYouStep` component:
   - Success animation (checkmark)
   - Lender branding (logo color, name)
   - "Your application has been submitted" message
   - Prominent CTA: "Continue on [Lender] →" linking to UTM URL
   - Trust indicators
   - "Back to Offers" link
