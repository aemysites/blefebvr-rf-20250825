/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row must match example exactly
  const headerRow = ['Hero (hero16)'];

  // Find the background image: Prefer .picture-container picture or img
  let backgroundImgEl = null;
  const pictureContainer = element.querySelector('.picture-container');
  if (pictureContainer) {
    const pic = pictureContainer.querySelector('picture');
    if (pic) {
      backgroundImgEl = pic;
    } else {
      const img = pictureContainer.querySelector('img');
      if (img) backgroundImgEl = img;
    }
  } else {
    // fallback, search for picture or img anywhere in the element
    const pic = element.querySelector('picture');
    if (pic) {
      backgroundImgEl = pic;
    } else {
      const img = element.querySelector('img');
      if (img) backgroundImgEl = img;
    }
  }

  // Find the content container (should include heading etc)
  let contentContainer = element.querySelector('.inner-content-container');
  if (!contentContainer) {
    // fallback: use .header-container or h1 if present
    contentContainer = element.querySelector('.header-container');
    if (!contentContainer) {
      const h1 = element.querySelector('h1');
      if (h1) {
        contentContainer = document.createElement('div');
        contentContainer.appendChild(h1);
      }
    }
  }

  // Table requires exactly 3 rows and 1 column per requirements/markdown
  // If values are missing, cells should be empty
  const rows = [];
  rows.push(headerRow);

  // 2nd row: background image
  rows.push([backgroundImgEl ? backgroundImgEl : '']);
  // 3rd row: content container
  rows.push([contentContainer ? contentContainer : '']);

  // Create and replace with the new table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
