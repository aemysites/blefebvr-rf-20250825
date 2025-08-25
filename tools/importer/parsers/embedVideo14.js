/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block name
  const headerRow = ['Embed (embedVideo14)'];

  // Find the first iframe (only one expected for video embeds)
  const iframe = element.querySelector('iframe');

  // Collect all direct text nodes (not inside an element) from the source element
  const textNodes = [];
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      textNodes.push(document.createTextNode(node.textContent.trim()));
    }
  }

  // Compose the cell content: text first, then link to the iframe src (if present)
  const cellContent = [];
  if (textNodes.length > 0) {
    cellContent.push(...textNodes);
  }
  if (iframe && iframe.src) {
    const link = document.createElement('a');
    link.href = iframe.src;
    link.textContent = iframe.src;
    cellContent.push(link);
  }

  // If no text and no link, make sure we have at least an empty cell
  const contentRow = [cellContent.length > 0 ? cellContent : ''];

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
