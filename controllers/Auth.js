const User = require(".../models/User");
const OTP = require("../models/OTP");
const OTPGenerator = require("otp-generator");


//sendOTP
exports.sendOTP = async(req,res)=>{

    try{

        //fetch email from request's body
         const {email} = req.body;

        //check if user already exists
        const checkUserPresent = await User.findOne({email});

        //if user already existed
        if(checkUserPresent)
        {
            return res.status(401).json({
                success:false,
                message:"User Already Registered",
            });
        }

        //generate OTP
        var otp = OTPGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated: ", otp);

        // check unique otp or not
        let result = otp.findOne({otp:otp});

        while(result){
            otp = OTPGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = otp.findOne({otp:otp});
        }

        const otpPayload = {email,otp};

        //create an entry for otp in db
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response successfull
        res.status(200).json({
            success:true,
            message:"OTP sent successfully!",
        })
    } 
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
    
}


//signUp


//login
