// The last heading above the reading line owns the current section.
// Explicitly handle the document bottom, where short final sections cannot
// always reach that line.
export function activeSectionIndex(tops, readingLine, atBottom) {
  if (atBottom) return tops.length - 1;
  let active = 0;
  tops.forEach((top, index) => { if (top <= readingLine) active = index; });
  return active;
}
