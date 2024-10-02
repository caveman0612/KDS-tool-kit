var encryptOp = new sn_kmf_ns.KMFCryptoOperation(
  'sn_kmf.symmetric_encryption_test',
  'SYMMETRIC_ENCRYPTION'
).withInputFormat('KMFNone');

var encryptedText = encryptOp.doOperation('password');

var encryptOp = new sn_kmf_ns.KMFCryptoOperation(
  'sn_kmf.symmetric_encryption_test',
  'SYMMETRIC_DECRYPTION'
).withOutputFormat('KMFNone');

var clear_text = encryptOp.doOperation(encryptedText);

gs.info(clear_text);

new global.myPasswordHelper().decrypt(pwd);
