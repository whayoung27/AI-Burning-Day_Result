var aes256 = require("aes256");

var key = "my passphrase";
var plaintext = "my plaintext message";
var cipher = aes256.createCipher(key);

var encrypted = cipher.encrypt(plaintext);
var decrypted = cipher.decrypt(encrypted);
console.info(encrypted);
console.info(decrypted);
