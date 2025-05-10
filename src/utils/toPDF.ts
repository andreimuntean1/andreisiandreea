import { jsPDF } from "jspdf";

export const toPDF = (message: string, author: string): File => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("De la: " + author, 10, 10);

  doc.setFontSize(14);
  doc.text(doc.splitTextToSize(message, 200), 10, 30);

  const blobData = doc.output("blob");
  const kebab = author
    .trim()
    .split(/\s+/)
    .map((p) => p.toLowerCase())
    .join("-");
  const filename = `mesaj-${kebab}.pdf`;

  return new File([blobData], filename, {
    type: "application/pdf",
    lastModified: Date.now(),
  });
};
