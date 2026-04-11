import multer from "multer";
import path from "path";
import fs from "fs";

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Usamos process.cwd() para asegurar que estamos en la raíz del proyecto/servidor
        const dir = path.join(process.cwd(), 'public', 'images', 'users');
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

export const uploadImage = (folder) => {
    return multer({ storage: diskStorage }).single("img");
}