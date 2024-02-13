const {
  asciiMapping,
  mp,
  mp1,
  initial_perm,
  exp_d,
  per,
  final_perm,
  sbox,
  pc1,
  pc2,
  key_shifts,
} = require("./Constant.js");

let key1;
let key2;
let key3;
let changedKey;
let changedPlainText;
let cipher_text;
let decrypted_text;
let isPadding = false;
let padLen;
function textToASCII(plainText) {
  let asciiString = "";
  for (let i = 0; i < plainText.length; i++) {
    const decimalNum = dec2bin(plainText.charCodeAt(i))
    asciiString += decimalNum
  }
  return asciiString;
}

function asciiToHex(ascii) {
  let hex = "";
  for (let i = 0; i < ascii.length; i++) {
    const asciiValue = ascii.charCodeAt(i);
    hex += asciiMapping[asciiValue] || String.fromCharCode(asciiValue);
  }
  return hex;
}
function asciiToText(asciiString) {
  let plainText = "";
  for (let i = 0; i < asciiString.length; i += 2) {
    const chunk = asciiString.substr(i, 2);
    plainText += String.fromCharCode(parseInt(chunk, 10));
  }
  return plainText;
}

function hexToASCII(hexString) {
  let asciiString = "";
  for (let i = 0; i < hexString.length; i += 2) {
    const hexChunk = hexString.substr(i, 2);
    const decimalValue = parseInt(hexChunk, 16);
    asciiString += decimalValue.toString();
  }
  return asciiString;
}
function hex2bin(s) {
  let binary = "";
  for (let i = 0; i < s.length; i++) {
    binary += mp[s[i]];
  }
  return binary;
}

function bin2hex(s) {
  let hexadecimal = "";
  for (let i = 0; i < s.length; i += 4) {
    let chunk = "";
    chunk += s[i];
    chunk += s[i + 1];
    chunk += s[i + 2];
    chunk += s[i + 3];
    hexadecimal += mp1[chunk];
  }
  return hexadecimal;
}

function bin2dec(binary) {
  let decimal = 0,
    i = 0;
  while (binary !== 0) {
    const dec = binary % 10;
    decimal += dec * Math.pow(2, i);
    binary = Math.floor(binary / 10);
    i += 1;
  }
  return decimal;
}

function dec2bin(num) {
  let res = num.toString(2);
  if (res.length % 4 !== 0) {
    const div = Math.floor(res.length / 4);
    const counter = 4 * (div + 1) - res.length;
    for (let i = 0; i < counter; i++) {
      res = "0" + res;
    }
  }
  return res;
}

function permute(k, arr, n) {
  let permutation = "";
  for (let i = 0; i < n; i++) {
    permutation += k[arr[i] - 1];
  }
  return permutation;
}

function shift_left(k, nth_shifts) {
  let s = "";
  for (let i = 0; i < nth_shifts; i++) {
    for (let j = 1; j < k.length; j++) {
      s += k[j];
    }
    s += k[0];
    k = s;
    s = "";
  }
  return k;
}

function xor(a, b) {
  let ans = "";
  for (let i = 0; i < a.length; i++) {
    ans += a[i] === b[i] ? "0" : "1";
  }
  return ans;
}
function splitIntoBlocks(plainText) {
  const blocks = [];
  for (let i = 0; i < plainText.length; i += 64) {
    blocks.push(plainText.slice(i, i + 64));
  }
  return blocks;
}
function addPadding(binaryText) {
  const padLength = 64 - (binaryText.length % 64);
  padLen = padLength;
  const padding = "0".repeat(padLength);
  return binaryText + padding;
}
function removePadding(paddedBinaryText) {
  return paddedBinaryText.replace(/0+$/, "");
}
function generate_round_keys(key) {
  key = hex2bin(key);
  const key56 = permute(key, pc1, 56);
  let left28 = key56.slice(0, 28);
  let right28 = key56.slice(28, 56);
  const roundKeyBits = [];
  const hexRoundKey = [];
  for (let i = 0; i < 16; i++) {
    left28 = shift_left(left28, key_shifts[i]);
    right28 = shift_left(right28, key_shifts[i]);
    const combinedKey = left28 + right28;
    const roundKey = permute(combinedKey, pc2, 48);
    roundKeyBits.push(roundKey);
    hexRoundKey.push(bin2hex(roundKey));
  }
  return [roundKeyBits, hexRoundKey];
}

