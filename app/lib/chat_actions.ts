'use server';

import OpenAI from 'openai';
import { auth } from '@/auth';

export async function newMessage(formData: FormData) {
    const session = await auth();
    const user = session?.user;
    const message = formData.get("message")?.toString() || '';
    const topic = formData.get("title")?.toString() || 's';

    console.log(user);
    console.log(message, topic);

    const client = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY'],
    });

    // const systemMessage = {
    //     role: "system",
    //     content: `You are a helpful assistant who ONLY answers questions about ${topic}. If the question is not directly related to ${topic}, say: "I don't know that one, but I can help you answer questions about ${topic}. Limit your answers to no more than 150 words."`
    // };

    // client.completions.create
    try {
        const response = await client.responses.create({
            model: "gpt-4o",
            instructions: `You are a helpful assistant who ONLY answers questions about ${topic}. If the question is not directly related to ${topic}, say: "I don't know that one, but I can help you answer questions about ${topic}.". Limit your answers to no more than 150 words.`,
            input: message,
        });
        console.log(response.output_text);
        return response.output_text;
    } catch (error) {
        console.error("OpenAI error:", error);
        return "Something went wrong while contacting the AI.";
    }
    
}