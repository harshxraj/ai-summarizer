import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(request: NextRequest) {
  try {
    const { searchText } = await request.json();
    const prompt = `${searchText} (Summarize the text and provide the following analyses in JSON format without formatting or using markdown. Respond with only JSON):
    {
      "summary": "",
      "sentiment_analysis": {
        "overall_sentiment": "",
        "positive_keywords": [],
        "negative_keywords": []
      },
      "topic_identification": {
        "main_topic": "",
        "sub_topics": []
      },
      "keyword_extraction": {
        "keywords": []
      }
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    const jsonString = text.replace(/^```json\s*([\s\S]*)\s*```$/g, "$1");
    const responseObject = JSON.parse(jsonString);

    return NextResponse.json({ data: responseObject });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