function encrypt(plainText, roundKeyBits, hexRoundKey) {
  plainText = hex2bin(plainText);
  plainText = permute(plainText, initial_perm, 64);
  let left = plainText.slice(0, 32);
  let right = plainText.slice(32, 64);

  for (let i = 0; i < 16; i++) {
    const right_expanded = permute(right, exp_d, 48);
    const xor_x = xor(right_expanded, roundKeyBits[i]);
    let sbox_str = "";
    for (let j = 0; j < 8; j++) {
      const row = bin2dec(parseInt(xor_x[j * 6] + xor_x[j * 6 + 5], 2));
      const col = bin2dec(
        parseInt(
          xor_x[j * 6 + 1] +
            xor_x[j * 6 + 2] +
            xor_x[j * 6 + 3] +
            xor_x[j * 6 + 4],
          2
        )
      );
      const val = sbox[j][row][col];
      sbox_str += dec2bin(val);
    }
    sbox_str = permute(sbox_str, per, 32);
    const result = xor(left, sbox_str);
    left = result;
    if (i !== 15) {
      [left, right] = [right, left];
    }
  }
  const combine = left + right;
  let cipher_text = permute(combine, final_perm, 64);
  cipher_text = bin2hex(cipher_text);
  return cipher_text;
}

function decrypt(cipherText, roundKeyBits, hexRoundKey) {
  cipherText = hex2bin(cipherText);
  cipherText = permute(cipherText, initial_perm, 64);
  let left = cipherText.slice(0, 32);
  let right = cipherText.slice(32, 64);
  for (let i = 15; i >= 0; i--) {
    const right_expanded = permute(right, exp_d, 48);
    const xor_x = xor(right_expanded, roundKeyBits[i]);
    let sbox_str = "";
    for (let j = 0; j < 8; j++) {
      const row = bin2dec(parseInt(xor_x[j * 6] + xor_x[j * 6 + 5], 2));
      const col = bin2dec(
        parseInt(
          xor_x[j * 6 + 1] +
            xor_x[j * 6 + 2] +
            xor_x[j * 6 + 3] +
            xor_x[j * 6 + 4],
          2
        )
      );
      const val = sbox[j][row][col];
      sbox_str += dec2bin(val);
    }
    sbox_str = permute(sbox_str, per, 32);
    const result = xor(left, sbox_str);
    left = result;
    if (i !== 0) {
      [left, right] = [right, left];
    }
  }
  const combine = left + right;
  let plain_text = permute(combine, final_perm, 64);
  plain_text = bin2hex(plain_text);
  return plain_text;
}
function des_3_encrypt(plainText, key1, key2, key3) {
  const [roundKeyBits1, hexRoundKey1] = generate_round_keys(key1);
  const [roundKeyBits2, hexRoundKey2] = generate_round_keys(key2);
  const [roundKeyBits3, hexRoundKey3] = generate_round_keys(key3);

  let cipher_text = encrypt(plainText, roundKeyBits1, hexRoundKey1);
  cipher_text = decrypt(cipher_text, roundKeyBits2, hexRoundKey2);
  cipher_text = encrypt(cipher_text, roundKeyBits3, hexRoundKey3);
  return cipher_text;
}
function des_3_decrypt(cipherText, key1, key2, key3) {
  const [roundKeyBits1, hexRoundKey1] = generate_round_keys(key1);
  const [roundKeyBits2, hexRoundKey2] = generate_round_keys(key2);
  const [roundKeyBits3, hexRoundKey3] = generate_round_keys(key3);
  let decrypted_text = decrypt(cipherText, roundKeyBits3, hexRoundKey3);
  decrypted_text = encrypt(decrypted_text, roundKeyBits2, hexRoundKey2);
  decrypted_text = decrypt(decrypted_text, roundKeyBits1, hexRoundKey1);

  return decrypted_text;
}

