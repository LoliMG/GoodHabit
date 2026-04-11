import multer from "multer";
import path from "path";
import fs from "fs";

// Configuración de almacenamiento en disco
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './public/images/users';
        try {
            // Intentamos crear la carpeta si estamos en un entorno que lo permite (Local)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        } catch (err) {
            // Si falla (como en Vercel), pasamos el error o usamos /tmp
            cb(null, '/tmp'); 
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

export const uploadImage = (folder) => {
    return multer({ 
        storage: diskStorage,
        limits: { fileSize: 5 * 1024 * 1024 } 
    }).single("img");
}