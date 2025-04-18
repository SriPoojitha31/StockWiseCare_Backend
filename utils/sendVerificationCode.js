import { generateVerificationOtpEmailTemplate, generateForgotPasswordEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

// Function to send verification code
export async function sendVerificationCode(verificationCode, email, res) {
    try {
        const message = generateVerificationOtpEmailTemplate(verificationCode);  // Generate OTP verification email template
        await sendEmail(email, "🔐 Verify Your Email Address for Account Setup", message);  // Send email with appropriate subject

        res.status(200).json({
            success: true,
            message: "Verification Code sent successfully.",
        });
    } catch (error) {
        console.error("❌ Email sending failed:", error);
        return res.status(500).json({
            success: false,
            message: "Verification Code failed to send.",
        });
    }
}

// Function to send forgot password email
export async function sendForgotPasswordEmail(resetLink, email, res) {
    try {
        const message = generateForgotPasswordEmailTemplate(resetLink);  // Generate forgot password email template
        await sendEmail(email, "🔒 Reset Your Password Request", message);  // Send email with appropriate subject

        res.status(200).json({
            success: true,
            message: "Password reset link sent successfully.",
        });
    } catch (error) {
        console.error("❌ Email sending failed:", error);
        return res.status(500).json({
            success: false,
            message: "Password reset link failed to send.",
        });
    }
}
