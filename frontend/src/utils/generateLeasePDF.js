import jsPDF from 'jspdf';

export const generateLeasePDF = (booking) => {
  const doc = new jsPDF();
  
  // Colors and styling
  const primaryColor = [79, 70, 229]; // Indigo-600
  const textColor = [55, 65, 81]; // Gray-700
  
  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('E-LEASE AGREEMENT', 105, 25, null, null, 'center');
  
  // Reset text color
  doc.setTextColor(...textColor);
  
  // Agreement details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const today = new Date().toLocaleDateString();
  
  doc.text(`This Lease Agreement is made on ${today}, between:`, 20, 60);
  
  // Landlord
  doc.setFont('helvetica', 'bold');
  doc.text('LANDLORD (OWNER):', 20, 75);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${booking.owner?.name || 'N/A'}`, 25, 82);
  doc.text(`Email: ${booking.owner?.email || 'N/A'}`, 25, 89);
  
  // Tenant
  doc.setFont('helvetica', 'bold');
  doc.text('TENANT:', 110, 75);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${booking.tenant?.name || 'N/A'}`, 115, 82);
  doc.text(`Email: ${booking.tenant?.email || 'N/A'}`, 115, 89);
  
  // Property details
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 100, 190, 100);
  
  doc.setFont('helvetica', 'bold');
  doc.text('PROPERTY DETAILS:', 20, 115);
  doc.setFont('helvetica', 'normal');
  doc.text(`Property Name: ${booking.property?.title}`, 25, 122);
  doc.text(`Location: ${booking.property?.location}`, 25, 129);
  doc.text(`Room Type: ${booking.property?.roomType}`, 25, 136);
  
  // Financial terms
  doc.setFont('helvetica', 'bold');
  doc.text('FINANCIAL TERMS:', 20, 150);
  doc.setFont('helvetica', 'normal');
  doc.text(`Monthly Rent: Rs. ${booking.property?.rent}`, 25, 157);
  doc.text(`Security Deposit: Rs. ${booking.property?.deposit}`, 25, 164);
  doc.text(`Payment Status: ${booking.paymentStatus}`, 25, 171);
  
  // Terms and conditions
  doc.line(20, 180, 190, 180);
  doc.setFont('helvetica', 'bold');
  doc.text('TERMS & CONDITIONS:', 20, 195);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const terms = [
    "1. The Tenant shall pay the monthly rent in advance on or before the 5th of every month.",
    "2. The Security Deposit shall be refunded upon vacating the premises, subject to deductions for damages.",
    "3. The Tenant shall maintain the property in good condition and not sublet the premises.",
    "4. A notice period of 30 days is required by either party to terminate this agreement.",
    "5. This is a digitally generated document executed via the Unified Mentors platform."
  ];
  
  let y = 205;
  terms.forEach(term => {
    // split text to lines
    const lines = doc.splitTextToSize(term, 160);
    doc.text(lines, 25, y);
    y += (lines.length * 5) + 3;
  });
  
  // Signatures
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('SIGNATURES:', 20, y);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text(`Digitally signed by ${booking.owner?.name}`, 30, y + 20);
  doc.line(25, y + 22, 90, y + 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Owner', 50, y + 27);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  doc.text(`Digitally signed by ${booking.tenant?.name}`, 115, y + 20);
  doc.line(110, y + 22, 175, y + 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Tenant', 135, y + 27);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Booking ID: ${booking._id}`, 105, 290, null, null, 'center');
  
  // Save PDF
  doc.save(`Lease_Agreement_${booking._id}.pdf`);
};
