const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, htmlContent) {
  const msg = {
    to,
    from: 'zainahanini66@gmail.com', 
    subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent to', to);
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error.message);
  }
}

module.exports = sendEmail;
