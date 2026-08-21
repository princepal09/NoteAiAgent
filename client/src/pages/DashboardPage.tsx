import { useEffect, useRef, useState } from "react";

import {
  ArrowUp,
  Loader2,
  X,
  Sparkles,
  Mic,
  Square,
} from "lucide-react";

import { Navbar } from "@/components/general/Navbar";

import { NoteCard } from "@/components/DashboardComponents/NoteCard";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { getAllNotes } from "@/api/note.api";

import { INote } from "@/types/note.type";

import { toast } from "sonner";

import { chatWithAgent } from "@/api/agent.api";

import { SpeechRecognitionInstance } from "@/types/speechRecognition.type";

export default function Dashboard() {
  const [message, setMessage] = useState("");

  const [notes, setNotes] = useState<INote[]>([]);

  const [messageLoading, setMessageLoading] =
    useState<boolean>(false);

  const [isListening, setIsListening] =
    useState(false);

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(null);

  const transcriptRef = useRef("");


  // Load all notes
  const loadAllNotes = async () => {
    try {
      const response = await getAllNotes();

      setNotes(response);
    } catch (err: any) {
      console.log(err.message);

      toast.error("Failed to load notes");
    }
  };


  // Load notes when component mounts
  useEffect(() => {
    loadAllNotes();
  }, []);


  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn(
        "Speech recognition is not supported in this browser"
      );

      return;
    }

    const recognition = new SpeechRecognitionAPI();

    // Stop recognition automatically when user stops speaking
    recognition.continuous = false;

    // Show speech while the user is speaking
    recognition.interimResults = true;

    // Change language if needed
    recognition.lang = "en-US";


    // User started speaking
    recognition.onstart = () => {
      transcriptRef.current = "";

      setMessage("");

      setIsListening(true);
    };


    // Receive speech results
    recognition.onresult = (
      event: SpeechRecognitionEvent
    ) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Save only final speech in ref
      if (finalTranscript) {
        transcriptRef.current += finalTranscript;
      }

      // Show final + temporary speech in input
      setMessage(
        `${transcriptRef.current} ${interimTranscript}`.trim()
      );
    };


    // Handle speech recognition errors
    recognition.onerror = (
      event: SpeechRecognitionErrorEvent
    ) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      if (event.error === "not-allowed") {
        toast.error(
          "Microphone permission denied. Please allow microphone access."
        );
      } else if (
        event.error !== "aborted" &&
        event.error !== "no-speech"
      ) {
        toast.error(
          "Could not recognize your voice"
        );
      }

      setIsListening(false);
    };


    // User finished speaking
    // Automatically call the agent API
    recognition.onend = async () => {
      setIsListening(false);

      const finalMessage =
        transcriptRef.current.trim();

      // Don't call API if user didn't say anything
      if (!finalMessage) return;

      // Prevent multiple API calls
      if (messageLoading) return;

      setMessageLoading(true);

      try {
        // Call your agent API automatically
        await chatWithAgent(finalMessage);

        // Clear input
        setMessage("");

        // Clear stored transcript
        transcriptRef.current = "";

        // Reload notes
        await loadAllNotes();
      } catch (err: any) {
        console.error(err);

        toast.error(
          err.message ||
          "Failed to send voice message"
        );
      } finally {
        setMessageLoading(false);
      }
    };


    recognitionRef.current = recognition;


    // Cleanup
    return () => {
      recognition.stop();

      recognitionRef.current = null;
    };
  }, []);


  // Start / Stop microphone
  const handleVoiceInput = () => {
    const recognition =
      recognitionRef.current;

    if (!recognition) {
      toast.error(
        "Speech recognition is not supported in this browser"
      );

      return;
    }

    if (messageLoading) {
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        transcriptRef.current = "";

        recognition.start();
      } catch (error) {
        console.error(error);
      }
    }
  };


  // Send typed message to agent
  const handleSend = async () => {
    if (!message.trim() || messageLoading) {
      return;
    }

    const currentMessage = message;

    setMessageLoading(true);

    try {
      await chatWithAgent(currentMessage);

      setMessage("");

      await loadAllNotes();
    } catch (err: any) {
      toast.error(
        err.message ||
        "Failed to send message"
      );

      console.error(err);
    } finally {
      setMessageLoading(false);
    }
  };


  // Send typed message when Enter is pressed
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
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
            Tell your assistant what you need. Create,
            organize, complete, or remove notes using
            natural language.
          </p>
        </section>


        {/* AI Input */}
        <section className="mt-12">

          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2 transition focus-within:border-zinc-700 focus-within:bg-zinc-900">

            <div className="flex items-center gap-2">

              {/* Text Input */}
              <Input
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={handleKeyDown}
                disabled={
                  messageLoading || isListening
                }
                placeholder={
                  isListening
                    ? "Listening..."
                    : messageLoading
                    ? "Agent is working..."
                    : "Ask your assistant to do something..."
                }
                className="h-12 flex-1 border-none bg-transparent px-4 text-[15px] text-white shadow-none placeholder:text-zinc-600 focus-visible:ring-0"
              />


              {/* Clear Button */}
              {message.trim() &&
                !messageLoading &&
                !isListening && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setMessage("")
                    }
                    className="h-10 w-10 shrink-0 rounded-xl text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                    aria-label="Clear message"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}


              {/* Microphone Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleVoiceInput}
                disabled={messageLoading}
                className={`h-10 w-10 shrink-0 rounded-xl transition ${
                  isListening
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    : "text-zinc-500 hover:bg-zinc-800 hover:text-violet-400"
                }`}
                aria-label={
                  isListening
                    ? "Stop listening"
                    : "Start voice input"
                }
              >
                {isListening ? (
                  <Square className="h-4 w-4 fill-current" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>


              {/* Send Button */}
              <Button
                disabled={
                  messageLoading ||
                  !message.trim() ||
                  isListening
                }
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


          {/* Listening Status */}
          {isListening && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-400">

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
              </span>

              Listening... Speak now

            </div>
          )}


          {/* Agent Loading Status */}
          {messageLoading && (
            <div className="mt-3 flex items-center gap-2 text-sm text-violet-400">

              <Loader2 className="h-4 w-4 animate-spin" />

              Your assistant is working...

            </div>
          )}


          {/* Suggestions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">

            <span className="mr-1 text-xs text-zinc-600">
              Try
            </span>

            {[
              "Create a note to call mom tomorrow",
              "Show my active notes",
              "Complete my grocery note",
            ].map((command) => (
              <button
                key={command}
                onClick={() =>
                  setMessage(command)
                }
                disabled={
                  messageLoading || isListening
                }
                className="rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 transition hover:bg-zinc-900 hover:text-zinc-300 disabled:opacity-50"
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
              <h2 className="text-lg font-medium text-zinc-100">
                Your notes
              </h2>

              <p className="mt-1 text-sm text-zinc-600">
                {notes.length === 0
                  ? "No notes yet"
                  : `${notes.length} ${
                      notes.length === 1
                        ? "note"
                        : "notes"
                    }`}
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