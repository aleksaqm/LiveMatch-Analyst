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
import { Clock } from "lucide-react";

// Define the type expected by this component
type GameEventDisplay = {
  id: string;
  type: string;
  team?: string;
  details: {
    points?: number | string;
    shotType?: string;
    [key: string]: unknown;
  };
  timestamp: string;
};

type EventsListProps = {
  events: GameEventDisplay[];
};

const EVENT_LABELS: Record<string, string> = {
  SHOT_MADE: "Pogođen šut",
  SHOT_MISSED: "Promašen šut",
  REBOUND: "Skok",
  ASSIST: "Asistencija",
  STEAL: "Ukradena lopta",
  BLOCK: "Blokada",
  TURNOVER: "Izgubljena lopta",
  FOUL: "Faul",
  TIMEOUT: "Tajm-aut",
  SUBSTITUTION: "Izmena",
  QUARTER_END: "Kraj četvrtine",
};

export function EventsList({ events }: EventsListProps) {
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
        <CardTitle className="text-xl font-bold">Poslati događaji</CardTitle>
        <CardDescription>Hronološki prikaz svih događaja</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {events.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Još nema poslatih događaja
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-border bg-secondary p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {EVENT_LABELS[event.type] || event.type}
                        </Badge>
                        {event.team && (
                          <Badge variant="secondary" className="text-xs">
                            Tim {event.team}
                          </Badge>
                        )}
                      </div>
                      {event.details && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {event.details.points &&
                            `${String(event.details.points)} poena`}
                          {event.details.shotType &&
                            ` • ${String(event.details.shotType)}`}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTime(event.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
