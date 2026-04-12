import multer from "multer";

export const uploadImage = (folder = 'users') => {

    const storage = multer.memoryStorage();

    return multer({
        storage
    }).single("img");
}
