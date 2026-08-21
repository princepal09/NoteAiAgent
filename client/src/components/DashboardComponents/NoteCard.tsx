import {
  CheckCircle2,
  Circle,
  MoreHorizontal,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface NoteCardProps {
  content: string;
  completed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export function NoteCard({
  content,
  completed = false,
  createdAt,
}: NoteCardProps) {
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <Card className="group relative overflow-hidden border-zinc-800 bg-zinc-900/50 shadow-none transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            {completed ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                <span className="text-xs font-medium text-emerald-400">
                  Completed
                </span>
              </>
            ) : (
              <>
                <Circle className="h-4 w-4 text-zinc-500" />

                <span className="text-xs text-zinc-500">
                  Pending
                </span>
              </>
            )}
          </div>

          {/* Actions */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-600 opacity-0 transition-opacity hover:bg-zinc-800 hover:text-zinc-200 group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <p
          className={`mt-5 text-[15px] leading-7 ${
            completed
              ? "text-zinc-600 line-through"
              : "text-zinc-200"
          }`}
        >
          {content}
        </p>

        {/* Footer */}
        <div className="mt-6 flex items-center gap-2 text-xs text-zinc-600">
          <CalendarDays className="h-3.5 w-3.5" />

          <span>
            Created {formatDate(createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}