async function startEncrypt(
  plainText,
  initKey,
  plainTextCheck = "plainText",
  keyCheck = "plainText"
) {
  if (plainTextCheck !== keyCheck) {
    return { error: "Make The Inputs The Same Data Type." };
  }
  if (plainTextCheck === "plainText" && keyCheck === "plainText") {
    changedPlainText = textToASCII(plainText);
    changedKey = textToASCII(initKey);
    key1 = changedKey.substring(0, 16);
    key2 = changedKey.substring(16, 32);
    key3 = changedKey.substring(32, 48);
    const blocks = splitIntoBlocks(changedPlainText);
    const encryptedBlocks = blocks.map((block) => {
      if (block.length === 64) {
        return des_3_encrypt(bin2hex(block), key1, key2, key3);
      } else {
        block = addPadding(block);
        isPadding = true;
        return des_3_encrypt(bin2hex(block), key1, key2, key3);
      }
    });
    const decryptedBlocks = encryptedBlocks.map((block) => {
      return des_3_decrypt(block, key1, key2, key3);
    });

    cipher_text = encryptedBlocks.join("");
    decrypted_text = decryptedBlocks.join("");
    if (isPadding) {
      decrypted_text = removePadding(decrypted_text);
    }
  } else if (plainTextCheck === "hexaDecimal" && keyCheck === "hexaDecimal") {
    key1 = initKey.substring(0, 16);
    key2 = initKey.substring(16, 32);
    key3 = initKey.substring(32, 48);
    const blocks = splitIntoBlocks(hex2bin(plainText));
    const encryptedBlocks = blocks.map((block) => {
      if (block.length === 64) {
        return des_3_encrypt(bin2hex(block), key1, key2, key3);
      } else {
        block = addPadding(block);
        isPadding = true;
        return des_3_encrypt(bin2hex(block), key1, key2, key3);
      }
    });
    const decryptedBlocks = encryptedBlocks.map((block) => {
      return des_3_decrypt(block, key1, key2, key3);
    });

    cipher_text = encryptedBlocks.join("");
    decrypted_text = decryptedBlocks.join("");
    if (isPadding) {
      decrypted_text = removePadding(decrypted_text);
      isPadding = false;
    }

  }
  return {
    encryptedCipherText: cipher_text,
    decryptedCipherText: decrypted_text,
  };
}
async function startDecrypt(plainText, initKey, plainTextCheck, keyCheck) {
  if (plainTextCheck !== keyCheck) {
    return { error: "Make The Inputs The Same Data Type." };
  }
  if (plainTextCheck === "plainText" && keyCheck === "plainText") {
    changedPlainText = textToASCII(plainText);
    changedKey = textToASCII(initKey);
    key1 = changedKey.substring(0, 16);
    key2 = changedKey.substring(16, 32);
    key3 = changedKey.substring(32, 48);
    const blocks = splitIntoBlocks(hex2bin(changedPlainText));
    const encryptedBlocks = blocks.map((block) => {
      if (block.length === 64) {
        return des_3_decrypt(bin2hex(block), key1, key2, key3);
      }
    });
    const decryptedBlocks = encryptedBlocks.map((block) => {
      return des_3_encrypt(block, key1, key2, key3);
    });

    cipher_text = encryptedBlocks.join("");
    decrypted_text = decryptedBlocks.join("");
  } else if (plainTextCheck === "hexaDecimal" && keyCheck === "hexaDecimal") {
    key1 = initKey.substring(0, 16);
    key2 = initKey.substring(16, 32);
    key3 = initKey.substring(32, 48);
    const blocks = splitIntoBlocks(hex2bin(plainText));
    const decryptedBlocks = blocks.map((block) => {
      if (block.length === 64) {
        return des_3_decrypt(bin2hex(block), key1, key2, key3);
      } else {
        block = addPadding(block);
        isPadding = true;
        return des_3_decrypt(bin2hex(block), key1, key2, key3);
      }
    });
    const encryptedBlocks = decryptedBlocks.map((block) => {
      return des_3_encrypt(block, key1, key2, key3);
    });

    cipher_text = encryptedBlocks.join("");
    decrypted_text = decryptedBlocks.join("");
    if (isPadding) {
      decrypted_text = removePadding(cipher_text);
    }
  }
  return {
    encryptedCipherText: cipher_text,
    decryptedCipherText: decrypted_text,
  };
}

module.exports = {
  startEncrypt,
  startDecrypt,
};
