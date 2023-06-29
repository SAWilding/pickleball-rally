import nodemailer from "nodemailer";

export default async (req, res) => {
  if (req.method === "POST") {
    const smtpConfig = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Set to true if using a secure connection (e.g., SSL/TLS)
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
      },
    };

    const { emails, subject, message, html } = req.body;

    try {
      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport(smtpConfig);

      // Loop through each email address and send the email
      for (const email of emails) {
        await transporter.sendMail({
          from: smtpConfig.auth.user,
          to: email,
          subject,
          text: message,
          html: html,
        });
      }

      res.status(200).json({ message: "Emails sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res
        .status(500)
        .json({ error: "An error occurred while sending the email." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};
