import { Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const plans = [{ name: "Short" }, { name: "Medium" }, { name: "Long" }];

interface ExampleProps {
  selected: { name: string };
  setSelected: (plan: { name: string; ram: string; cpus: string; disk: string }) => void;
}

export default function Example({ selected, setSelected }: ExampleProps) {
  return (
    <div className="w-full px-4 my-4">
      <div className="mx-auto w-full max-w-4xl">
        <RadioGroup
          by="name"
          value={selected}
          onChange={setSelected}
          aria-label="Server size"
          className="flex space-x-2"
        >
          {plans.map((plan) => (
            <Radio
              key={plan.name}
              value={plan}
              className="group relative flex-1 cursor-pointer rounded-lg bg-white/5 py-4 px-5 text-white shadow-md transition focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
            >
              <div className="flex items-center justify-between h-[2px]">
                <div className="text-sm/6">
                  <p className="font-lighter text-white">{plan.name}</p>
                </div>
                <CheckCircleIcon className="h-6 w-6 fill-white opacity-0 transition group-data-[checked]:opacity-100" />
              </div>
            </Radio>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
