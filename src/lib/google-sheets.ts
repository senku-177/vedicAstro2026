import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Auth Setup
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || '', serviceAccountAuth);

// Define Headers
const HEADERS = ['LeadID', 'Date', 'Name', 'Email', 'Phone', 'DOB', 'Plan', 'Status', 'PaymentID', 'Amount', 'Error'];

// 1. CREATE: Log a new lead (When user submits details)
export async function createLeadInSheet(data: any) {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.setHeaderRow(HEADERS);

    const row = await sheet.addRow({
      LeadID: data.leadId,
      Date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      Name: data.name,
      Email: data.email || '',
      Phone: data.phone || '',
      DOB: `${data.dob} ${data.time}`,
      Plan: 'Not Selected',
      Status: 'INITIATED', // <--- This marks them as a lead (Potential Churn if they don't pay)
      PaymentID: '',
      Amount: '',
      Error: ''
    });
    return true;
  } catch (error) {
    console.error("Sheet Create Error:", error);
    return false;
  }
}

// 2. UPDATE: Update status after payment/delivery
export async function updateLeadStatus(leadId: string, updateData: any) {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    console.log(`Updating lead ${leadId} with data:`, updateData);
    // Find the row by LeadID
    const row = rows.find(r => r.get('LeadID') === leadId);

    if (row) {
      if (updateData.status) row.set('Status', updateData.status);
      if (updateData.paymentId) row.set('PaymentID', updateData.paymentId);
      if (updateData.plan) row.set('Plan', updateData.plan);
      if (updateData.amount) row.set('Amount', updateData.amount);
      if (updateData.email) row.set('Email', updateData.email); // Capture email if added later
      if (updateData.error) row.set('Error', updateData.error);
      
      await row.save();
      return true;
    } 
    return false; // Row not found
  } catch (error) {
    console.error("Sheet Update Error:", error);
    return false;
  }
}