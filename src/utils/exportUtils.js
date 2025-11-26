import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Export Members to Excel
export const exportMembersToExcel = (members, filename = 'members') => {
  // Prepare data
  const data = members.map(member => ({
    'ID': member.id || member.member_code || '-',
    'Name': member.name || '-',
    'Father': member.father_name || '-',
    'Address': member.address || '-',
    'City': member.city || member.location || '-',
    'Phone No': member.phone || '-',
    'Shift': member.shift || '-',
    'Joined': member.start_date || member.joined_date || '-',
    'BirthDate': member.birthdate || member.date_of_birth || '-',
    'Email': member.email || '-',
    'Plan': member.membership_type || '-',
    'Status': member.status || '-',
    'Contract From': member.start_date || '-',
    'Contract Till': member.end_date || '-',
    'Due Date': member.next_bill_date || '-',
    'Due Amount': member.due_amount || '0.00'
  }));

  // Create workbook
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Members');

  // Auto-size columns
  const colWidths = data.length > 0 ? Object.keys(data[0]).map(key => ({
    wch: Math.max(key.length, ...data.map(row => String(row[key] || '').length))
  })) : [];
  ws['!cols'] = colWidths;

  // Export
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Export Members to PDF
export const exportMembersToPDF = (members, filename = 'members') => {
  const doc = new jsPDF('landscape');
  
  // Add title
  doc.setFontSize(16);
  doc.text('Members Report', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
  
  // Prepare table data
  const tableData = members.map(member => [
    member.id || member.member_code || '-',
    member.name || '-',
    member.phone || '-',
    member.email || '-',
    member.membership_type || '-',
    member.status || '-',
    member.start_date || '-',
    member.end_date || '-'
  ]);

  // Add table
  doc.autoTable({
    head: [['ID', 'Name', 'Phone', 'Email', 'Plan', 'Status', 'Start Date', 'End Date']],
    body: tableData,
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [220, 38, 38] }, // Red color
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Save
  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Export Attendance to Excel
export const exportAttendanceToExcel = (attendanceData, filename = 'attendance') => {
  const data = attendanceData.map(record => ({
    'Date': record.date || '-',
    'Member ID': record.member_id || '-',
    'Member Name': record.member_name || record.name || '-',
    'Phone': record.phone || '-',
    'Check In': record.check_in_time || '-',
    'Check Out': record.check_out_time || '-',
    'Location': record.location || '-'
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

  const colWidths = data.length > 0 ? Object.keys(data[0]).map(key => ({
    wch: Math.max(key.length, ...data.map(row => String(row[key] || '').length))
  })) : [];
  ws['!cols'] = colWidths;

  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Export Attendance to PDF
export const exportAttendanceToPDF = (attendanceData, filename = 'attendance') => {
  const doc = new jsPDF('landscape');
  
  doc.setFontSize(16);
  doc.text('Attendance Report', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
  
  const tableData = attendanceData.map(record => [
    record.date || '-',
    record.member_name || record.name || '-',
    record.phone || '-',
    record.check_in_time || '-',
    record.check_out_time || '-'
  ]);

  doc.autoTable({
    head: [['Date', 'Member Name', 'Phone', 'Check In', 'Check Out']],
    body: tableData,
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [220, 38, 38] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};

