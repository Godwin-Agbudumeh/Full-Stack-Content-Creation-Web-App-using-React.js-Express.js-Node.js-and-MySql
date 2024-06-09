import { db } from "../db.js";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getUser = (req, res)=>{
    const token = req.cookies.access_token;
    
    if(!token) return res.status(401).json("not authenticated!");

    jwt.verify(token, process.env.JSECRET, (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");

        const q = "SELECT `id`, `firstname`, `lastname`, `email`, `img`, `about` FROM users WHERE `id` = ?"

        db.query(q, [userInfo.id], (err, data)=>{
            if(err) return res.status(500).json(err);

            return res.status(200).json(data[0]);
        })
     }
    )
}

export const updateUser = (req, res)=>{
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json("not authenticated!");

    jwt.verify(token, process.env.JSECRET, (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");

        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const img = req.body.img;
        const password = req.body.password;
        const about = req.body.about;
        let hash = null;

        //hash the password
       if(password){
        const salt = bcrypt.genSaltSync(10);
        hash = bcrypt.hashSync(password, salt);
       }

       let q = firstname && lastname && email ? `UPDATE users SET firstname=?, lastname=?, email=? WHERE id = ${userInfo.id}` : (about ? `UPDATE users SET about=? WHERE id = ${userInfo.id}` : (hash ? `UPDATE users SET password=? WHERE id = ${userInfo.id}` : img && `UPDATE users SET img=? WHERE id = ${userInfo.id}`));

        db.query(q, [img || hash || about || firstname, lastname, email], (err, data)=>{
            if(err) return res.status(500).json(err);
        })

        q = "SELECT * FROM users WHERE id = ?";

        db.query(q, [userInfo.id], (err, data)=>{
            if(err) return res.status(500).json(err);
            const { password, ...other } = data[0];
            return res.status(200).json({"message":"User has been updated", "data":other});
        })
    })
}

export const getSingleUser = (req, res)=>{
    const q = "SELECT firstname, lastname, email, img, about FROM users WHERE id = ?";

    db.query(q, [req.params.id], (err, data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json(data[0]);
    });
}
