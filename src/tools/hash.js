import bcrypt from "bcrypt";
const pass = process.argv[2] || "admin123";
const hash = await bcrypt.hash(pass, 10);
console.log(hash);