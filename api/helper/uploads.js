const fs = require('fs');
const path = require('path');

exports.uploadProfileImage = async (avatar, userId) => {
    try {
        const uploadDir = path.join(__dirname, '../public/uploads/profile_images');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename using userId and timestamp
        const fileExtension = avatar.mimetype.split('/')[1];
        const fileName = `${userId}_${Date.now()}.${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);

        // Write file to disk
        await fs.promises.writeFile(filePath, avatar.buffer);

        return {
            public_id: fileName,
            url: `/uploads/profile_images/${fileName}`
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

exports.deleteProfileImage = async (fileName) => {
    try {
        if (!fileName) return;
        const filePath = path.join(__dirname, '../public/uploads/profile_images', fileName);
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }
    } catch (error) {
        console.error('Error deleting image:', error);
    }
};


