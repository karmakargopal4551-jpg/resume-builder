import Resume from "../models/Resume.js";
import imagekit from "../configs/imageKit.js";
import fs from "fs";
// import { structuredClone } from "worker_threads";

// CREATE
export const createResume = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title } = req.body;

        const newResume = await Resume.create({ title, userId });
        return res.status(201).json({
            message: "Resume created successfully",
            resume: newResume
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// DELETE
export const deleteResume = async (req, res) => {
    try {
        const userId = req.user.id;
        const { resumeId } = req.params;

        await Resume.findOneAndDelete({ userId, _id: resumeId });

        return res.status(200).json({
            message: "Resume deleted successfully"
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// GET USER RESUME
export const getUserResume = async (req, res) => {
    try {
        const userId = req.user.id;
        const { resumeId } = req.params;

        const resume = await Resume.findOne({ userId, _id: resumeId });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        return res.status(200).json({ resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// PUBLIC
export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;

        const resume = await Resume.findById(resumeId);

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        return res.status(200).json({ resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// UPDATE
export const updateResume = async (req, res) => {
    try {
        const userId = req.user.id;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;
        console.log("resumeData", resumeData);

        let resumeDataCopy;
        if (typeof resumeData === 'string') {
            resumeDataCopy = JSON.parse(resumeData);
        } else {
            resumeDataCopy = JSON.parse(JSON.stringify(resumeData));
        }
        console.log("resumeDataCopy", resumeDataCopy);

        // Image
        if (image) {

            const imageBufferData = fs.createReadStream(image.path);

            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder: 'user-resumes',
                transformation: {
                    pre: 'w-300,h-300,fo-face,z-0.75' +
                        (removeBackground ? ',bg-remove' : '')
                }
            });
            resumeDataCopy.personal_info.image = response.url;
        }

        const resume = await Resume.findOneAndUpdate(
            { userId, _id: resumeId },
            resumeDataCopy,
            { new: true }
        );
        console.log("reaume", resume);

        return res.status(200).json({
            message: "Resume updated successfullyy",
            resume
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};