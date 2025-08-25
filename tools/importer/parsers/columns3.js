/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct child divs
  const divs = Array.from(element.querySelectorAll(':scope > div'));
  // Try to find the main content wrapper and form wrapper
  let contentWrapper = null;
  let newsletterFormWrapper = null;
  divs.forEach((div) => {
    if (div.classList.contains('default-content-wrapper')) {
      contentWrapper = div;
    } else if (div.classList.contains('newsletter-form-wrapper')) {
      newsletterFormWrapper = div;
    }
  });

  // Left column: all content from contentWrapper
  let leftContent = '';
  if (contentWrapper) {
    // Get all children as array; preserve structure
    leftContent = Array.from(contentWrapper.childNodes).filter(node => {
      // Only keep text nodes with actual text, or elements
      return (node.nodeType === 1) || (node.nodeType === 3 && node.textContent.trim().length > 0);
    });
    // If only one node, use just the node directly
    if (leftContent.length === 1) leftContent = leftContent[0];
    // If empty, fallback to empty string
    if (!leftContent || leftContent.length === 0) leftContent = '';
  }

  // Center and right columns come from the newsletter form
  let emailInput = '';
  let submitButton = '';
  if (newsletterFormWrapper) {
    // Only use the first form in the newsletterFormWrapper
    const form = newsletterFormWrapper.querySelector('form');
    if (form) {
      // Find the first email input and button type=submit
      emailInput = form.querySelector('input[type="email"]') || '';
      submitButton = form.querySelector('button[type="submit"]') || '';
    }
  }

  // Build the table structure
  const headerRow = ['Columns (columns3)'];
  const contentRow = [leftContent, emailInput, submitButton];

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
