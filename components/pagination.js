export function renderPagination(totalItems, itemsPerPage, currentPage) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return '';

  let html = '<nav class="pagination flex justify-center items-center gap-2 mt-8">';

  const linkBaseClasses = "pagination-link flex items-center justify-center w-10 h-10 rounded-md font-medium transition-colors duration-200 cursor-pointer";
  
  const linkNormalClasses = "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white";
  
  const linkActiveClasses = "bg-primary text-white border-primary hover:bg-primary-hover dark:border-primary dark:bg-primary dark:hover:bg-primary-hover";
  
  const linkDisabledClasses = "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600 opacity-60 cursor-not-allowed pointer-events-none";

  html += `
    <a class="${linkBaseClasses} ${currentPage === 1 ? linkDisabledClasses : linkNormalClasses}" 
       data-page="${currentPage - 1}">
      &laquo;
    </a>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <a class="${linkBaseClasses} ${i === currentPage ? linkActiveClasses : linkNormalClasses}" 
         data-page="${i}">
        ${i}
      </a>
    `;
  }

  html += `
    <a class="${linkBaseClasses} ${currentPage === totalPages ? linkDisabledClasses : linkNormalClasses}" 
       data-page="${currentPage + 1}">
      &raquo;
    </a>
  `;

  html += '</nav>';
  return html;
}