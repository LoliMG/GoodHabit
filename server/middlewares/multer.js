import multer from "multer";
import path from "path";
import fs from "fs";

let storage;

if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    storage = multer.memoryStorage();
} else {
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = path.join(process.cwd(), 'public', 'images', 'users');
            try {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                cb(null, dir);
            } catch (err) {
                cb(null, '/tmp');
            }
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + '-' + file.originalname);
        }
    });
}

export const uploadImage = (folder) => {
    return multer({ 
        storage,
        limits: { fileSize: 5 * 1024 * 1024 }
    }).single("img");
}