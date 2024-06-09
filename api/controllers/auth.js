import { db } from "../db.js";
import bcrypt from "bcryptjs";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import { sendEmail } from "../components/emailReset.js";
import randtoken from "rand-token";

//register
export const register = (req, res)=>{
    //check existing user
    const q = "SELECT * FROM users WHERE email = ?";

    db.query(q, [req.body.email], (err, data)=>{
        if(err) return res.json(err);
        if(data.length) return res.status(409).json("email already exists, please change your email and try again");

        //hash the password and create a user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO users(`firstname`,`lastname`,`email`,`password`) VALUES (?)";
        const values = [
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            hash,
        ];

        db.query(q,[values], (err, data)=>{
            if(err) return res.json(err);
            return res.status(200).json("user has been created");
        });
    });
}

//login
export const login = (req,res)=>{
    //Check if user exists
    const q = "SELECT * FROM users WHERE email = ?";

    db.query(q,[req.body.email], (err, data)=>{
        if(err) return res.json(err);
        if(data.length === 0) return res.status(404).json("user not found");

        //check password
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);

        if(!isPasswordCorrect) return res.status(400).json("wrong email or password");

        const token = jwt.sign({id: data[0].id, role: data[0].role}, process.env.JSECRET); //generate unique token using user id with jwt
        const { password, etoken, ...other } = data[0];

        res.cookie("access_token", token, {  //send and store generated token in cookie
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json(other); 
    }); 
}

//logout
export const logout = (req,res)=>{
    res.clearCookie("access_token", {
        sameSite:"none",
        secure:true
    }).status(200).json("user has been logged out");
}

//forgot password
export const forgotPassword = (req, res)=>{
    const email = req.body.email;

    const q = "SELECT * FROM users where email = ?";

    db.query(q, [email], (err, data)=>{
        if(err) return res.status(500).json(err);

        if(data.length > 0){
            const mailSubject = "Forgot password";
            const token = randtoken.generate(20);
            const content =  `<p>Hi ${data[0].username},<br/>Please <a href=${process.env.PASSWORD_RESET}/resetpassword?token=${token}>Click Here</a> to reset your password</p>`;

            const q = "UPDATE users SET etoken = ? WHERE email = ?"
            db.query(q, [token, email], (err, data)=>{
                if(err) return res.status(500).json(err);
                sendEmail(email, mailSubject, content, res);
            });
          }else{
             return res.status(401).json("Email does not exist");
         }
    });
};


export const resetPassword =  (req, res)=>{
    const token = req.params.id;

    //check if token exists
    const q = "SELECT * FROM users WHERE etoken = ?";

    db.query(q,[token], (err, data)=>{
        if(err) return res.status(500).json(err);
        if(data.length === 0){
            return res.status(404).json("Link is invalid")
        }else{
            const password = req.body.password;
            //hash the password
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            const q = "UPDATE users SET password = ?, etoken = NULL WHERE etoken = ?"
            db.query(q, [hash, token], (err, data)=>{
                if(err) return res.status(500).json(err);
                return res.status(200).json("Password has been reset successfully");
            });
        };
    })
}