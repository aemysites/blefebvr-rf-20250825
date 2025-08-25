/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match the block name exactly
  const headerRow = ['Embed (embedVideo4)'];

  // We'll collect all visible content from the main embed area
  // including text and images, and the embed link
  let cellContent = [];

  // Select the main embed content area
  // Use the first child .embed or fallback to the element itself
  let mainEmbed = element.querySelector('.embed') || element;

  // 1. Collect any images in the block (keep order)
  const imgs = Array.from(mainEmbed.querySelectorAll('img'));
  if (imgs.length) cellContent = cellContent.concat(imgs);

  // 2. Collect all visible text content, skipping script/style elements
  // Walk all descendants, include each text node with non-empty content
  function collectTextNodes(node) {
    let nodes = [];
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const t = child.textContent.replace(/\s+/g, ' ').trim();
        if (t) {
          nodes.push(document.createTextNode(t + ' '));
        }
      } else if (child.nodeType === Node.ELEMENT_NODE && !['SCRIPT','STYLE'].includes(child.tagName)) {
        nodes = nodes.concat(collectTextNodes(child));
      }
    }
    return nodes;
  }
  // Only add text if it exists
  const textNodes = collectTextNodes(mainEmbed).filter(n => n.textContent.trim());
  if (textNodes.length) {
    if (cellContent.length) cellContent.push(document.createElement('br'));
    cellContent = cellContent.concat(textNodes);
  }

  // 3. Find the video URL (prefer m3u8 source for Wistia)
  let videoUrl = '';
  const source = mainEmbed.querySelector('source[type="application/x-mpegURL"]');
  if (source && source.src) {
    videoUrl = source.src;
  } else {
    const video = mainEmbed.querySelector('video');
    if (video && video.src && video.src.startsWith('http')) {
      videoUrl = video.src;
    }
    if (!videoUrl) {
      const iframe = mainEmbed.querySelector('iframe');
      if (iframe && iframe.src) {
        videoUrl = iframe.src;
      }
    }
  }
  if (videoUrl) {
    // Add a break if other content already exists
    if (cellContent.length) cellContent.push(document.createElement('br'));
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    cellContent.push(link);
  }

  // 4. Fallback: if nothing, set to empty string
  const contentRow = [cellContent.length ? cellContent : ''];

  // 5. Compose table and replace
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
