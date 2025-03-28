import nodemailer from "nodemailer";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  LOGIN_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

var transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: "465",
  auth: {
    user: "johnedokpolor@gmail.com",
    pass: "sanewcdrhspbldqq",
  },
});
export const sendVerificationEmail = (
  email,
  name,
  verificationToken,
  tokenExpiry
) => {
  var mailOptions = {
    from: "johnedokpolor@gmail.com",
    to: email,
    subject: "Verification Token",
    html: VERIFICATION_EMAIL_TEMPLATE.replace("{user}", name)
      .replace("{verificationCode}", verificationToken)
      .replace("{tokenExpiry}", tokenExpiry),
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
export const sendWelcomeEmail = (email, name) => {
  var mailOptions = {
    from: "johnedokpolor@gmail.com",
    to: email,
    subject: "Welcome to TaskPal",
    html: WELCOME_EMAIL_TEMPLATE.replace("{user}", name),
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
export const sendPasswordResetEmail = (email, name, resetURL, tokenExpiry) => {
  var mailOptions = {
    from: "johnedokpolor@gmail.com",
    to: email,
    subject: "Password Reset",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{user}", name)
      .replace("{resetURL}", resetURL)
      .replace("{tokenExpiry}", tokenExpiry),
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
export const sendResetSuccessEmail = (email, name) => {
  var mailOptions = {
    from: "johnedokpolor@gmail.com",
    to: email,
    subject: "Password Reset Successful",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{user}", name),
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
export const sendLoginEmail = (email, name, loginDate) => {
  var mailOptions = {
    from: "johnedokpolor@gmail.com",
    to: email,
    subject: "Login Email",
    html: LOGIN_EMAIL_TEMPLATE.replace("{loginDate}", loginDate).replace(
      "{user}",
      name
    ),
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
