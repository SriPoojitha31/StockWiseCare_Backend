import nodeMailer from "nodemailer";

export const sendEmail = async (email, subject, message) => {
    try {
        console.log("🚀 Sending email to:", email);

        const transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            service: process.env.SMTP_SERVICE,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email, // ✅ This is the fix!
            subject,
            html: message,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.response);

    } catch (error) {
        console.error("❌ Email sending failed:", error);
    }
};
