const crypto = require('crypto');

class Confidential {
    static generateHash(sourceText) {
        try {
            const hash = crypto.createHash('md5');
            hash.update(sourceText);
            const result = hash.digest('base64');
            return result;
        } catch (err) {
            return '';
        }
    }

    static encrypt(encryptString) {
        const encryptionKey = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, Buffer.from([0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76]));
        let encrypted = cipher.update(encryptString, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    static decrypt(cipherText) {
        const encryptionKey = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, Buffer.from([0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76]));
        let decrypted = decipher.update(cipherText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

module.exports = Confidential;