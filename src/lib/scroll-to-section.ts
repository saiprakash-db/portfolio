const sectionStartSelector =
  ".section-heading, .section-kicker, .intro-name, .about-layout, .contact-top";

export function scrollToSection(
  id: string,
  behavior: ScrollBehavior = "smooth",
) {
  const section = document.getElementById(id);
  if (!section) return false;

  const target =
    section.querySelector<HTMLElement>(sectionStartSelector) ?? section;
  const headerBottom =
    document.querySelector<HTMLElement>(".site-header")?.getBoundingClientRect()
      .bottom ?? 0;
  const top =
    target.getBoundingClientRect().top + window.scrollY - headerBottom - 24;

  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}
