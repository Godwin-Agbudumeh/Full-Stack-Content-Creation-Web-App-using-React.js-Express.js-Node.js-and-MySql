import { db } from "../db.js";
import 'dotenv/config';
import jwt from "jsonwebtoken";

export const getPosts = (req, res)=>{
    const resultsPerPage = 4;
    const cat =  req.query.cat;
    const searchposts = req.query.searchposts;

    let q = cat ? "SELECT * FROM posts WHERE cat=?" : searchposts ? "SELECT * FROM posts WHERE `desc` REGEXP ?" : "SELECT * FROM posts";
    let page = req.query.page ? Number(req.query.page) : 1;

    db.query(q, [cat || searchposts], (err, data)=>{
        if(err) return res.status(500).json(err);

        const numberOfResults = data.length;     
        const numberOfPages = Math.ceil(numberOfResults / resultsPerPage); 

        //check if numberOfPages > 0(if posts exist) to prevent infinite loop and endingLink of 0
        if(numberOfPages > 0){
            if(page > numberOfPages){
                return res.redirect('/posts/?page='+encodeURIComponent(numberOfPages));
            }else if(page < 1){
                return res.redirect('/posts/?page='+encodeURIComponent('1'));
            }
            
            //Determine the SQL LIMIT starting number
            const startingLimit = (page - 1) * resultsPerPage;
            
            //Get the relevant number of posts for this starting page
            q = cat ? `SELECT users.firstname, users.lastname, posts.id, posts.title, posts.desc, posts.img, posts.cat, posts.date, posts.uid FROM users JOIN posts ON users.id = posts.uid WHERE cat=? ORDER BY posts.date DESC LIMIT ${startingLimit},${resultsPerPage}` : (searchposts ? "SELECT users.firstname, users.lastname, posts.id, posts.title, posts.desc, posts.img, posts.cat, posts.date, posts.uid FROM users JOIN posts ON users.id = posts.uid WHERE `desc` REGEXP ? ORDER BY posts.date " + `DESC LIMIT ${startingLimit},${resultsPerPage}` : `SELECT users.firstname, users.lastname, posts.id, posts.title, posts.desc, posts.img, posts.cat, posts.date, posts.uid FROM users JOIN posts ON users.id = posts.uid ORDER BY posts.date DESC LIMIT ${startingLimit},${resultsPerPage}`);
            
            db.query(q, [cat || searchposts], (err, data)=>{
                if(err) return res.status(500).json(err);

                //Code designed by me
                let iterator = (page - 5) < 1 ? 1 : page - 5;
                let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : numberOfPages;

                if((iterator + 9) > (numberOfPages)){
                    iterator = (numberOfPages - 9) >= 1 ? (numberOfPages - 9) : 1;
                }

                return res.status(200).json({data: data, page, iterator, endingLink, numberOfPages});
            });
        }else{
            //result is an empty array if no posts, numberOfPages = 0
            return res.status(200).json({data: data}); 
        }
    });
}

export const getPost = (req, res)=>{
    const q = "SELECT p.id, `firstname`, `lastname`,`title`, `desc`, p.img, u.img AS userImg, `cat`, `date`, p.uid FROM users u JOIN posts p ON u.id=p.uid WHERE p.id = ?";

    db.query(q, [req.params.id], (err, data)=>{
        if(err) return res.status(500).json(err);

        return res.status(200).json(data[0]);
    });
}

export const addPost = (req, res)=>{
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json("not authenticated!");

    jwt.verify(token, process.env.JSECRET, (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");

        const q = "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `uid`) VALUES (?)"

        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
            req.body.date,
            userInfo.id
        ]

        db.query(q, [values], (err, data)=>{
            if(err) return res.status(500).json(err);
            return res.json("Post has been created");
        })
    });
}

export const deletePost = (req, res)=>{
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json("not authenticated!");

    jwt.verify(token, process.env.JSECRET, (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");

        const postId = req.params.id;
        const q = "DELETE FROM posts WHERE `id` = ? and `uid` = ?";

        db.query(q, [postId, userInfo.id], (err, data)=>{
            const {affectedRows} = data
            if(!affectedRows) return res.status(403).json("You can delete only your post!");

            return res.status(200).json("Post has been deleted");
        });
    })
}

export const updatePost = (req, res)=>{
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json("not authenticated!");

    jwt.verify(token, process.env.JSECRET, (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");

        const postId = req.params.id;
        const q = "UPDATE posts SET `title`=?, `desc`=?, `img`=?, `cat`=? WHERE `id` = ? AND `uid` = ?";

        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
        ]

        db.query(q, [...values, postId, userInfo.id], (err, data)=>{
            if(err) return res.status(500).json(err);
            return res.json("Post has been updated");
        })
    });
}