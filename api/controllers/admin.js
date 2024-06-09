import { db } from "../db.js";
import 'dotenv/config';
import jwt from "jsonwebtoken";

//delete single user
export const user = (req, res)=>{
    const token = req.cookies.access_token;

    if(!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, process.env.JSECRET, (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");

        if(userInfo.role === "ADMIN"){
            const userId = req.params.id;
            let q = "SELECT * FROM users WHERE `id` = ?";

            db.query(q, [userId], (err, data)=>{
                if(err) return res.status(500).json(err);

                if(data.length === 0) return res.status(404).json("user not found");

                q = "DELETE FROM users WHERE `id` = ?";

                db.query(q, [userId], (err, data)=>{
                    if(err) return res.status(500).json(err);

                    return res.status(200).json("user has been deleted");
                });
            });
        }else{
            return res.status(403).json("Forbidden");
        }
    });
}

//delete single post
export const post = (req, res)=>{
    const token = req.cookies.access_token;

    if(!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, process.env.JSECRET, (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");

        if(userInfo.role === "ADMIN"){
            const postId = req.params.id;
            let q = "SELECT * FROM posts WHERE `id` = ?";

            db.query(q, [postId], (err, data)=>{
                if(err) return res.status(500).json(err);

                if(data.length === 0) return res.status(404).json("Post not found");

                q = "DELETE FROM posts WHERE `id` = ?";

                db.query(q, [postId], (err, data)=>{
                    if(err) return res.status(500).json(err);

                    return res.status(200).json("Post has been deleted");
                });
            });
        }else{
            return res.status(403).json("Forbidden");
        }
    });
}

