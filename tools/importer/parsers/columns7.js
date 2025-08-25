/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with exact block name
  const headerRow = ['Columns (columns7)'];

  // Get .default-content-wrapper child
  const wrapper = element.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  // Find the left column: brand (logo and tagline)
  const brand = wrapper.querySelector('.footer-brand');

  // Find the right column: links
  const links = wrapper.querySelector('.footer-links');

  // Left column: reference the whole brand block if present
  // Right column: split links into two columns (match example visual)
  let leftCell = brand ? brand : '';
  let rightCell = '';
  if (links) {
    const linkEls = Array.from(links.querySelectorAll('.footer-link'));
    // The visual shows two vertical columns for links, so split evenly
    const midpoint = Math.ceil(linkEls.length / 2);
    const col1 = document.createElement('div');
    const col2 = document.createElement('div');
    linkEls.slice(0, midpoint).forEach(el => col1.appendChild(el));
    linkEls.slice(midpoint).forEach(el => col2.appendChild(el));
    // Arrange side by side
    const linksRow = document.createElement('div');
    linksRow.style.display = 'flex';
    linksRow.style.gap = '2em';
    linksRow.appendChild(col1);
    linksRow.appendChild(col2);
    rightCell = linksRow;
  }

  // Create the table
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
