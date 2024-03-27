export const getResetPasswordTemplate = (username, resetUrl) => 
`
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
    <style type="text/css">
      /* CSS styles */
    </style>
  </head>
  <body>
    <div>
      <h1>Password Reset Request</h1>
      <p>Hello ${username},</p>
      <p>
        You recently requested to reset your password for your EShopping
        account. Use the button below to reset it.
        <strong>This password reset is only valid for the next 30 minutes.</strong>
      </p>
      <a href="${resetUrl}">
        <button style="background-color: #22bc66; color: #fff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
          Reset Your Password
        </button>
      </a>
      <p>
        If you did not request a password reset, please ignore this email or
        <a href="{{support_url}}">contact support</a> if you have questions.
      </p>
      <p>Thanks,<br />The EShopping team</p>
      <p>
        If you’re having trouble with the button above, copy and paste the URL
        below into your web browser.
      </p>
      <a href="${resetUrl}">${resetUrl}</a>
    </div>
  </body>
</html>
`;
