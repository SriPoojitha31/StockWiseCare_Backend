import PDFDocument from 'pdfkit';
import fs from 'fs';

export const generateReport = (data, filePath) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(18).text('User Report', { underline: true });

  data.forEach((item, i) => {
    doc.moveDown().fontSize(12).text(`${i + 1}. ${item}`);
  });

  doc.end();
};
