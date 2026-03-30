# Qicky Onboarding

## Current State
New project, no existing application files.

## Requested Changes (Diff)

### Add
- Onboarding landing page: split-screen layout (left: hero image/text, right: form card with name + mobile input + Check Eligibility CTA)
- Feature highlights: Fully Digital, Highest Approval, Expert Assistance, Minimal Docs
- Stats bar: satisfied customers, lending partners, loans disbursed
- OTP verification page: 6-digit OTP input, resend timer
- Analysis/results page: eligibility result card, loan amount, interest rate, CTA

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Frontend-only multi-page flow (no backend needed for UI demo)
2. Page 1: Onboarding - split layout with form
3. Page 2: OTP - centered card with digit inputs
4. Page 3: Analysis - eligibility result with animated reveal
5. Navigation between pages via React state
