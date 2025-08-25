/* global WebImporter */
export default function parse(element, { document }) {
  // Get the default content wrapper
  const wrapper = element.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  // Columns are: branding (logo/message) and links
  // First column: logo + message
  const brand = wrapper.querySelector('.footer-brand');
  // Second column: all the links
  const links = wrapper.querySelector('.footer-links');

  // Defensive fallback: create empty divs if missing
  const brandCell = brand || document.createElement('div');
  const linksCell = links || document.createElement('div');

  // Block table header - must match exact example
  const headerRow = ['Columns (columns15)'];
  // Content row: two columns, each contains referenced block
  const contentRow = [brandCell, linksCell];

  const cells = [
    headerRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
