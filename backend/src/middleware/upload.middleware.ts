import multer from 'multer';

// Use memory storage so we can upload the buffer directly to ImageKit
const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit per file
        files: 10,
    }
});
