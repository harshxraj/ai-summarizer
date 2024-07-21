import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

type SummaryLength = "short" | "medium" | "long";

export async function POST(request: NextRequest) {
  try {
    const { searchText, summaryLength }: { searchText: string; summaryLength: SummaryLength } =
      await request.json();
    const summaryLengthMap: Record<SummaryLength, string> = {
      short: "brief (80-100 words)",
      medium: "detailed (100-250 words)",
      long: "in-depth (250-400 words)",
    };
    const selectedSummaryLength = summaryLengthMap[summaryLength] || summaryLengthMap.medium;

    const prompt = `${searchText} (Provide a ${selectedSummaryLength} summary of the text and include the following analyses in JSON format. Ensure the summary is strictly within the word count range specified. Respond with only JSON and DO NOT format or use markdown.):
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
