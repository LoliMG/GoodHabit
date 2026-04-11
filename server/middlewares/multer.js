import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImage = (folder = 'users') => {
    let storage;

    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
        storage = multer.memoryStorage();
    } else {
        storage = multer.diskStorage({
            destination: (req, file, cb) => {
                // Use __dirname to guarantee we point to server/public/...
                const dir = path.join(__dirname, '..', 'public', 'images', folder);
                try {
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                    cb(null, dir);
                } catch (err) {
                    console.error("Multer destination error:", err);
                    cb(null, '/tmp');
                }
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                // remove spaces and special characters from originalname to prevent bugs
                const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
                cb(null, uniqueSuffix + '-' + safeName);
            }
        });
    }

    return multer({ 
        storage,
        limits: { fileSize: 5 * 1024 * 1024 }
    }).single("img");
}
