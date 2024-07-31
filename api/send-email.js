const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-email-password'   // Replace with your email password
  }
});

const sendEmail = (req, res) => {
  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'your-email@gmail.com', // Replace with your email
    subject: `New message from YourPortfolio`, // Email subject
    text: `From: ${name}\nEmail: ${email}\n\nSubject: ${subject}\n\nMessage:\n${message}`
  };

  const autoReplyOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Thank you for your message',
    text: 'Thank you for taking the time to review my portfolio and conducting business with me. Your request will be reviewed and responded to shortly.'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }

    // Send auto-reply to user
    transporter.sendMail(autoReplyOptions, (autoReplyError, autoReplyInfo) => {
      if (autoReplyError) {
        return res.status(500).json({ message: autoReplyError.message });
      }

      res.status(200).json({ message: 'Emails sent successfully' });
    });
  });
};

module.exports = sendEmail;
