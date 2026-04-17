import OpenAI from "openai";

const ai = new OpenAI({ 
    apiKey: "AIzaSyDlQqQV_bIOHdthTCgFw5G6Gp_A48HPdKA",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export default ai