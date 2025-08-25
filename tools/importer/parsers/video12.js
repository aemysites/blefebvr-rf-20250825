/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must exactly match the example
  const headerRow = ['Video'];

  // Prepare an array for cell content
  const cellContent = [];

  // 1. Collect any visible image (poster/thumbnail) within the element
  // Find the first <img> in the subtree
  const img = element.querySelector('img');
  if (img) cellContent.push(img);

  // 2. Collect all visible text content in the element, including direct and indirect children
  // We want to get visible text not from controls, but from the block (e.g., overlay text, captions)
  // To do this, we'll traverse all child nodes and extract text nodes that are not empty
  // We'll skip text inside <script>, <style>, <button>, <svg>, <canvas>, and player UI elements
  function collectTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const txt = node.textContent.trim();
      if (txt) cellContent.push(txt);
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      !['SCRIPT', 'STYLE', 'BUTTON', 'SVG', 'CANVAS', 'VIDEO', 'AUDIO', 'TABLE'].includes(node.tagName) &&
      !node.className.includes('wistia_embed') &&
      !node.className.includes('w-bottom-bar') &&
      !node.className.includes('w-vulcan')
    ) {
      for (const child of node.childNodes) {
        collectTextNodes(child);
      }
    }
  }
  collectTextNodes(element);

  // 3. Extract the Wistia video ID and build a video link
  let videoId = null;
  const wistiaDiv = element.querySelector('[class*="wistia_async_"]');
  if (wistiaDiv) {
    const match = wistiaDiv.className.match(/wistia_async_([\w]+)/);
    if (match) videoId = match[1];
  }
  if (videoId) {
    const wistiaUrl = `https://fast.wistia.com/embed/medias/${videoId}`;
    // Add a <br> if there is already content
    if (cellContent.length > 0) cellContent.push(document.createElement('br'));
    const a = document.createElement('a');
    a.href = wistiaUrl;
    a.textContent = wistiaUrl;
    cellContent.push(a);
  }

  // 4. If nothing was found, as fallback, insert all direct children
  if (cellContent.length === 0) {
    for (const node of element.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        cellContent.push(node);
      }
    }
  }

  // Compose table rows as in the example: header row, content row
  const rows = [
    headerRow,
    [cellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
