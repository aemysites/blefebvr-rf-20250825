/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards container
  const cardsBlock = element.querySelector('.cards-block');
  if (!cardsBlock) return;

  // Get all card-wrapper anchors (one card per anchor)
  const cards = Array.from(cardsBlock.querySelectorAll('.card-wrapper'));

  // Build the rows
  const rows = [['Cards']]; // Header row, exact as sample

  cards.forEach(card => {
    // First cell: Image (img element)
    let image = null;
    const thumbnail = card.querySelector('.thumbnail img');
    if (thumbnail) image = thumbnail;

    // Second cell: Structured text (date [optional], title, description, cta link)
    const textParts = [];

    // Date (if present)
    const date = card.querySelector('.date');
    if (date) textParts.push(date);

    // Title (h3.title)
    const title = card.querySelector('.title');
    if (title) textParts.push(title);

    // Description (p.description)
    const desc = card.querySelector('.description');
    if (desc) textParts.push(desc);

    // CTA link (always present as the card itself)
    // Only show if not redundant
    if (card.href) {
      const cta = document.createElement('a');
      cta.href = card.href;
      cta.textContent = 'Read more';
      cta.setAttribute('target', '_blank');
      cta.setAttribute('rel', 'noopener noreferrer');
      textParts.push(cta);
    }

    // Add one row for this card: [image, [text elements]]
    rows.push([
      image,
      textParts
    ]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
