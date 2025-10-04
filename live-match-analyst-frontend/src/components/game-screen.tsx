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
  type Score,
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
  events,
  setEvents,
  commentaries,
  setCommentaries,
  score,
  setScore,
}: {
  teamA: Team;
  teamB: Team;
  onEndGame: () => void;
  onShowRules: () => void;
  events: GameEventWithId[];
  setEvents: (
    v: GameEventWithId[] | ((prev: GameEventWithId[]) => GameEventWithId[])
  ) => void;
  commentaries: Commentary[];
  setCommentaries: (
    v: Commentary[] | ((prev: Commentary[]) => Commentary[])
  ) => void;
  score: Score;
  setScore: (s: Score | ((prev: Score) => Score)) => void;
}) {
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

      if (result.success && result.data) {
        // Update score
        if (result.data.score) {
          setScore(result.data.score);
        }

        // Convert backend commentary to frontend format
        if (result.data.commentary && result.data.commentary.length > 0) {
          const frontendCommentary: Commentary[] = result.data.commentary.map(
            (comment) => ({
              ...comment,
              id: Math.random().toString(36).substr(2, 9),
              timestamp: new Date().toISOString(),
            })
          );

          setCommentaries((prev) => [...frontendCommentary, ...prev]);
        }
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
          <div className="grid grid-cols-3 items-center">
            <div className="flex justify-start">
              <Button
                variant="ghost"
                onClick={handleEndGame}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Završi utakmicu
              </Button>
            </div>
            <div className="flex justify-center">
              <h1 className="text-2xl font-bold tracking-tight">
                ZAPISNIČKI STO
              </h1>
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={onShowRules}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Šabloni pravila
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 items-center gap-2 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-2xl font-bold">{teamA.name}</p>
              <div className="mt-2 text-4xl font-bold text-primary">
                {score.team1Score}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">VS</div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{teamB.name}</p>
              <div className="mt-2 text-4xl font-bold text-primary">
                {score.team2Score}
              </div>
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
