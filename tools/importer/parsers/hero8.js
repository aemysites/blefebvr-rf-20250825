/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row: must match exactly
  const headerRow = ['Hero (hero8)'];

  // Background image row: this HTML has no image, so leave blank
  const bgImageRow = [''];

  // Content row: gather all text and form content, preserving structure
  // Use the .default-content-wrapper as the content source
  let contentWrapper = element.querySelector('.default-content-wrapper');
  let contentCell = [];

  if (contentWrapper) {
    // Gather all direct children, as these may include <p> and newsletter form
    // This approach is more robust to HTML changes.
    const children = Array.from(contentWrapper.children);
    children.forEach((child) => {
      contentCell.push(child);
    });
  }

  // Compose table rows
  const rows = [headerRow, bgImageRow, [contentCell]];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the table
  element.replaceWith(table);
}
