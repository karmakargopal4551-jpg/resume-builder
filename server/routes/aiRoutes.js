import express from "express";
import multer from "multer";
import protect from "../middlewares/authMiddleware.js";
import {
    enhanceJobDescription,
    enhanceProfessionalSummary,
    uplodeResume
} from "../controllers/aiController.js";

const aiRouter = express.Router();

// multer setup
const upload = multer({ dest: "uploads/" });

// routes
aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription);

// add upload middleware here
aiRouter.post('/upload-resume', protect, upload.single("file"), uplodeResume);

export default aiRouter;