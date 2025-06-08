const axios = require("axios");

const generateTemplate = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (prompt) {
      const response = await axios.post("http://localhost:11434/api/generate", {
        model: "mistral",
        prompt: prompt,
        stream: false,
      });

      res.json({ reply: response.data.response });
    }
  } catch (error) {
    console.error("Exception in generateTemplate", error);
  }
};
module.exports = { generateTemplate };
