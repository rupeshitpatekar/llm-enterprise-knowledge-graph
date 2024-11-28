import CryptoJS from "crypto-js";

export const AESEncrypt = (pureText: string): string => {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(pureText),
    import.meta.env.VITE_PRIVATE_KEY as string
  ).toString();

  const urlSafeCiphertext = ciphertext
    .replace(/\+/g, "%2B")
    .replace(/\//g, "%2F")
    .replace(/=+$/, "%3D");

  return urlSafeCiphertext;
};
