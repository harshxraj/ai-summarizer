"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import InputBox from "./_components/InputBox";
import { Download } from "lucide-react";

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
  const [data, setData] = useState<Data | null>(null);
  console.log(data);
  const [loading, setLoading] = useState(false);

  const generatePdf = () => {
    if (!data) return;
    const doc = new jsPDF();

    doc.setFontSize(10);

    doc.text("Summary:", 10, 10);
    doc.text(data?.summary, 10, 20, { maxWidth: 180 });

    doc.text("Sentiment Analysis:", 10, 50);
    doc.text(`Overall Sentiment: ${data.sentiment_analysis.overall_sentiment}`, 10, 60);
    doc.text("Positive Keywords:", 10, 70);
    doc.text(data.sentiment_analysis.positive_keywords.join(", "), 10, 80, { maxWidth: 180 });

    doc.text("Topic Identification:", 10, 100);
    doc.text(`Main Topic: ${data.topic_identification.main_topic}`, 10, 110);
    doc.text("Sub Topics:", 10, 120);
    doc.text(data.topic_identification.sub_topics.join(", "), 10, 130, { maxWidth: 180 });

    doc.text("Keywords:", 10, 150);
    doc.text(data.keyword_extraction.keywords.join(", "), 10, 160, { maxWidth: 180 });

    doc.save(`${data.topic_identification.main_topic}.pdf`);
  };

  async function fetchDataFromGemini(searchText: string) {
    try {
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

      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchText }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const text = await response.text();
      const jsonString = text.replace(/^```json\s*([\s\S]*)\s*```$/g, "$1");
      const responseObject = JSON.parse(jsonString);
      console.log(responseObject);
      setData(responseObject?.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center mt-2">
      <h1 className="text-3xl font-light capitalize">AI Summarizer</h1>
      <InputBox fetchDataFromGemini={fetchDataFromGemini} loading={loading} />
      {loading && <span className="loading loading-dots loading-lg"></span>}

      {!loading && data && (
        <>
          <div className="px-10 w-full">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl mb-2">Summary</h2>
              <Download size={26} className="text-green-600 hover:cursor-pointer" onClick={generatePdf} />
            </div>

            <div className="p-4 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100/20">
              <p className="font-light text-slate-200">{data?.summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 w-full mt-3">
            <div className="px-10 mb-2">
              <h2 className="text-2xl mb-2">Topic</h2>
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
              <p className="font-light text-slate-200">{data?.keyword_extraction?.keywords.join(", ")}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
