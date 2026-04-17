import ImageKit from '@imagekit/nodejs';
import dotenv from 'dotenv'
dotenv.config();

console.log("process.env.IMAGEKIT_PRIVATE_KEY", process.env.IMAGEKIT_PRIVATE_KEY);


const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});

export default imagekit