/**
 * Generates the branded HTML email template for GotAccepted contact form replies.
 * 
 * @param recipientName The name of the person receiving the email
 * @param originalMessage The message they sent originally
 * @param replyText The drafted response text
 * @param headerImageUrl Optional banner image URL (defaults to a placeholder)
 * @returns A string of HTML representing the email body
 */
export function generateReplyEmailHtml(
  recipientName: string,
  originalMessage: string,
  replyText: string,
  headerImageUrl?: string
): string {
  const bannerUrl = headerImageUrl || process.env.NEXT_PUBLIC_EMAIL_BANNER_URL || "https://placehold.co/600x150/000000/ff6b00?text=GotAccepted+Banner";

  // We format the text to respect line breaks properly in HTML by converting newlines to <br> tags.
  // We use replaceAll so paragraphs are preserved nicely in all email clients.
  const formattedReplyText = replyText.replace(/\n/g, '<br />');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Response from GotAccepted</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000; -webkit-font-smoothing: antialiased;">
  
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; overflow: hidden;">
          
          <!-- Branded Header Image (Replace URL when you upload to bucket) -->
          <tr>
            <td style="background-color: #000000; text-align: center;">
              <img 
                src="${bannerUrl}" 
                alt="GotAccepted Header" 
                width="600" 
                style="display: block; width: 100%; max-width: 600px; height: auto;" 
              />
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin-top: 0; margin-bottom: 24px; color: #000000; font-size: 18px; font-weight: bold;">
                Dear <span style="color: #FF6B00;">${recipientName}</span>,
              </h2>
              
              <div style="font-size: 16px; line-height: 1.6; color: #000000; margin-bottom: 40px;">
                ${formattedReplyText}
              </div>
              
              <!-- Original Message Blockquote -->
              <div style="margin-top: 40px; border-top: 1px solid #000000; padding-top: 20px;">
                <p style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #000000; margin-bottom: 12px;">
                  Original Inquiry (${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}):
                </p>
                <blockquote style="margin: 0; padding: 15px 20px; border-left: 3px solid #FF6B00; background-color: #fcfcfc; color: #000000; font-size: 14px; line-height: 1.5;">
                  ${originalMessage.replace(/\n/g, '<br />')}
                </blockquote>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #2d5bbf; padding: 30px 40px; text-align: center;">
              <p style="margin: 0; font-size: 14px; font-weight: bold; color: #ffffff;">
                The GotAccepted Team
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #ffffff;">
                <a href="https://gotaccepted.org" style="color: #ffffff; text-decoration: underline; font-weight: bold;">www.gotaccepted.org</a>
              </p>
            </td>
          </tr>

        </table>
        
        <!-- Bottom Unsubscribe / Info (Optional for standard replies, but good practice) -->
        <p style="text-align: center; font-size: 11px; color: #000000; margin-top: 20px; opacity: 0.6;">
          This is an official response from GotAccepted.
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}
