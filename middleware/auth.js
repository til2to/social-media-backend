import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = async (req, res, next) => {
  try {
    // check if the user is really who he claims to be
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;
    let decodedData = null;
    if(token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.JWT_TOKEN_KEY);
      req.userId = decodedData?.id;
    }else{
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next()
  } catch (error) {
    console.log(error.message)
  }
}

export default auth;
