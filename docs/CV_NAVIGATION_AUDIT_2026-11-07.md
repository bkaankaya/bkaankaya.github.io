# CV alignment and navigation audit — 7 November 2026

## Approved source basis

Profile copy follows the owner's general `Bertan_Kaan_Kaya_CV.pdf` (last modified
31 October 2026), rather than role-specific or archived CV versions. The Cambridge
June 2021 certificate was inspected visually because its scanned PDF has no text
layer. Only the requested public education summary and grades are published; the
source documents, phone number and certificate/candidate identifiers are not.

- TED University: B.Sc. Computer Engineering, Sep 2022–Jun 2026;
  Business Administration minor (Management Program). The GPA is omitted from the
  public profile at the owner’s request.
- Beştepe Koleji / Anatolian High School: 2017–2022. The owner described the dual
  diploma programme. The certificate independently confirms GCE Advanced Level
  Mathematics A, Biology B and Business B, June 2021.
- Languages: Turkish (Native), English (Advanced), Spanish (Beginner), exactly as
  the general CV lists them. Italian and the unrelated Italian university entries
  were removed from the public profile.
- Experience: replace unsupported generic entries and the unsupported 15+ project
  count with the four CV internships: TNC Group, Anova R&D Technologies, PROVEN
  Technologies and T2 Software. Dates and short descriptions follow the CV.
- About: identify the TED degree and business minor; retain the existing styling.

## Navigation corrections

The old Contact button navigated to an About-page fragment in the tested Chromium
session, not a standalone page. Email actions also depended on an installed mail
handler, which can appear inert to visitors. A genuine static `/contact/` route now
exists. Header, mobile menu, hero, availability card, footer and project-dialog
contact CTAs use this route. The legacy `/about/#contact` destination still works.

The contact panel shows the verified email, GitHub and LinkedIn profile. Its
clipboard button reports success only after the write succeeds. On blocked or
unavailable clipboard access, the address is selected with manual-copy guidance.
The email link is explicitly labelled Open email app; there is no pretend contact
form, unimplemented backend, or false sent-message confirmation.

Browser testing caught an HTML scroll lock remaining during navigation from an
open project dialog. The CTA now dismisses the native dialog and restores scroll
synchronously before client navigation. Cleanup is idempotent and also runs on
close/unmount. This prevents cached route transitions from retaining the lock.

## Verification

- TypeScript and static Next.js production export: passed; six content routes.
- Node regression tests: 43 passed, no failures.
- Chromium: direct loads and refreshable paths for Home, Projects, Experience,
  Education, About and Contact; Contact reached from every header origin.
- Every visible anchor/button inventoried. All internal paths and local fragments
  checked for real destinations, no empty placeholder hrefs.
- All seven project preview/title triggers, close buttons, Escape, both manual
  galleries, category filters and project-to-contact navigation exercised.
- DoraVoice and ReZero five-second hover transitions and pointer-leave reset pass.
- More/Less, Escape, clipboard success and denied-clipboard fallback pass.
- Mobile menu links and Contact pass on touch-capable Chromium emulation.
- All six routes at 320, 390, 768 and 1440 pixels: no horizontal overflow.
- Axe WCAG 2 A/AA + 2.1 AA checks across six routes in both dark and light themes:
  no violations in the automated checks. This is not an accessibility certification.
- No JavaScript page errors or failed image/script/style requests in the test run.
- Official TED and Beştepe links and the public GitHub profile returned HTTP 200.
  LinkedIn returned HTTP 999 to automated requests; the verified profile URL is
  retained. No claim is made that third-party login/access restrictions were tested.
- Mailto URLs and recipients were verified; actual email-app delivery was not tested,
  and no messages were sent. Copy email provides an alternative without a mail app.

Production remains GitHub Pages. Vercel Sandbox was used for isolated build and
browser tests. The publishing commit's Actions run records final CI and deployment;
the live site is rechecked separately after publishing.
