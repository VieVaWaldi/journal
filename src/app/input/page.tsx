"use client";
import { Typography } from "@/components/text/Typography";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { removeJournal, updateJournal } from "@/lib/journal-utils";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");

  return (
    <section>
      <div className="flex flex-col gap-8">
        <Typography text="Input" />
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your journal ..."
          className="h-[70vh] placeholder:text-gray-400"
        />
        <div className="flex flex-row gap-4 justify-end">
          <Button
            onClick={() => {
              updateJournal(text);
              setText("");
            }}
            variant="outline"
          >
            Update
          </Button>
          <Button
            onClick={() => {
              removeJournal();
              setText("");
            }}
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      </div>
    </section>
  );
}
