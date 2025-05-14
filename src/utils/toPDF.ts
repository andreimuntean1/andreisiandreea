import { jsPDF } from "jspdf";

// Converts a message and author name into a downloadable PDF File
export const toPDF = (message: string, author: string): File => {
  // Create a new PDF document instance
  const doc = new jsPDF();

  // Set font size and style for the author's line
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");

  // Write the author information at the top of the document
  doc.text("De la: " + author, 10, 10);

  // Set a slightly smaller font for the message content
  doc.setFontSize(14);

  // Split the message into lines that fit within 200 units width
  doc.text(doc.splitTextToSize(message, 200), 10, 30);

  // Generate the PDF as a Blob object
  const blobData = doc.output("blob");

  // Convert the author's name to kebab-case for the file name
  const kebab = author
    .trim() // Remove leading/trailing whitespace
    .split(/\s+/) // Split by one or more spaces
    .map((p) => p.toLowerCase()) // Convert each part to lowercase
    .join("-"); // Join with dashes

  // Construct the final filename
  const filename = `mesaj-${kebab}.pdf`;

  // Create and return a new File object from the blob
  return new File([blobData], filename, {
    type: "application/pdf",
    lastModified: Date.now(), // Set the file's last modified time to now
  });
};
