import bcrypt from "bcrypt";

const password = process.argv[2];

if (!password) {
  console.log('Usage: node hashPassword.js "yourPassword"');
  process.exit(1);
}

const generateHash = async () => {
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Hashed Password:");
  console.log(hashedPassword);
};

generateHash();