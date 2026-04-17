import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";
import fs from "fs";
import pdfParse from "pdf-parse-debugging-disabled";

// controller for enhancing a resume professional summary
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const response = await ai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that helps enhance a resume professional summary."
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
        });

        // ✅ FIX (safe access)
        const enhancedContent =
            response?.choices?.[0]?.message?.content || "Could not enhance summary";

        return res.status(200).json({ enhancedContent });

    } catch (error) {
        console.log("AI ERROR (SUMMARY):", error);

        // ✅ FIX (return real status instead of always 400)
        const status = error?.status || error?.response?.status || 500;

        return res.status(status).json({
            message: error.message || "AI request failed",
        });
    }
};


// controller for enhancing a resume job description
export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: "missing required fields" });
        }

        const response = await ai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Enhance the job description in 1-2 sentences, highlight achievements, and make it ATS-friendly."
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
        });

        // ✅ FIX (safe access)
        const enhancedContent =
            response?.choices?.[0]?.message?.content || "Could not enhance description";

        return res.status(200).json({ enhancedContent });

    } catch (error) {
        console.log("AI ERROR (JOB DESC):", error);

        // ✅ FIX (real status)
        const status = error?.status || error?.response?.status || 500;

        // ✅ OPTIONAL FALLBACK (prevents app break if 429)
        if (status === 429) {
            return res.status(200).json({
                enhancedContent: "Improved: " + req.body.userContent
            });
        }

        return res.status(status).json({
            message: error.message || "AI request failed",
        });
    }
};


// controller for uploading resume to database
export const uplodeResume = async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user.id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const buffer = fs.readFileSync(file.path);
        const pdfData = await pdfParse(buffer);

        const resumeText = pdfData.text;
        console.log("resumeText:", resumeText);

        if (!resumeText) {
            return res.status(400).json({ message: "missing required fields" });
        }

        const systemPrompt = "You are an AI agent that extracts structured resume data.";

        const userPrompt = `...`; // unchanged

        const response = await ai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
        });

        // ✅ FIX (safe access)
        const extractedData =
            response?.choices?.[0]?.message?.content || "{}";

        let parsedData;
        try {
            parsedData = JSON.parse(extractedData);
        } catch (err) {
            return res.status(400).json({
                message: "AI did not return valid JSON",
                raw: extractedData
            });
        }

        const newResume = await Resume.create({
            title,
            userId,
            ...parsedData
        });

        res.json({ resumeId: newResume._id });

    } catch (error) {
        console.log("AI ERROR (UPLOAD):", error);

        const status = error?.status || error?.response?.status || 500;

        return res.status(status).json({
            message: error.message || "Upload failed",
        });
    }
};