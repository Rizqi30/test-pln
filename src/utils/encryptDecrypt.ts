import crypto from "crypto";

// Konstanta Kunci dan IV
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "";
const IV = process.env.NEXT_PUBLIC_SECRET_IV || "";

/**
 * Enkripsi data menggunakan AES-256-CBC
 */
export function encryptData(data: any): string {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY),
    Buffer.from(IV)
  );
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

/**
 * Dekripsi data menggunakan AES-256-CBC
 */
export function decryptData(encryptedData: string): any {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY),
    Buffer.from(IV)
  );
  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}
