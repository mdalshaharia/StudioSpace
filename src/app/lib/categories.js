export const CHIPS = [{
  key: "all",
  label: "All"
}, {
  key: "photo",
  label: "Photo Studio"
}, {
  key: "film",
  label: "Film Stage"
}, {
  key: "podcast",
  label: "Podcast Lounge"
}, {
  key: "music",
  label: "Music Suite"
}, {
  key: "workshop",
  label: "Workshop"
}];
const CATEGORY_KEYWORDS = [["photo", "photo"], ["film", "film"], ["sound stage", "film"], ["podcast", "podcast"], ["music", "music"], ["recording", "music"], ["workshop", "workshop"]];
export function chipFor(category) {
  const c = (category || "").toLowerCase();
  for (const [needle, key] of CATEGORY_KEYWORDS) {
    if (c.includes(needle)) return key;
  }
  return "";
}
export function categoryHref(category) {
  const chip = chipFor(category);
  return chip ? `/studios?cat=${chip}` : "/studios";
}
