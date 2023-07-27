import multer, { FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";

const FILE_TYPE_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError: Error = new Error("Invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (FILE_TYPE_MAP[file.mimetype]) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid image type"), false); // Reject the file
  }
};

const uploadOptions: multer.Options = { storage: storage, fileFilter: fileFilter };

const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const upload = multer(uploadOptions).single("image");
  upload(req, res, function (err: any) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "Error uploading the file", err: err.message });
    } else if (err) {
      return res.status(400).json({ message: "An error occurred while processing the file", err: err.message });
    }
    next();
  });
};

const multipleUploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const upload = multer(uploadOptions).array("images", 10);
  upload(req, res, function (err: any) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "Error uploading the files", err: err.message });
    } else if (err) {
      return res.status(400).json({ message: "An error occurred while processing the files", err: err.message });
    }
    next();
  });
};

export { uploadMiddleware, multipleUploadMiddleware };
