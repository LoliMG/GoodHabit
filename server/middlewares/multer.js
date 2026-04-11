import multer from "multer";

// Usamos memoryStorage para evitar errores en entornos como Vercel
// donde el sistema de archivos es de solo lectura.
const storage = multer.memoryStorage();

export const uploadImage = (folder) => {
    // Nota: 'folder' se ignora en memoryStorage, pero mantenemos la firma de la función
    return multer({ 
        storage,
        limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
    }).single("img");
}