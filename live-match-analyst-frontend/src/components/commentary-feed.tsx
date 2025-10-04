"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Commentary } from "@/components/game-screen";
import { AlertCircle, BarChart3, MessageSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type CommentaryFeedProps = {
  commentaries: Commentary[];
};

const IMPORTANCE_CONFIG = {
  LOW: {
    label: "Niska",
    className: "border-muted-foreground/20 bg-muted/50 text-muted-foreground",
    iconColor: "text-muted-foreground",
  },
  MEDIUM: {
    label: "Srednja",
    className: "border-primary/30 bg-primary/10 text-foreground",
    iconColor: "text-primary",
  },
  HIGH: {
    label: "Visoka",
    className: "border-orange-500/50 bg-orange-500/20 text-foreground",
    iconColor: "text-orange-500",
  },
  CRITICAL: {
    label: "Kritična",
    className: "border-red-500/50 bg-red-500/20 text-foreground",
    iconColor: "text-red-500",
  },
};

const TYPE_CONFIG = {
  PLAY_BY_PLAY: {
    label: "Akcija",
    icon: MessageSquare,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  },
  ANALYSIS: {
    label: "Analiza",
    icon: BarChart3,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  },
  STATISTIC: {
    label: "Statistika",
    icon: BarChart3,
    color: "bg-green-500/10 text-green-500 border-green-500/30",
  },
  HIGHLIGHT: {
    label: "Highlight",
    icon: Sparkles,
    color: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  },
};

export function CommentaryFeed({ commentaries }: CommentaryFeedProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("sr-RS", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Komentari uživo</CardTitle>
        <CardDescription>Real-time komentari sa backenda</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {commentaries.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Čekanje na komentare...
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Komentari će se pojaviti nakon slanja događaja
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {commentaries.map((commentary) => {
                const importanceConfig =
                  IMPORTANCE_CONFIG[commentary.importance];
                const typeConfig = TYPE_CONFIG[commentary.type];
                const TypeIcon = typeConfig.icon;

                return (
                  <div
                    key={commentary.id}
                    className={cn(
                      "rounded-lg border p-4 transition-all",
                      importanceConfig.className,
                      commentary.importance === "CRITICAL" &&
                        "ring-2 ring-red-500/50",
                      commentary.importance === "HIGH" &&
                        "ring-1 ring-orange-500/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-1 rounded-full p-2",
                          typeConfig.color
                        )}
                      >
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn("text-xs", typeConfig.color)}
                          >
                            {typeConfig.label}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              importanceConfig.iconColor
                            )}
                          >
                            {importanceConfig.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(commentary.timestamp)}
                          </span>
                        </div>
                        <p
                          className={cn(
                            "text-base leading-relaxed",
                            commentary.importance === "CRITICAL" &&
                              "font-semibold text-lg",
                            commentary.importance === "HIGH" && "font-medium"
                          )}
                        >
                          {commentary.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
