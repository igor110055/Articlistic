export function ErrorMessage(error) {
  switch (error) {
    case "User with this phone number already present!":
      return "Account with this phone number already exists.";
    case "Error: phone number must be exactly 10 digits":
      return "Please enter a valid phone number.";

    case "OTP Mismatch":
      return "Please enter a valid verification code.";

    case "Already present.":
      return "Account with this email already exists.";
    
    case "Could Not Authenticate":
      return "Please enter a valid verification code.";

    case "VerificationException: Verification code is incorrect, cannot verify the destination phone number.":
      return "Please enter a valid verification code.";
      
    default:
      return error;
  }
}
