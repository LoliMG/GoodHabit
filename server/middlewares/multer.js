import multer from "multer";

export const uploadImage = (folder = 'users') => {
    // We use MemoryStorage because we'll upload the buffer to Supabase Storage.
    // This works on both Local and Vercel (serverless).
    const storage = multer.memoryStorage();

    return multer({ 
        storage,
        limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
    }).single("img");
}
