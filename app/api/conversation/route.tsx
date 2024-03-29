import type { NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
const model = genAI.getGenerativeModel({
  model: 'gemini-pro',
});

export type ResponseData = {
  text: string;
};

export async function POST(req: any, _res: NextApiResponse<ResponseData>) {
  const { prompt } = await req.json();
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return Response.json({ text });
}
