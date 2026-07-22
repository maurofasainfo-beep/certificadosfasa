import { randomBytes, scrypt as scryptCallback } from "node:crypto";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";
const KEY_LENGTH = 32;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

function deriveKey(password, salt, keyLength, options) {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keyLength, options, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}

function sqlQuote(value) {
  return value.replaceAll("'", "''");
}

const password = process.env.CERTIFICATE_ADMIN_PASSWORD || process.argv[2] || "";

if (password.length < 8 || password.length > 128) {
  console.error("Informe CERTIFICATE_ADMIN_PASSWORD com 8 a 128 caracteres.");
  process.exit(1);
}

const salt = randomBytes(16).toString("base64url");
const derivedKey = await deriveKey(password, salt, KEY_LENGTH, {
  N: SCRYPT_N,
  r: SCRYPT_R,
  p: SCRYPT_P,
});
const hash = `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt}$${derivedKey.toString("base64url")}`;

console.log(hash);
console.log("");
console.log("SQL para executar no Supabase:");
console.log(`update public.configuracoes_sistema`);
console.log(`set senha_admin_certificado_hash = '${sqlQuote(hash)}', updated_at = now()`);
console.log(`where id = '${SETTINGS_ID}'::uuid;`);
