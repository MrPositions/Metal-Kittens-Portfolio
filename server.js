const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address to send from
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Transporter verification failed:', error);
  } else {
    console.log('Transporter is ready to send messages');
  }
});

// Handle form submission
app.post('/send-email', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Mail options for sending to yourself
  const mailOptions = {
    from: email, // Sender's email address
    to: process.env.EMAIL_USER, // Your email address
    replyTo: email, // Reply to the sender's email address
    subject: `New message from ${name}: ${subject}`,
    text: `Message from: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  };

  // Mail options for auto-reply to the sender
  const autoReplyOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for your message',
    text: 'Thank you for taking the time to review my portfolio and conducting business with me. Your request will be reviewed and responded to shortly.'
  };

  // Send email to yourself
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email to yourself:', error);
      return res.status(500).send(error.toString());
    }
    console.log('Primary email sent:', info.response);

    // Send auto-reply to the sender
    transporter.sendMail(autoReplyOptions, (autoReplyError, autoReplyInfo) => {
      if (autoReplyError) {
        console.error('Error sending auto-reply:', autoReplyError);
        return res.status(500).send(autoReplyError.toString());
      }
      console.log('Auto-reply sent:', autoReplyInfo.response);
      res.status(200).send('Emails sent: ' + info.response + ' | Auto-reply sent: ' + autoReplyInfo.response);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
