// Utility functions for Excel import/export of list templates

/**
 * Export templates to CSV format
 * CSV is more universal than Excel and easier to generate on frontend
 */
export function exportTemplatesAsCSV(templates) {
  if (!templates || templates.length === 0) {
    return '';
  }

  // CSV headers
  const headers = [
    'Title',
    'Description',
    'Context',
    'Word Count',
    'Level',
    'Rank',
    'Node',
    'Category',
    'Status'
  ];

  // CSV rows
  const rows = templates.map(t => [
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    `"${(t.context || '').replace(/"/g, '""')}"`,
    t.wordCount || 0,
    t.level || 'beginner',
    t.rank || '',
    t.node || '',
    `"${(t.category || '').replace(/"/g, '""')}"`,
    t.status || 'draft'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Import templates from CSV text
 */
export function importTemplatesFromCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have at least header and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const templates = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const template = {
      title: values[0] || '',
      description: values[1] || '',
      context: values[2] || '',
      wordCount: parseInt(values[3]) || 10,
      level: values[4] || 'beginner',
      rank: values[5] ? parseInt(values[5]) : undefined,
      node: values[6] ? parseInt(values[6]) : undefined,
      category: values[7] || '',
      status: values[8] || 'draft'
    };

    // Validate required fields
    if (!template.title || !template.context) {
      throw new Error(`Row ${i + 1}: Title and Context are required`);
    }

    templates.push(template);
  }

  return templates;
}

/**
 * Parse CSV line handling quoted values
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Trigger file download
 */
export function downloadFile(content, filename, type = 'text/csv') {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Parse file upload
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}
