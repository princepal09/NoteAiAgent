import {
  CheckCircle2,
  Circle,
  MoreHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface NoteCardProps {
  content: string;
  completed?: boolean;
}

export function NoteCard({
  content,
  completed = false,
}: NoteCardProps) {
  return (
    <Card className="border-white/10 bg-[#1a1a1e] transition hover:border-white/20 hover:bg-[#202025]">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <Badge
              variant="outline"
              className={
                completed
                  ? "border-green-500/30 text-green-400"
                  : "border-violet-500/30 text-violet-400"
              }
            >
              {completed ? "Completed" : "Active"}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-500 hover:text-white"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        <p
          className={
            completed
              ? "text-zinc-500 line-through"
              : "text-zinc-200"
          }
        >
          {content}
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm">
          {completed ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-400" />

              <span className="text-zinc-500">
                Completed
              </span>
            </>
          ) : (
            <>
              <Circle className="h-4 w-4 text-violet-400" />

              <span className="text-zinc-500">
                In progress
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}