const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
	apiKey: 'YOUR_API_KEY'
});
const openai = new OpenAIApi(configuration);

export const generateKeywords = async (text: string): Promise<{[key: string]: any}> =>{
	const response = await openai.createCompletion({
		model: "text-davinci-002",
		prompt: `Extract keywords from this text:\n\n${text}`,
		temperature: 0.3,
		max_tokens: 60,
		top_p: 1,
		frequency_penalty: 0.8,
		presence_penalty: 0,
	});
	return response
}

