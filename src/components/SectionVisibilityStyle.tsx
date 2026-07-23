import { useSectionVisibility } from "@/lib/cms";
import { SECTIONS_CATALOG, type SectionsPageKey } from "@/lib/sectionsCatalog";

// Injects a <style> that hides sections toggled off in the admin.
// Selectors come from src/lib/sectionsCatalog.ts — matching the classNames
// already used in each route's markup. No route JSX needs to change.
export function SectionVisibilityStyle() {
  const map = useSectionVisibility();
  const rules: string[] = [];
  (Object.keys(SECTIONS_CATALOG) as SectionsPageKey[]).forEach((page) => {
    SECTIONS_CATALOG[page].forEach((section) => {
      const v = map?.[page]?.[section.key];
      if (v === false) {
        rules.push(`${section.selector}{display:none !important}`);
      }
    });
  });
  if (!rules.length) return null;
  return <style data-gbia-section-visibility>{rules.join("\n")}</style>;
}
