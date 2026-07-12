import type { AppSnapshot } from './apiClient';

type CellValue = string | number | boolean | null | undefined;

export interface WorkbookSheet {
  name: string;
  rows: CellValue[][];
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function xmlEscape(value: CellValue) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function pdfEscape(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function colName(index: number) {
  let name = '';
  let n = index + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    n = Math.floor((n - rem - 1) / 26);
  }
  return name;
}

function sheetXml(rows: CellValue[][]) {
  const xmlRows = rows.map((row, rowIndex) => {
    const cells = row.map((value, colIndex) => {
      const ref = `${colName(colIndex)}${rowIndex + 1}`;
      if (typeof value === 'number' && Number.isFinite(value)) {
        return `<c r="${ref}"><v>${value}</v></c>`;
      }
      return `<c r="${ref}" t="inlineStr"><is><t>${xmlEscape(value)}</t></is></c>`;
    }).join('');
    return `<row r="${rowIndex + 1}">${cells}</row>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${xmlRows}</sheetData>
</worksheet>`;
}

function crc32(data: Uint8Array) {
  let crc = -1;
  for (let i = 0; i < data.length; i += 1) {
    crc ^= data[i];
    for (let j = 0; j < 8; j += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ -1) >>> 0;
}

function writeUint16(target: number[], value: number) {
  target.push(value & 0xff, (value >>> 8) & 0xff);
}

function writeUint32(target: number[], value: number) {
  target.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
}

function createZip(files: { path: string; content: string }[]) {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  files.forEach((file) => {
    const name = encoder.encode(file.path);
    const content = encoder.encode(file.content);
    const crc = crc32(content);
    const local: number[] = [];

    writeUint32(local, 0x04034b50);
    writeUint16(local, 20);
    writeUint16(local, 0);
    writeUint16(local, 0);
    writeUint16(local, 0);
    writeUint16(local, 0);
    writeUint32(local, crc);
    writeUint32(local, content.length);
    writeUint32(local, content.length);
    writeUint16(local, name.length);
    writeUint16(local, 0);
    chunks.push(new Uint8Array([...local, ...name]), content);

    const centralRecord: number[] = [];
    writeUint32(centralRecord, 0x02014b50);
    writeUint16(centralRecord, 20);
    writeUint16(centralRecord, 20);
    writeUint16(centralRecord, 0);
    writeUint16(centralRecord, 0);
    writeUint16(centralRecord, 0);
    writeUint16(centralRecord, 0);
    writeUint32(centralRecord, crc);
    writeUint32(centralRecord, content.length);
    writeUint32(centralRecord, content.length);
    writeUint16(centralRecord, name.length);
    writeUint16(centralRecord, 0);
    writeUint16(centralRecord, 0);
    writeUint16(centralRecord, 0);
    writeUint16(centralRecord, 0);
    writeUint32(centralRecord, 0);
    writeUint32(centralRecord, offset);
    central.push(new Uint8Array([...centralRecord, ...name]));

    offset += local.length + name.length + content.length;
  });

  const centralSize = central.reduce((sum, item) => sum + item.length, 0);
  const end: number[] = [];
  writeUint32(end, 0x06054b50);
  writeUint16(end, 0);
  writeUint16(end, 0);
  writeUint16(end, files.length);
  writeUint16(end, files.length);
  writeUint32(end, centralSize);
  writeUint32(end, offset);
  writeUint16(end, 0);

  return new Blob([...chunks, ...central, new Uint8Array(end)], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}

export function exportWorkbook(filename: string, sheets: WorkbookSheet[]) {
  const safeSheets = sheets.map((sheet, index) => ({
    ...sheet,
    name: sheet.name.replace(/[\\/*?:[\]]/g, ' ').slice(0, 31) || `Feuille ${index + 1}`
  }));

  const workbookSheets = safeSheets.map((sheet, index) =>
    `<sheet name="${xmlEscape(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`
  ).join('');
  const workbookRels = safeSheets.map((_sheet, index) =>
    `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`
  ).join('');
  const worksheetOverrides = safeSheets.map((_sheet, index) =>
    `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
  ).join('');

  const files = [
    {
      path: '[Content_Types].xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  ${worksheetOverrides}
</Types>`
    },
    {
      path: '_rels/.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
    },
    {
      path: 'xl/workbook.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>${workbookSheets}</sheets>
</workbook>`
    },
    {
      path: 'xl/_rels/workbook.xml.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${workbookRels}</Relationships>`
    },
    ...safeSheets.map((sheet, index) => ({
      path: `xl/worksheets/sheet${index + 1}.xml`,
      content: sheetXml(sheet.rows)
    }))
  ];

  downloadBlob(createZip(files), filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

export function exportPdf(filename: string, title: string, lines: string[]) {
  const pages: string[][] = [];
  for (let index = 0; index < lines.length; index += 34) {
    pages.push(lines.slice(index, index + 34));
  }
  if (pages.length === 0) pages.push(['Aucune donnee disponible.']);

  const objects: string[] = [];
  const pageObjectIds: number[] = [];
  const fontObjectId = 3 + pages.length * 2;
  objects[1] = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
  objects[2] = '';

  pages.forEach((pageLines, pageIndex) => {
    const pageObjectId = 3 + pageIndex * 2;
    const contentObjectId = pageObjectId + 1;
    pageObjectIds.push(pageObjectId);
    const content = [
      'BT',
      '/F1 16 Tf',
      '50 790 Td',
      `(${pdfEscape(title)}) Tj`,
      '/F1 10 Tf',
      '0 -24 Td',
      ...pageLines.flatMap((line) => [`(${pdfEscape(line.slice(0, 110))}) Tj`, '0 -18 Td']),
      'ET'
    ].join('\n');
    objects[pageObjectId] = `${pageObjectId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>\nendobj\n`;
    objects[contentObjectId] = `${contentObjectId} 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`;
  });

  objects[2] = `2 0 obj\n<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageObjectIds.length} >>\nendobj\n`;
  objects[fontObjectId] = `${fontObjectId} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (let id = 1; id <= fontObjectId; id += 1) {
    offsets[id] = pdf.length;
    pdf += objects[id];
  }
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${fontObjectId + 1}\n0000000000 65535 f \n`;
  for (let id = 1; id <= fontObjectId; id += 1) {
    pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${fontObjectId + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  downloadBlob(new Blob([pdf], { type: 'application/pdf' }), filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

export function buildExportSheets(snapshot: AppSnapshot): WorkbookSheet[] {
  return [
    {
      name: 'Candidatures',
      rows: [
        ['Etudiant', 'Email', 'Entreprise', 'Stage', 'Statut', 'Date depot', 'Motif rejet'],
        ...snapshot.applications.map((app) => [
          app.studentName,
          app.studentEmail,
          app.companyName,
          app.internshipTitle,
          app.status,
          app.createdAt,
          app.rejectionReason || ''
        ])
      ]
    },
    {
      name: 'Etudiants',
      rows: [
        ['Nom', 'Email', 'Entreprise', 'Departement', 'Specialite', 'Statut', 'Archive'],
        ...snapshot.students.map((student) => [
          student.name,
          student.email,
          student.companyName || '',
          student.departmentName || '',
          student.specialty || '',
          student.status || '',
          student.isArchived ? 'Oui' : 'Non'
        ])
      ]
    },
    {
      name: 'Rapports',
      rows: [
        ['Etudiant', 'Date', 'Activite', 'Heures', 'Statut', 'Commentaire'],
        ...snapshot.dailyReports.map((report) => [
          report.studentName,
          report.date,
          report.activity,
          report.hoursWorked,
          report.status,
          report.adminComment || report.supervisorComment || ''
        ])
      ]
    },
    {
      name: 'Presences',
      rows: [
        ['Etudiant', 'Date', 'Arrivee', 'Sortie', 'Statut', 'Commentaire'],
        ...snapshot.attendanceRecords.map((record) => [
          record.studentName,
          record.date,
          record.arrivalTime,
          record.departureTime || '',
          record.status,
          record.comment || ''
        ])
      ]
    },
    {
      name: 'Archives',
      rows: [
        ['Etudiant', 'Email', 'Entreprise', 'Raison', 'Motif', 'Date archivage'],
        ...snapshot.archives.map((archive) => [
          archive.studentName,
          archive.studentEmail || '',
          archive.companyName || archive.snapshot.companyName || '',
          archive.reason,
          archive.rejectionReason || archive.snapshot.rejectionReason || '',
          archive.archivedAt
        ])
      ]
    }
  ];
}

export function buildPdfLines(snapshot: AppSnapshot) {
  const accepted = snapshot.applications.filter((app) => app.status === 'accepte' || app.status === 'en_stage').length;
  const rejected = snapshot.applications.filter((app) => app.status === 'rejete').length;
  const pending = snapshot.applications.filter((app) => app.status === 'en_attente').length;
  return [
    `Generation: ${new Date().toLocaleString()}`,
    `Entreprises: ${snapshot.companies.length}`,
    `Offres de stage: ${snapshot.internships.length}`,
    `Candidatures: ${snapshot.applications.length}`,
    `Candidatures acceptees/en stage: ${accepted}`,
    `Candidatures rejetees: ${rejected}`,
    `Candidatures en attente: ${pending}`,
    `Rapports journaliers: ${snapshot.dailyReports.length}`,
    `Presences deposees: ${snapshot.attendanceRecords.length}`,
    `Dossiers archives: ${snapshot.archives.length}`,
    '',
    'Dernieres candidatures:',
    ...snapshot.applications.slice(0, 25).map((app) => `${app.studentName} - ${app.companyName} - ${app.internshipTitle} - ${app.status}`)
  ];
}
