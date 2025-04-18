import  catchAsyncErrors  from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import User  from "../models/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/sendEmail.js"; // Added missing import

export const register = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(new ErrorHandler("Please enter all fields", 400));
        }

        const isRegistered = await User.findOne({ email, accountVerified: true });
        if (isRegistered) {
            return next(new ErrorHandler("User already exists", 400));
        }

        const registrationAttemptsByUser = await User.find({
            email,
            accountVerified: false,
        });

        if (registrationAttemptsByUser.length >= 15) {
            return next(new ErrorHandler(
                "You have exceeded the number of registration attempts. Please contact support.", 400
            ));
        }

        if (password.length < 8 || password.length > 16) {
            return next(new ErrorHandler("Password must be between 8 and 16 characters.", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const verificationCode = user.generateVerificationCode(); // Call on instance, not model
        await user.save();

        await sendVerificationCode(verificationCode, email, res); // Added await

    } catch (error) {
        next(error);
    }
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new ErrorHandler("Email or OTP is missing.", 400));
    }

    try {
        const userAllEntries = await User.find({
            email,
            accountVerified: false,
        }).sort({ createdAt: -1 });

        if (userAllEntries.length === 0) {
            return next(new ErrorHandler("User not found", 404));
        }

        let user = userAllEntries[0];

        console.log(`🔍 Debugging: Received OTP - ${otp}`); // Fixed template string
        console.log(`📌 Debugging: Stored OTP in DB - ${user.verificationCode}`); // Fixed template string

        // Convert both to String before comparison
        if (String(user.verificationCode) !== String(otp)) {
            return next(new ErrorHandler("Invalid OTP.", 400));
        }

        const currentTime = Date.now();
        const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();

        if (currentTime > verificationCodeExpire) {
            return next(new ErrorHandler("OTP has expired. Please request a new one.", 400));
        }

        user.accountVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpire = null;
        await user.save({ validateModifiedOnly: true });

        await sendToken(user, 200, "Account verified.", res);
    } catch (error) {
        return next(new ErrorHandler("Internal Server Error.", 500));
    }
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please enter all fields.", 400));
    }
    const user = await User.findOne({ email, accountVerified: true }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    sendToken(user, 200, "User Login successfully.", res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true
    }).json({
        success: true,
        message: "Logged out successfully.",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    if (!req.body.email) {
        return next(new ErrorHandler("Email is required", 400));
    }
    const user = await User.findOne({
        email: req.body.email,
        accountVerified: true,
    });
    if (!user) {
        return next(new ErrorHandler("User not found.", 400));
    }
    const resetToken = user.getResetPasswordToken(); // Fixed variable name

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`; // Fixed template string

    const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);
    try {
        await sendEmail(
            user.email,
            "Password Recovery",
            message
        );
        
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`, // Fixed template string
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetToken = req.params.token;

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Reset Password Token is invalid or has expired.",
        });
    }

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match.",
        });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password reset successful",
    });
});