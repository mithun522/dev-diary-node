export const generateLoginEmailHtml = (username: string, email: string) => {
  const loginUrl = `${
    process.env.FRONTEND_URL
  }/auth/login?email=${encodeURIComponent(email)}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Welcome to Dev Diary</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f6f9fc;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            background-color: #ffffff;
            margin: 0 auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            margin-top: 20px;
            background-color: #EEEFE0;
            color: #EEEFE0;
            border-radius: 6px;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Hello ${username},</h2>
          <p>Welcome to <strong>Dev Diary</strong>! Your account has been successfully created.</p>
          <p>Click the button below to log in and start using your account:</p>
          <a href="${loginUrl}" class="button">Log In</a>
          <p class="footer">
            If you did not sign up for this account, you can safely ignore this email.<br />
            — Dev Diary Team
          </p>
        </div>
      </body>
    </html>
  `;
};
