# Design QA

## Evidence

- Source visual truth: `C:\Users\denis\.codex\generated_images\01a0be53-13e9-7032-bef2-0322875ca83e\exec-e5e11aba-d76f-4b8a-92ef-e5b807f65ef4.png`.
- Implementation: browser-rendered iPhone app at `http://127.0.0.1:4173/`, captured in the in-app browser on 2026-09-20.
- Source viewport: 853 × 1846 px. Implementation app content: template-owned iPhone screen, 393 × 852 CSS px. The device bezel, status bar, and home indicator are template-owned and excluded from fidelity comparison.
- Compared state: list view after creating one task, marking it complete, and reordering categories.

## Findings

No actionable P0, P1, or P2 differences found for the implemented interactive scope.

- Fonts and typography: the display-style title and compact sans-serif task content preserve the source's hierarchy; system-safe fallbacks are used in the prototype.
- Spacing and layout rhythm: the header, category rail, segmented view switcher, task surface, and floating add control follow the source composition within the smaller template viewport.
- Colors and visual tokens: warm paper background, navy text, sage primary action, and pale blue/sage/sand category tones are consistent with the source direction.
- Image and icon fidelity: the source contains no app-owned raster imagery. Standard controls use the Radix UI icon library; mobile device chrome is provided by the protected runtime.
- Copy and content: Russian labels, category names, task text, and dynamic completion count reflect the product brief.

## Interaction evidence

- Added the task `Позвонить маме`; it appeared in the list and increased the count from 5 to 6.
- Switched to `Неделя`; the new task appeared in the weekly view.
- Marked the new task complete; the completed count changed from 1 of 6 to 2 of 6.
- Reordered categories; the visible order changed from `Работа, Учёба, Дом` to `Учёба, Дом, Работа`.
- Switched to `Месяц`; 20 September displayed the updated total of 6 tasks.

## Follow-up polish

- P3: replace system display typography with a licensed serif family if a final brand font is selected.

final result: passed

## Iteration: sleep-chart calibration

- Removed the Plan header's Today control and moved sleep-goal editing to Habits.
- Calibrated the weekly chart so bar heights and the dashed goal use the same pixel scale; weekday and hour labels sit below each bar.
- Verified by clicks: setting an 8-hour goal immediately updates the chart annotation.

final result: passed

## Iteration: final polish

- Standardized habit and task completion marks; compacted the Settings screen.
- Sleep chart now labels recorded hours and renders a user-configurable dashed sleep-goal line.
- Verified by clicks: changing the goal to 7.5 hours updates the chart label and rule.

final result: passed

## Iteration: complete habit editing

- Added new-habit creation and deletion controls to the Habits page.
- Added a guard that keeps at least one habit in the list.
- Verified by clicks: a new habit appears immediately in the daily plan and disappears from both screens after deletion.

final result: passed

## Iteration: habits in plan

- Moved habit completion controls to the Plan page.
- Consolidated habit-name editing and sleep/habit statistics under Habits.
- Removed the standalone Statistics item from bottom navigation and verified the final three-tab navigation by clicks.

final result: passed

## Iteration: habits, sleep and settings

- Added a bottom navigation for Plan, Habits, Statistics and Settings.
- Added sleep entry and visual sleep/habit statistics, plus a daily habit streak mechanic.
- Verified by clicks: saving 7.5 hours updates the plan card; a habit toggles; statistics opens; the lilac theme applies.

final result: passed

## Iteration: recurring tasks

- Added daily, weekly, monthly and yearly repeat choices in the task form.
- Verified by clicks: a daily task created on 20 September is visible on 21 September, in the week and on every subsequent day in the month view.
- Visual check: the repeated-task calendar cells retain their readable spacing and counts.

final result: passed

## Iteration: planning and category mechanics

- Added date navigation and a date field in the new-task sheet; a task created for 23 September opened immediately in that day and appeared in the date-specific list.
- Added a category manager with inline rename, up/down ordering, a protected delete action, and creation of a new category.
- Added task actions for completion and deletion; these are available from each task's overflow control.
- Browser click checks: created `Оплатить курс` for 23 September, renamed `Дом` to `Личное`, moved it upward, and created `Спорт`.
- Runtime integrity, TypeScript build, and four Sites packaging tests pass.

final result: passed

## Iteration: placement and task checkboxes

- Prior issue: the floating add control could overlap lower task rows, and the checkbox column appeared visually unstable beside multi-line task text.
- Fix: moved `Добавить` into the list header beside the task count; set a fixed checkbox column and centred 26px targets within every task row.
- Post-fix evidence: browser-rendered iPhone screen at `http://127.0.0.1:4173/` on 2026-09-20 shows the compact `Добавить` control in the header and aligned checkbox targets for single- and multi-line tasks.
- Click test: the relocated `Добавить` control opens the new-task sheet successfully.

final result: passed
