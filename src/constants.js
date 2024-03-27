function mail_html(generatedOtp) {
    return `<!DOCTYPE html">
    <html lang=eng">
    
    <head>
      <title>Verify your login</title>
    
    </head>
    
    <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
      <table role="presentation"
        style="width: 100%; border-collapse: collapse; border: 0px none; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
        <tbody>
          <tr>
            <td style="padding: 1rem 2rem; vertical-align: top; width: 100%;" align="center">
              <table role="presentation"
                style="max-width: 600px; border-collapse: collapse; border: 0px none; border-spacing: 0px; text-align: left;">
                <tbody>
                  <tr>
                    <td style="padding: 40px 0px 0px;">
                      <div style="text-align: left;">
                      </div>
                      <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                        <div style="color: rgb(0, 0, 0); text-align: left;">
                          <h1 style="margin: 1rem 0">Verification code</h1>
                          <p style="padding-bottom: 16px">Please use the verification code below to sign in.</p>
                          <p style="padding-bottom: 16px"><strong style="font-size: 130%"> ${generatedOtp} </strong></p>
                          <p style="padding-bottom: 16px">Please use it within 5 minutes!</p>
                          <p style="padding-bottom: 16px">If you didn’t request this, you can ignore this email.</p>
                          <p style="padding-bottom: 16px">Thanks,<br>The CareLink team</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    
    </html>`

}
export {mail_html}