/**
 * Google Sheets integration for email collection
 * Note: This is a client-side implementation using Google Sheets as a simple backend
 * For production, consider using a proper backend or service like Netlify Forms
 */

interface FormData {
  name: string;
  email: string;
  petName?: string;
  note?: string;
}

/**
 * Submit form data to Google Sheets
 * Using Google Apps Script Web App as a proxy
 */
export async function submitToGoogleSheets(data: FormData): Promise<{ success: boolean; message: string }> {
  try {
    // For now, we'll use a simple fetch to Google Forms or Apps Script
    // You'll need to set up a Google Apps Script Web App that accepts POST requests

    // Placeholder: In production, replace with your Google Apps Script URL
    const scriptUrl = (import.meta as any).env?.VITE_GOOGLE_SCRIPT_URL as string | undefined;

    if (!scriptUrl) {
      console.warn('Google Sheets integration not configured. Form data:', data);
      // Fallback: just log for development
      return {
        success: true,
        message: 'Thanks! We\'ve received your information. (Dev mode - not actually saved)'
      };
    }

    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString()
      })
    });

    // Note: no-cors mode means we can't read the response
    // We assume success if no error is thrown
    return {
      success: true,
      message: 'Thanks for joining! We\'ll be in touch soon.'
    };

  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    return {
      success: false,
      message: 'Oops! Something went wrong. Please try again.'
    };
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Setup instructions for Google Sheets integration
 */
export function getSetupInstructions(): string {
  return `
To set up Google Sheets integration:

1. Create a new Google Apps Script project
2. Add this code:

function doPost(e) {
  const sheet = SpreadsheetApp.openById('1VIQs67ABoDBdK85WMDqM_d_2lFxJofJ_AQq0MaokUJA').getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp,
    data.name,
    data.email,
    data.petName || '',
    data.note || ''
  ]);

  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}

3. Deploy as Web App (Execute as: Me, Access: Anyone)
4. Copy the Web App URL to .env as VITE_GOOGLE_SCRIPT_URL
5. Make sure your spreadsheet has headers: Timestamp, Name, Email, Pet Name, Note
`;
}
