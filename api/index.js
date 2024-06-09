import express from "express";
import cors from "cors";
import 'dotenv/config';
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import adminRoutes from "./routes/admin.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import cloudinary from "./cloudinary.js"
import { db } from "./db.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();

app.use(cors({origin:true, credentials:true}))

const storage = multer.diskStorage({   
    filename: (req, file, cb)=>{
        cb(null, req.body.name);
    },
});

const upload = multer({storage: storage});

app.post("/api/upload", upload.single("file"), (req,res)=>{   
    cloudinary.uploader.upload(req.file.path, (err, result)=>{
        if(err){
            console.log(err);
            return res.status(500).json("error uploading images");
        }
        const {format, public_id, version} = result;

        return res.status(200).json({
            message:"File has been uploaded successfully",
            data: {format, public_id, version}
        });
    })
});

app.use(express.json()); 
app.use("/images", express.static(path.join(__dirname, "/images"))); 
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res)=>{
 return res.send("server is running, thanks");
})

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Backend is running on port ${port}`);
});