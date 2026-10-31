// Viewport sized like the old screenshots: aspect 1416/1340, zoomed out
// enough to show each full page.
export const HOME_FRAME = {
  width: 2200,
  height: 2082,
} as const;

export const HOME_SLIDES = [
  {
    href: "https://careerchive-demo.vercel.app/?org=current&iso=2026-10-21",
    caption: "Track your work days in the Archive.",
  },
  {
    href: "https://careerchive-demo.vercel.app/overview?org=current&period=week&view=2026-10-18",
    caption: "Gain insights about your work under Overview.",
  },
  {
    href: "https://careerchive-demo.vercel.app/search?input=search",
    caption: "Search your logs and ask ChiveBot about your logs.",
  },
  {
    href: "https://careerchive-demo.vercel.app/organizations?org=current",
    caption: "Manage the workplaces you track under Organizations.",
  },
] as const;

export function formatSlideCaption(index: number) {
  return `${index + 1}/${HOME_SLIDES.length} · ${HOME_SLIDES[index].caption}`;
}
