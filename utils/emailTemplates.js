export function generateVerificationOtpEmailTemplate(otpCode) {
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; 
            border-radius: 10px; background: linear-gradient(135deg, #ffffff, #f9f9f9); color: #333; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    
    <h2 style="color: #4A00E0; text-align: center; font-size: 26px; margin-bottom: 20px;">🔐 Verify Your Email Address</h2>
    
    <p style="font-size: 16px; color: #555;">Hi there,</p>
    
    <p style="font-size: 16px; color: #555;">
        To complete your sign-in or registration, please use the verification code below:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #fff;
                     padding: 12px 24px; border-radius: 6px; background: #4A00E0;">
            ${otpCode}
        </span>
    </div>
    
    <p style="font-size: 15px; color: #666;">
        This code will expire in <strong>15 minutes</strong>. Please keep it confidential and do not share it.
    </p>
    
    <p style="font-size: 15px; color: #666;">
        If you didn’t request this, you can safely ignore this email.
    </p>

    <footer style="margin-top: 30px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br><strong>Team Aurora</strong></p>
        <p style="font-size: 12px; color: #bbb;">
            This is an automated message — please do not reply to this email.
        </p>
    </footer>
</div>
    `;
}


export function generateForgotPasswordEmailTemplate(resetLink) {
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; 
            border-radius: 10px; background: linear-gradient(135deg, #ffffff, #f7f2fc); color: #333; 
            border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    
    <h2 style="color: #6A0DAD; text-align: center; font-size: 26px; margin-bottom: 20px;">
        🔒 Reset Your Password
    </h2>
    
    <p style="font-size: 16px; color: #555;">Hi there,</p>
    
    <p style="font-size: 16px; color: #555;">
        We received a request to reset your password. Click the button below to securely proceed:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" 
           style="display: inline-block; font-size: 18px; font-weight: 600; color: #fff; 
                  padding: 12px 28px; border-radius: 6px; background: #6A0DAD; 
                  text-decoration: none; box-shadow: 0 2px 8px rgba(106,13,173,0.2);">
            Reset Password
        </a>
    </div>
    
    <p style="font-size: 15px; color: #666;">
        If you didn’t request a password reset, you can safely ignore this email.
    </p>
    
    <p style="font-size: 15px; color: #666;">
        This link will expire in <strong>15 minutes</strong>.
    </p>

    <footer style="margin-top: 30px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br><strong>Team Aurora</strong></p>
        <p style="font-size: 12px; color: #bbb;">
            This is an automated message — please do not reply to this email.
        </p>
    </footer>
</div>
    `;
}
