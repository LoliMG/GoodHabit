import multer from "multer";

export const uploadImage = (folder) => {
    const storage = multer.diskStorage({
        destination: `./public/images/${folder}`,
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + "-" + file.originalname);
        }
    });

    return multer({ storage }).single("img");
}