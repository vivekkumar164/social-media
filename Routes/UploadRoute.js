import express from 'express';
const router = express.Router();
import multer from 'multer';
//import '../public/images'

const  storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("request came1")
        cb(null, "../public/images");
    },
    filename: (req, file, cb) => {
        console.log("request came2")
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });

router.post('/', upload.single("file"), (req, res) => {
    console.log("request came")
    try {
        return res.status(200).json("file uploaded successfully")
    } catch (error) {
        console.log(error);
    }
})

export default router;


