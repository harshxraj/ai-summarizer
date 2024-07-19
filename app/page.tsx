"use client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import InputBox from "./_components/InputBox";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const obj = {
  summary:
    "In an epic confrontation within a castle, Tanjiro and Giyu engage in a fierce battle against Akaza, Upper Rank Three, to avenge Kyojuro Rengoku's death. Despite being injured, Tanjiro showcases his improved Hinokami Kagura techniques, including Fire Wheel, Fake Rainbow, and Raging Sun. Giyu impresses with his Water Breathing forms, including Dead Calm and Water Wheel, negating Akaza's powerful attacks. As the battle intensifies, Akaza acknowledges Tanjiro's strength and uses his Technique Development, Destructive Death, marking the true beginning of the fight.",
  sentiment_analysis: {
    overall_sentiment: "positive",
    positive_keywords: [
      "admire",
      "acknowledge",
      "avenge",
      "battle",
      "counter",
      "fight",
      "improve",
      "impress",
      "powerful",
      "strength",
      "technique",
    ],
    negative_keywords: ["death", "injury", "pain", "sacrifice"],
  },
  topic_identification: {
    main_topic: "Battle between Tanjiro, Giyu, and Akaza",
    sub_topics: [
      "Revenge for Rengoku's death",
      "Tanjiro's improved techniques",
      "Giyu's Water Breathing forms",
      "Akaza's Technique Development",
    ],
  },
  keyword_extraction: {
    keywords: [
      "Akaza",
      "Giyu",
      "Hinokami Kagura",
      "Kyojuro Rengoku",
      "Muzan Kibutsuji",
      "Shinobu Kocho",
      "Tanjiro",
      "Technique Development",
      "Upper Rank Three",
      "Water Breathing",
    ],
  },
};

interface SentimentAnalysis {
  overall_sentiment: string;
  positive_keywords: string[];
  negative_keywords: string[];
}

interface TopicIdentification {
  main_topic: string;
  sub_topics: string[];
}

interface KeywordExtraction {
  keywords: string[];
}

interface Data {
  summary: string;
  sentiment_analysis: SentimentAnalysis;
  topic_identification: TopicIdentification;
  keyword_extraction: KeywordExtraction;
}

export default function Home() {
  const [data, setData] = useState<Data>();

  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchDataFromGemini(searchText: string) {
    try {
      const prompt = `${searchText} (Summarize this text and provide the following analyses in JSON format:
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
      })`;

      setLoading(true);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log(response);
      const text = await response.text();

      const jsonString = text.replace(/^```json\s*([\s\S]*)\s*```$/g, "$1");

      const responseObject = JSON.parse(jsonString);
      console.log(responseObject);
      console.log(text);
      setData(responseObject);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center mt-2">
      <h1 className="text-3xl font-light capitalize">AI summarizer</h1>
      <InputBox fetchDataFromGemini={fetchDataFromGemini} loading={loading} />
      {loading && <span className="loading loading-dots loading-lg"></span>}

      {!loading && data && (
        <>
          <div className="px-10 w-full">
            <h2 className="text-3xl mb-2">Summary</h2>
            <div className="p-4 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100/20">
              <p className="font-light text-slate-200">{data?.summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1  md:grid-cols-2 w-full mt-3">
            <div className="px-10 mb-2">
              <h2 className="text-2xl mb-2 ">Topic</h2>
              <div className="p-4 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100/20">
                <p className="font-light text-slate-200">{data?.topic_identification?.main_topic}</p>
              </div>
            </div>

            <div className="px-10 mb-2">
              <h2 className="text-2xl mb-2">Sentiment</h2>
              <div className="p-4 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100/20">
                <p className="font-light text-slate-200">{data?.sentiment_analysis?.overall_sentiment}</p>
              </div>
            </div>
          </div>
          <div className="px-10 mb-2 w-full">
            <h2 className="text-2xl mb-2">Keywords</h2>
            <div className="p-4 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100/20">
              <p className="font-light text-slate-200">{data?.keyword_extraction?.keywords.join(",")}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
