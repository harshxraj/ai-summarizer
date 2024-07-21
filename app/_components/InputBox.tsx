import { Description, Field, Label, Textarea, Button } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import FileUploader from "./Reader";
import Example from "./Example";

interface InputBoxProps {
  fetchDataFromGemini: (searchText: string, summaryLength: string) => Promise<void>;
  loading: boolean;
  selected: { name: string };
  setSelected: (plan: { name: string; ram: string; cpus: string; disk: string }) => void;
}

export default function InputBox({ fetchDataFromGemini, loading, selected, setSelected }: InputBoxProps) {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="w-full max-w-2xl px-4 mb-3">
      <Field>
        <Label className="text-sm/6 font-medium text-white">Enter your text here to summarize</Label>
        <Description className="text-sm/6 text-white/50">
          Get summary, sentiment, topics, keywords
        </Description>
        <Textarea
          className={clsx(
            "mt-3 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 custom-scrollbar"
          )}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          rows={3}
        />
      </Field>

      <Example selected={selected} setSelected={setSelected} />
      <div className="flex justify-evenly items-center my-2">
        <Button
          disabled={loading}
          onClick={() => fetchDataFromGemini(searchText, selected.name.toLowerCase())}
          className="inline-flex items-center gap-2 rounded bg-gray-900 py-1.5 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-gray-800 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
        >
          {loading ? "Summarizing..." : "Summarize"}
        </Button>
        <FileUploader
          fetchDataFromGemini={(text) => fetchDataFromGemini(text, selected.name.toLowerCase())}
          loading={loading}
        />
      </div>
    </div>
  );
}
