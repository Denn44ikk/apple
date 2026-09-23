# Design QA: планировщик, версия 2

## Evidence

- Source visual truth: `C:\Users\denis\AppData\Local\Temp\codex-clipboard-03384754-c8d8-4872-aefe-37ce32e16b53.png` (243 × 339 px). This is an annotated crop of the desired weekly structure, not a full screen mockup.
- Implementation: `qa/v2-day.png` and `qa/v2-week.png`, browser rendered iPhone screen at 393 × 852 CSS px, deviceScaleFactor 1, saved at 393 × 852 px.
- Combined comparison: `qa/comparison.png`, original sketch beside the browser rendered weekly screen, with no density normalization of the sketch because it expresses structure rather than exact pixel dimensions.
- State: 20 September 2026; day list and week view. The week screenshot is scrolled to its summary and first days so the relevant area is readable.
- Focused region: source crop and the first day cards in the combined comparison. No app owned raster art appears in either view.

## Findings

No remaining actionable P0/P1/P2 differences for the requested structural changes.

- Typography: serif page and section headings remain consistent with the existing planner; task labels, day dates, counts, and percentages use compact sans serif text.
- Spacing: day groups are separated into category cards; the weekly list uses full width day cards so task names and completion marks remain legible on iPhone.
- Color: category dots and the sage percentage badges reuse the existing palette. Empty days show a dash rather than an unjustified 0% completion claim.
- Imagery and icons: the sketch contains annotations, not product artwork. Controls use Radix icons and the protected runtime renders device chrome.
- Copy: the Plan navigation contains only Plan and Settings. No habit or sleep controls remain in the app UI.

## Iteration history

1. First browser capture showed the bottom navigation attached to the scroll content and therefore absent from the visible phone screen. It also showed that the category cards delayed the task list.
2. Moved navigation to a fixed sibling of `MobileScroll` and reduced category card height and vertical gaps. Post fix evidence: `qa/v2-day.png` and `qa/v2-week.png` show visible navigation and the first day/category content within the screen.

## Interaction checks

- Four version 2 browser tests passed: category grouping, absence of removed features, per day/week percentage changes, adding a category assigned task without time, and per day completion of recurring tasks.
- Eight protected mobile runtime browser tests and four Sites worker tests passed. TypeScript/Vite build and mobile runtime integrity check passed.
- The app was opened and clicked in the Codex in app browser at `http://127.0.0.1:4174/`. The weekly percentage update was visible in the accessibility tree and the rendered screen was inspected.

## Remaining limitations

- The supplied reference is a cropped, hand drawn interaction sketch, so exact font, spacing, and color matching is not defined. The vertical day list is an intentional readability adaptation for the 393 px iPhone screen.
- This is a local version 2 preview; the existing public version has not been updated.

final result: passed
