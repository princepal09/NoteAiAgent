import { useState } from "react";
import {
  ArrowUp,
  Bot,
  Sparkles,
} from "lucide-react";

import { Navbar } from "@/components/general/Navbar";
import { NoteCard } from "@/components/DashboardComponents/NoteCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const demoNotes = [
  {
    id: "1",
    content: "Buy groceries tomorrow",
    completed: false,
  },
  {
    id: "2",
    content: "Finish AI Notes dashboard",
    completed: false,
  },
  {
    id: "3",
    content: "Read about AI agents",
    completed: true,
  },
];

export default function Dashboard() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    console.log("Send to AI:", message);

    // Later:
    // POST message to your AI agent API

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#09090b]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Welcome */}
        <section className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-400" />

            <span className="text-sm text-violet-400">
              AI Workspace
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white">
            What would you like to do?
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage your notes using natural language.
          </p>
        </section>

        {/* AI Input */}
        <section className="mb-12">
          <div className="rounded-2xl border border-white/10 bg-[#18181b] p-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                <Bot className="h-5 w-5 text-violet-400" />
              </div>

              <Input
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
                placeholder="Try: Create a note to buy milk tomorrow..."
                className="border-none bg-transparent text-white shadow-none placeholder:text-zinc-500 focus-visible:ring-0"
              />

              <Button
                size="icon"
                onClick={handleSend}
                className="shrink-0 rounded-xl bg-violet-600 hover:bg-violet-500"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Example commands */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-zinc-500">
              Try:
            </span>

            {[
              "Create a note",
              "Show my notes",
              "Mark a note as completed",
              "Delete a note",
            ].map((command) => (
              <button
                key={command}
                onClick={() => setMessage(command)}
                className="rounded-full border border-white/10 bg-[#18181b] px-3 py-1 text-xs text-zinc-400 transition hover:border-violet-500/40 hover:text-white"
              >
                {command}
              </button>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Your Notes
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Manage your tasks and ideas.
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-[#18181b] px-3 py-1 text-sm text-zinc-400">
              {demoNotes.length} notes
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demoNotes.map((note) => (
              <NoteCard
                key={note.id}
                content={note.content}
                completed={note.completed}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}