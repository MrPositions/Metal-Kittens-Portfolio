const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body;

    // Create a transporter object using your email service
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your email password
      }
    });

    // Set up email data for sending to yourself
    const mailOptionsToSelf = {
      from: email,
      to: process.env.EMAIL_USER, // Your email address
      subject: `New message from ${name}: ${subject}`,
      text: `Message from: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    // Set up email data for auto-reply to the sender
    const autoReplyOptions = {
      from: process.env.EMAIL_USER, // Your email address
      to: email,
      subject: 'Thank you for your message',
      text: 'Thank you for taking the time to reach out. Your message has been received, and we will get back to you shortly.'
    };

    try {
      // Send email to yourself
      await transporter.sendMail(mailOptionsToSelf);

      // Send auto-reply to the sender
      await transporter.sendMail(autoReplyOptions);

      res.status(200).json({ message: 'Emails sent successfully!' });
    } catch (error) {
      console.error('Error sending emails:', error);
      res.status(500).json({ error: 'Failed to send emails' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
