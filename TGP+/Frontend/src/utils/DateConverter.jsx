// utils/dateUtils.js

/**
 * Formats a date string into a more readable format (e.g., "November 3, 2024").
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date or 'N/A' if the dateString is falsy.
 */
export const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : 'N/A';
  };
  
  /**
   * Converts a date string into an input-friendly format (YYYY-MM-DD).
   * @param {string} dateString - The date string to convert.
   * @returns {string} - The input-friendly date format or an empty string if the dateString is falsy.
   */
  export const formatDateForInput = (dateString) => {
    return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
  };
  