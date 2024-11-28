import CryptoJS from "crypto-js";

export const AESDecrypt = (encryptedText: string): string => {
  const base64CipherText = encryptedText
    .replace(/%2B/g, "+")
    .replace(/%2F/g, "/")
    .replace(/%3D/g, "=");

  const bytes = CryptoJS.AES.decrypt(
    base64CipherText,
    import.meta.env.VITE_PRIVATE_KEY as string
  );

  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
