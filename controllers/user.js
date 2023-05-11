import mongoose from 'mongoose';
import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/user.js'

dotenv.config();

// sign in user1
// export const signin = async (req, res) => {
//   const { email, password } = req.body
//   // check if user exist by email
//   try{
//     const existingUser = await User.findOne({ email })
//     if(!existingUser) return res.status(404).json({ message: "invalid request" })
//     // also check the existing password
//     const bytes = CryptoJS.AES.decrypt(existingUser.password, "my secret key with spaces and hashes#");
//     const existingPassword = bytes.toString(CryptoJS.enc.Utf8);
    
//     // const isPasswordCorrect = password === existingPassword;
//     if (password !== existingPassword) return res.status(401).json({ message: "invalid" })
//     // continue by getting user's jwt token that needs to be sent to the frontend
//     const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'secret', { expiresIn: "1h" })
//     res.status(200).json({ data: existingUser, token })
//   } 
//   catch(error){
//     res.status(500).json({ message: `Something went wrong, ${error}` })
//   }
// }

// sign in user1
export const signin = async (req, res) => {
  const { email, password } = req.body
  // check if user exist by email
  try{
    const existingUser = await User.findOne({ email })
    if(!existingUser) return res.status(404).json({ message: "invalid request" })
    
    // also check the existing password
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
    if(!isPasswordCorrect) return res.status(400).json({ message: "invalid credentials" })
    let result = existingUser
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_TOKEN_KEY, { expiresIn: "1h" })
    res.status(200).json({ result, token })
  } 
  catch(error){
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// //create user
// export const signup = async (req, res) => {
//   const { email, password, confirmPassword, firstName, lastName } = req.body
//   try{
//     const existingUser = await User.findOne({ email });
//     if(existingUser) return res.status(400).json({ message: "user already exist" })
//     // compare the password and the confirmpassword fields

//     // const comparePasswords = password === confirmPassword
//     if(password !== confirmedPassword) return res.status(400).json({ message: "passwords dont match"})
    
//     // hash the password using cryptojs
//     const salt = CryptoJS.lib.WordArray.random(16);
//     // const hashedPassword = CryptoJS.PBKDF2(password, salt, { keySize: 512/32, iterations: 1000 }).toString();
//     const hashedPassword = CryptoJS.PBKDF2(password, salt, { keySize: 512/32, iterations: 1000 }).toString(CryptoJS.enc.Hex);

//     // create the user
//     const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` })
//     const token = jwt.sign({ email: result.email, id: result._id }, 'secret', { expiresIn: "1h" })

//     res.status(201).json({ token, result })
//   }
//   catch(error){
//     res.status(500).json({ message: "Something went wrong" })
//   }
// }

// create user
export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body
  try{
    const existingUser = await User.findOne({ email });
    if(existingUser) return res.status(400).json({ message: "user already exist" })
    // compare the password and the confirmedpassword fields

    // const comparePasswords = password === confirmedPassword
    if(password !== confirmPassword) return res.status(400).json({ message: "passwords dont match"})
    
    const hashedPassword = await bcrypt.hash(password, 12);
    // create the user
    const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` })
    const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_TOKEN_KEY, { expiresIn: "1h" })
    res.status(201).json({ token, result })
  }
  catch(error){
    res.status(500).json({ message: "something went wrong" })
  }
}
