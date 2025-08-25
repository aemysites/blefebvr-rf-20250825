/* global WebImporter */
export default function parse(element, { document }) {
  // Find all block tables in the element
  const blockTables = Array.from(element.querySelectorAll('div.table.block'));
  blockTables.forEach(tableBlock => {
    const nativeTable = tableBlock.querySelector('table');
    if (!nativeTable) return;
    // Extract table content
    const thead = nativeTable.querySelector('thead');
    const tbody = nativeTable.querySelector('tbody');
    const rows = [];
    // Get header (column headers)
    if (thead) {
      Array.from(thead.querySelectorAll('tr')).forEach(tr => {
        const ths = Array.from(tr.querySelectorAll('th')).map(th => {
          // Reference all children of the th (keep formatting, e.g. <strong>)
          return Array.from(th.childNodes);
        });
        rows.push(ths);
      });
    }
    // Get body (data rows)
    if (tbody) {
      Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
        const tds = Array.from(tr.querySelectorAll('td')).map(td => {
          // Reference all children of the td (keep links, etc)
          return Array.from(td.childNodes);
        });
        rows.push(tds);
      });
    }
    // Compose final cells array: Header row, then extracted rows
    const headerRow = ['Table (striped, bordered)'];
    const cells = [headerRow, ...rows];
    // Create the block table
    const block = WebImporter.DOMUtils.createTable(cells, document);
    tableBlock.replaceWith(block);
  });
}
