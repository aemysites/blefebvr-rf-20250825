/* global WebImporter */
export default function parse(element, { document }) {
  // Get the default content wrapper
  const wrapper = element.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  // Get the branding/logo section (left column)
  const brandDiv = wrapper.querySelector('.footer-brand');

  // Get the links section (right columns)
  const linksDiv = wrapper.querySelector('.footer-links');

  // Gather the links and split into two columns
  let col1 = [];
  let col2 = [];
  if (linksDiv) {
    const links = Array.from(linksDiv.querySelectorAll('.footer-link'));
    const mid = Math.ceil(links.length / 2);
    col1 = links.slice(0, mid);
    col2 = links.slice(mid);
  }

  // Create header row: single cell, as per example
  const headerRow = ['Columns (columns5)'];

  // Create content row: 3 columns (brand, col1 links, col2 links)
  const row = [brandDiv, col1, col2];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    row
  ], document);

  // Replace the original element
  element.replaceWith(block);
}
