import React, { useCallback, useEffect } from 'react';
import { waitForElements } from './utils';

interface TableManipulationProps {
  mapUrls: string[];
}

const TableManipulation: React.FC<TableManipulationProps> = ({ mapUrls }) => {
  const addTableHeaderField = useCallback(() => {
    const tableHeadRow = document.querySelector('.tlant-table-thead tr');

    if (tableHeadRow) {
      if (!tableHeadRow.querySelector('.new-field-th')) {

        const newTh = document.createElement('th');
        newTh.className = 'tlant-table-cell new-field-th';
        newTh.title = 'New Field';
        newTh.setAttribute('aria-label', 'New Field');

        newTh.innerHTML = `
          <div class="tlant-table-column-sorters">
            <span class="tlant-table-column-title">New Field</span>
          </div>
        `;

        tableHeadRow.appendChild(newTh);

      } else {
        console.log('New field already exists.');
      }
    } else {
      console.error('Table head not found.');
    }
  }, []);

  const addMapUrlsToTable = useCallback((mapUrls: string[]) => {
    const xpath = '(//tbody)[1]//a';
    waitForElements(xpath, (elements: HTMLElement[]) => {
      mapUrls.forEach((url, index) => {
        const row = elements[index];
        if (row) {
          let cell = row.querySelector('.new-field-td');
          if (!cell) {
            cell = document.createElement('td');
            cell.className = 'tlant-table-cell new-field-td';
            row.appendChild(cell);
          }

          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.textContent = 'View Route';

          link.addEventListener('click', (event) => {
            event.stopPropagation();
          });

          cell.innerHTML = '';
          cell.appendChild(link);
        }
      });
    });
  }, []);

  const observeTable = useCallback(() => {
    const tableBody = document.querySelector('.tlant-table-tbody');

    if (tableBody) {
      const observer = new MutationObserver(() => {
        addMapUrlsToTable(mapUrls);
      });

      observer.observe(tableBody, { childList: true, subtree: true });

      addMapUrlsToTable(mapUrls);
    }
  }, [addMapUrlsToTable, mapUrls]);

  useEffect(() => {
    addTableHeaderField();
    observeTable();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        addTableHeaderField();
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    addTableHeaderField();
  }, [addTableHeaderField, observeTable]);

  return null;
};

export default TableManipulation;
