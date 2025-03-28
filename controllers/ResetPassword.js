const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = requrie("bcrypt");

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req body
    const { email } = req.body;

    //check user for this email, email validation
    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res.status().json({
        success: false,
        message: "Your email is not registered with us!",
      });
    }
    //token generation
    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    //create url
    const url = `https://localhost:3000/update-password/${token}`;

    //send email containing the url
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link: ${url}`
    );
    // return response
    return res.json({
      success: true,
      message:
        "Email sent successfully! Please check your email and change the password accordingly.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting the password.",
    });
  }
};

//resetPassword
exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body;
    //validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password is not matching ",
      });
    }

    //get user details from db using token
    const userDetails = await User.findOne({ token: token });
    //if no entry=> invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is invalid..",
      });
    }
    //token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired. Regenerate your token.",
      });
    }
    //hashing of password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    //updating the password
    await User.findOneAndUpdate(
      {
        token: token,
      },
      {
        password: hashedPassword,
      },
      {
        new: true,
      }
    );
    //return response
    return res.json({
      success: true,
      message: "Password reset successfull,",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting the password.",
    });
  }
};
