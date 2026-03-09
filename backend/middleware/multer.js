// import multer from 'multer';

// const storage = multer.memoryStorage();

// //single upload
// export const singleUpload = multer({storage}).single("file")

// //multiple upload upto 5 images 
// export const multipleUpload = multer({storage}).array("file",5);


import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;



