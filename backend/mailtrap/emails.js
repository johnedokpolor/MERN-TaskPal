import { mailtrapClient, sender } from "./mailtrapConfig.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, name, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ).replace("{user}", name),
      category: "Email Verification",
    });
    console.log("Verification email sent successfully", response);
  } catch (error) {
    console.log("Error sending verification email", error);
    throw new Error(`Error sending verification email:${email}`);
  }
};
export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "dacc9fcd-fac2-4eed-8a67-6ef5c7028384",
      template_variables: {
        company_info_name: "Our App",
        name: name,
      },
    });
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.log("Error sending welcome email", error);
    throw new Error(`Error sending welcome email:${email}`);
  }
};

export const sendPasswordResetEmail = async (email, name, resetURL) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
        "{resetURL}",
        resetURL
      ).replace("{user}", name),
      category: "Password Reset",
    });
    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.log("Error sending password reset email", error);
    throw new Error(`Error sending password reset email:${email}`);
  }
};
export const sendResetSuccessEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password reset successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{user}", name),
      category: "Password Reset Success",
    });
    console.log("Password resent email sent successfully", response);
  } catch (error) {
    console.log("Error sending password reset email", error);
    throw new Error(`Error sending password reset email:${email}`);
  }
};
