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
    // Get the Google Apps Script URL from environment variable
    const scriptUrl = (import.meta as any).env?.VITE_GOOGLE_SCRIPT_URL as string | undefined;

    if (!scriptUrl) {
      console.warn('Google Sheets integration not configured. Form data:', data);
      // Development fallback
      return {
        success: false,
        message: 'Form submission is not configured yet. Please contact support.'
      };
    }

    // Submit to Google Apps Script
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // Use text/plain to avoid CORS preflight
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString()
      })
    });

    // Try to parse the response
    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: 'Thanks for joining! We\'ll be in touch soon.'
      };
    } else {
      return {
        success: false,
        message: result.message || 'Something went wrong. Please try again.'
      };
    }

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
