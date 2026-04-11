import multer from "multer";
import path from "path";
import fs from "fs";

let storage;

// Detectamos si estamos en Vercel o en Local
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    // En producción (Vercel), usamos memoria para no chocar con el sistema de archivos de solo lectura
    storage = multer.memoryStorage();
} else {
    // En Local, seguimos usando el disco para que las fotos se guarden y se vean
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