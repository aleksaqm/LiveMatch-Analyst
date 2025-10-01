"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import type { Team } from "@/page";
import { EventPanel } from "@/components/event-panel";
import { CommentaryFeed } from "@/components/commentary-feed";
import { EventsList } from "@/components/events-list";
import {
  sendGameEvent,
  endGame as apiEndGame,
  type GameEvent,
  type CommentaryLine,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export type GameEventWithId = GameEvent & {
  id: string;
  timestamp_display: string;
};

export type Commentary = CommentaryLine & {
  id: string;
  timestamp: string;
};

export function GameScreen({
  teamA,
  teamB,
  onEndGame,
  onShowRules,
}: {
  teamA: Team;
  teamB: Team;
  onEndGame: () => void;
  onShowRules: () => void;
}) {
  const [events, setEvents] = useState<GameEventWithId[]>([]);
  const [commentaries, setCommentaries] = useState<Commentary[]>([]);
  const { toast } = useToast();

  // Game is already initialized by parent component

  const handleEventSent = useCallback(
    async (event: GameEventWithId) => {
      setEvents((prev) => [event, ...prev]);

      // Convert frontend event to backend format
      const backendEvent: GameEvent = {
        timestamp: Date.now(),
        playerId: event.playerId,
        teamId: event.teamId,
        eventType: event.eventType,
        details: event.details,
      };

      const result = await sendGameEvent(backendEvent);

      if (result.success && result.commentary) {
        // Convert backend commentary to frontend format
        const frontendCommentary: Commentary[] = result.commentary.map(
          (comment) => ({
            ...comment,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
          })
        );

        setCommentaries((prev) => [...frontendCommentary, ...prev]);
      } else if (!result.success) {
        toast({
          title: "Greška pri slanju događaja",
          description: result.error || "Pokušajte ponovo.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleEndGame = useCallback(async () => {
    const result = await apiEndGame();
    if (result.success) {
      toast({
        title: "Igra je završena",
        description: result.result || "Igra je uspešno završena.",
      });
      onEndGame();
    } else {
      toast({
        title: "Greška pri završavanju igre",
        description: result.error || "Pokušajte ponovo.",
        variant: "destructive",
      });
    }
  }, [onEndGame, toast]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleEndGame}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Završi utakmicu
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              ZAPISNIČKI STO
            </h1>
            <Button
              variant="outline"
              onClick={onShowRules}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Šabloni pravila
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Tim A</p>
              <p className="text-2xl font-bold">{teamA.name}</p>
            </div>
            <div className="text-4xl font-bold text-primary">VS</div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Tim B</p>
              <p className="text-2xl font-bold">{teamB.name}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <EventPanel
              teamA={teamA}
              teamB={teamB}
              onEventSent={handleEventSent}
            />
            <EventsList
              events={events.map((event) => ({
                id: event.id,
                type: event.eventType,
                team: event.teamId ? `${event.teamId}` : undefined,
                details: event.details || {},
                timestamp: event.timestamp_display,
              }))}
            />
          </div>

          <div>
            <CommentaryFeed commentaries={commentaries} />
          </div>
        </div>
      </div>
    </div>
  );
}
