import type {NextApiRequest, NextApiResponse} from 'next';
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
      organization: "org-6f5Q76l6Sg0J43Y2K7F3Z0nV",
          apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


// Take in a request, which contains a comment in the body of the request.
// Destructure that and add it to a prompt.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { comment } = req.body
  console.log(comment)
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: `This is a comment from a message board where people discuss general things related to javscript, react, and web development. Send a response to the comment. It should be web development related. Comment: ${comment}. Do not include the word "Response" as the first word of the response. `}],
    max_tokens: 75,
  });

  // Return the response from OpenAI.
  if (completion.data.choices[0]?.message?.content === undefined) {
    return res.status(200).json({ response: "I don't understand. Please try again." });
  } else {
    return res.status(200).json({ response: completion.data.choices[0]?.message?.content });
  }
}

  
