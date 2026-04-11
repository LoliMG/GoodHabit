import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de almacenamiento en disco con ruta ABSOLUTA
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Construimos la ruta absoluta hacia server/public/images/users
        // Subimos dos niveles desde middlewares/ para llegar a la raíz del server
        const dir = path.join(__dirname, '..', 'public', 'images', 'users');
        
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        } catch (err) {
            console.error("Error creating directory:", err);
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