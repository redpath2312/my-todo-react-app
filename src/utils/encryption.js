import CryptoJS from "crypto-js";

const SECRET = import.meta.env.VITE_ENCRYPTION_SECRET || "";

/**
 * Encrypt card text using AES.
 * If SECRET is missing or text is falsy, just return the original text.
 */
export function encryptCardText(plainText) {
	if (!plainText || !SECRET) return plainText;  // EARLY EXIT – don’t try to encrypt

	try {
		 const ciphertext = CryptoJS.AES.encrypt(plainText, SECRET).toString();
         return ciphertext; // normal return when we *do* encrypt
	} catch (err) {
		console.error("[encryptCardText] Failed to encrypt text:", err);
		return plainText; // fallback if CryptoJS blows up
	}
}

/**
 * Decrypt card text using AES.
 * If decryption fails or result is empty, assume it was legacy plaintext and
 * just return the stored value unchanged.
 */
export function decryptCardText(storedValue) {
	if (!storedValue || !SECRET) return storedValue;

	try {
		const bytes = CryptoJS.AES.decrypt(storedValue, SECRET);
		const decrypted = bytes.toString(CryptoJS.enc.Utf8);

		// If CryptoJS can't decrypt (e.g. legacy plaintext), decrypted will be ""
		if (!decrypted) return storedValue;

		return decrypted;
	} catch {
		// Most likely legacy plaintext or garbage; return as-is
		return storedValue;
	}
}
