import { useEffect, useState } from "react";
import { ArrowUp, Loader2, X, Sparkles } from "lucide-react";

import { Navbar } from "@/components/general/Navbar";

import { NoteCard } from "@/components/DashboardComponents/NoteCard";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { getAllNotes } from "@/api/note.api";

import { INote } from "@/types/note.type";

import { toast } from "sonner";

import { chatWithAgent } from "@/api/agent.api";

export default function Dashboard() {
  const [message, setMessage] = useState("");

  const [notes, setNotes] = useState<INote[]>([]);

  const [messageLoading, setMessageLoading] = useState<boolean>(false);

  const loadAllNotes = async () => {
    try {
      const response = await getAllNotes();

      setNotes(response);
    } catch (err: any) {
      console.log(err.message);

      toast.error("Failed to load notes");
    }
  };

  useEffect(() => {
    loadAllNotes();
  }, []);

  const handleSend = async () => {
    if (!message.trim() || messageLoading) return;

    const currentMessage = message;

    setMessageLoading(true);

    try {
      await chatWithAgent(currentMessage);

      setMessage("");

      await loadAllNotes();
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");

      console.log(err);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <section className="max-w-2xl">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Sparkles className="h-4 w-4 text-violet-400" />

            <span>Your workspace</span>
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Notes, without the busywork.
          </h1>

          <p className="mt-3 max-w-xl text-[15px] leading-6 text-zinc-500">
            Tell your assistant what you need. Create, organize, complete, or
            remove notes using natural language.
          </p>
        </section>

        {/* AI Input */}
        <section className="mt-12">
          <div className="rounded-2xl relative border border-zinc-800 bg-zinc-900/50 p-2 transition focus-within:border-zinc-700 focus-within:bg-zinc-900">
            <div className="flex items-center gap-4">
              <Input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={messageLoading}
                placeholder="Ask your assistant to do something..."
                className="h-12  border-none bg-transparent px-4 text-[15px] text-white shadow-none placeholder:text-zinc-600 focus-visible:ring-0"
              />

              {message.trim() && !messageLoading && (
                <Button 
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setMessage("")}
                  className="h-9 w-9 shrink-0 absolute right-18 top-3 rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                  aria-label="Clear message"
                >
                  <X className="h-4  w-4" />
                </Button>
              )}

              <Button
                disabled={messageLoading || !message.trim()}
                size="icon"
                onClick={handleSend}
                className="mr-1 h-10 w-10 shrink-0 rounded-xl bg-violet-600 transition hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-600"
              >
                {messageLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs text-zinc-600">Try</span>

            {[
              "Create a note to call mom tomorrow",
              "Show my active notes",
              "Complete my grocery note",
            ].map((command) => (
              <button
                key={command}
                onClick={() => setMessage(command)}
                className="rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 transition hover:bg-zinc-900 hover:text-zinc-300"
              >
                {command}
              </button>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="mt-20">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-medium text-zinc-100">Your notes</h2>

              <p className="mt-1 text-sm text-zinc-600">
                {notes.length === 0
                  ? "No notes yet"
                  : `${notes.length} ${notes.length === 1 ? "note" : "notes"}`}
              </p>
            </div>
          </div>

          {notes.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  content={note.content}
                  completed={note.isCompleted}
                  createdAt={note.createdAt}
                  updatedAt={note.updatedAt}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-zinc-800 py-16 text-center">
              <p className="text-sm text-zinc-500">
                Your notes will appear here.
              </p>

              <p className="mt-1 text-xs text-zinc-700">
                Try asking your assistant to create one.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
