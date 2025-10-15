# Google Apps Script Setup for Email Collection

This guide will help you connect the landing page email signup form to your Google Spreadsheet.

## Spreadsheet ID
`1VIQs67ABoDBdK85WMDqM_d_2lFxJofJ_AQq0MaokUJA`

## Step 1: Prepare Your Spreadsheet

1. Open your spreadsheet: https://docs.google.com/spreadsheets/d/1VIQs67ABoDBdK85WMDqM_d_2lFxJofJ_AQq0MaokUJA/edit
2. Create a new sheet tab called "Email Signups" (or use an existing one)
3. Add these column headers in row 1:
   - Column A: **Timestamp**
   - Column B: **Name**
   - Column C: **Email**
   - Column D: **Pet Name**
   - Column E: **Note**

## Step 2: Create Google Apps Script

1. Go to https://script.google.com/
2. Click "New Project"
3. Delete any existing code
4. Paste the following code:

```javascript
function doPost(e) {
  try {
    // Open your spreadsheet
    const spreadsheet = SpreadsheetApp.openById('1VIQs67ABoDBdK85WMDqM_d_2lFxJofJ_AQq0MaokUJA');

    // Get the "Email Signups" sheet (or change to your sheet name)
    const sheet = spreadsheet.getSheetByName('Email Signups');

    // If sheet doesn't exist, use the first sheet
    const targetSheet = sheet || spreadsheet.getSheets()[0];

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // Append a new row with the form data
    targetSheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.petName || '',
      data.note || ''
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify setup
function testSetup() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        name: 'Test User',
        email: 'test@example.com',
        petName: 'Test Pet',
        note: 'This is a test submission'
      })
    }
  };

  const result = doPost(testData);
  Logger.log(result.getContent());
}
```

5. Click the save icon (💾) or press `Cmd+S` / `Ctrl+S`
6. Name your project: "PetWell Email Signup Handler"

## Step 3: Test the Script (Optional but Recommended)

1. In the Apps Script editor, select the `testSetup` function from the dropdown
2. Click the Run button (▶️)
3. Grant permissions when prompted (you'll need to authorize the script)
4. Check your spreadsheet - you should see a test row added
5. Delete the test row

## Step 4: Deploy as Web App

1. Click "Deploy" → "New deployment"
2. Click the gear icon ⚙️ next to "Select type"
3. Choose "Web app"
4. Configure:
   - **Description**: "PetWell Landing Page Form Handler"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click "Deploy"
6. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

## Step 5: Add Web App URL to Your Project

1. Navigate to your lander directory:
   ```bash
   cd /Users/azymuth/www/petwell/www/petwell.github.io/static/lander-e89cd777
   ```

2. Create a `.env` file (or edit if it exists):
   ```bash
   echo "VITE_GOOGLE_SCRIPT_URL=YOUR_WEB_APP_URL_HERE" > .env
   ```

   Replace `YOUR_WEB_APP_URL_HERE` with the URL you copied

3. The `.env` file should look like:
   ```
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycby.../exec
   ```

## Step 6: Rebuild and Deploy

```bash
npm run build
git add .
git commit -m "Connect email form to Google Sheets via Apps Script"
git push
```

The GitHub Actions workflow will automatically rebuild and deploy your site.

## Testing the Integration

1. Wait for deployment to complete (~1-2 minutes)
2. Visit: https://petwellvets.github.io/static/lander-e89cd777/
3. Scroll to the email signup form
4. Fill it out and submit
5. Check your Google Spreadsheet - you should see a new row!

## Troubleshooting

**Form submissions not appearing in spreadsheet:**
- Check that the Web App URL in `.env` is correct
- Make sure you deployed with "Who has access: Anyone"
- Check Apps Script execution logs: https://script.google.com/ → Your project → Executions

**"Dev mode - not actually saved" message:**
- The `.env` file wasn't created or wasn't picked up by Vite
- Make sure to rebuild after creating `.env`
- Check that the env variable starts with `VITE_`

**Permission errors:**
- Re-authorize the script in Apps Script console
- Make sure "Execute as: Me" is selected in deployment settings

## Security Note

The Web App URL is public, but it only accepts POST requests with specific data format. The `.env` file is gitignored, so the URL won't be committed to your repository.
