import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

export const exportToPdf = async (dashboardRef, summaryData, charts, verdictText) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 10;
  let yPos = 20;

  // Add Header
  pdf.setFontSize(22);
  pdf.setTextColor(0, 51, 102); // Dark blue
  pdf.setFont("helvetica", "bold");
  pdf.text('SmartFund Manager', margin, yPos);
  
  yPos += 10;
  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100); // Gray
  pdf.setFont("helvetica", "normal");
  pdf.text('Wealth Projection Summary', margin, yPos);
  
  yPos += 5;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Add Summary Table
  const tableColumn = ["Metric", "Value"];
  const tableRows = [];

  summaryData.forEach(item => {
    const row = [item.title, item.value];
    tableRows.push(row);
  });

  pdf.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: yPos,
    theme: 'grid',
    headStyles: { fillColor: [0, 120, 215], textColor: 255 }, // Primary blue
    styles: { fontSize: 11, cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right' }
    }
  });

  yPos = pdf.autoTable.previous.finalY + 15;

  // Add Verdict Section if available
  if (verdictText) {
    // Check if we need a new page for the verdict
    if (yPos + 40 > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPos = margin + 10;
    }

    // Draw a box for the verdict
    pdf.setFillColor(240, 248, 255); // Light blue background
    pdf.setDrawColor(0, 120, 215); // Primary blue border
    pdf.roundedRect(margin, yPos, pageWidth - (margin * 2), 30, 3, 3, 'FD');
    
    yPos += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 51, 102);
    pdf.setFont("helvetica", "bold");
    pdf.text('Debt Accelerator Verdict:', margin + 5, yPos);
    
    yPos += 10;
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "normal");
    
    // Split text to fit within the box if it's too long
    const splitVerdict = pdf.splitTextToSize(verdictText, pageWidth - (margin * 2) - 10);
    pdf.text(splitVerdict, margin + 5, yPos);
    
    yPos += (splitVerdict.length * 6) + 10; // Adjust yPos based on lines of text + padding
  }

  // Add Charts
  for (const chart of charts) {
    if (chart.ref && chart.ref.current) {
        const chartCanvas = await html2canvas(chart.ref.current, { scale: 2 }); // Scale 2 for better quality
        const chartImgData = chartCanvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(chartImgData);
        
        // Optimize chart width for A4
        const pdfChartWidth = pageWidth - (margin * 2);
        const pdfChartHeight = (imgProps.height * pdfChartWidth) / imgProps.width;

        // Check if we need a new page for this chart
        if (yPos + pdfChartHeight > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          yPos = margin + 10;
        }

        pdf.addImage(chartImgData, 'PNG', margin, yPos, pdfChartWidth, pdfChartHeight);
        yPos += pdfChartHeight + 15;
    }
  }

  pdf.save('wealth_projection_report.pdf');
};
