import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateWealthReportPDF = async (summaryData, chart1Id, chart2Id) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  let yPos = margin;

  // 1. Add Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SmartFund Manager', margin, yPos);
  yPos += 8;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Wealth Projection Report', margin, yPos);
  yPos += 10;
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // 2. Add Summary Table
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Financial Summary', margin, yPos);
  yPos += 8;

  const tableData = summaryData.map(item => [item.title, item.value]);
  const tableHeaders = [['Metric', 'Value']];

  // Using jspdf-autotable would be better, but this is a manual approach
  pdf.setFontSize(10);
  const cellPadding = 2;
  const colWidths = [60, 60];
  
  // Draw header
  pdf.setFont('helvetica', 'bold');
  pdf.rect(margin, yPos, colWidths[0], 10);
  pdf.text(tableHeaders[0][0], margin + cellPadding, yPos + 7);
  pdf.rect(margin + colWidths[0], yPos, colWidths[1], 10);
  pdf.text(tableHeaders[0][1], margin + colWidths[0] + cellPadding, yPos + 7);
  yPos += 10;

  // Draw rows
  pdf.setFont('helvetica', 'normal');
  tableData.forEach(row => {
    pdf.rect(margin, yPos, colWidths[0], 10);
    pdf.text(row[0], margin + cellPadding, yPos + 7);
    pdf.rect(margin + colWidths[0], yPos, colWidths[1], 10);
    pdf.text(row[1], margin + colWidths[0] + cellPadding, yPos + 7);
    yPos += 10;
  });

  yPos += 10; // Space before charts

  // 3. Capture and Add Charts
  const captureChart = async (chartId) => {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) {
      console.error(`Element with id ${chartId} not found.`);
      return null;
    }
    const canvas = await html2canvas(chartElement, { scale: 2 });
    return canvas.toDataURL('image/png');
  };

  const chart1Image = await captureChart(chart1Id);
  const chart2Image = await captureChart(chart2Id);

  const availableWidth = pageWidth - (margin * 2);
  const chartHeight = (availableWidth / 1.618); // Golden ratio for aesthetics

  if (chart1Image) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Inflation-Adjusted Wealth Growth', margin, yPos);
    yPos += 8;
    pdf.addImage(chart1Image, 'PNG', margin, yPos, availableWidth, chartHeight);
    yPos += chartHeight + 10;
  }

  // Check if a new page is needed
  if (yPos + chartHeight > pageHeight - margin) {
    pdf.addPage();
    yPos = margin;
  }

  if (chart2Image) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Year-on-Year Cash Flow', margin, yPos);
    yPos += 8;
    pdf.addImage(chart2Image, 'PNG', margin, yPos, availableWidth, chartHeight);
  }

  // 4. Save PDF
  pdf.save('wealth_report.pdf');
};
