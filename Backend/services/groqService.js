const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: "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"
});

async function askGroq(prompt) {

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        model: "openai/gpt-oss-20b",
        response_format: {
            type: "json_object"
        }
    });

    return JSON.parse(completion.choices[0].message.content);
}

module.exports = {
    askGroq
};