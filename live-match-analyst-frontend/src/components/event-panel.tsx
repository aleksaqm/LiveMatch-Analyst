"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";
import type { Team } from "@/page";
import type { GameEventWithId } from "@/components/game-screen";

type EventPanelProps = {
  teamA: Team;
  teamB: Team;
  onEventSent: (event: GameEventWithId) => void;
};

const EVENT_TYPES = [
  { value: "SHOT_MADE", label: "Pogođen šut" },
  { value: "SHOT_MISSED", label: "Promašen šut" },
  { value: "REBOUND", label: "Skok" },
  { value: "ASSIST", label: "Asistencija" },
  { value: "STEAL", label: "Ukradena lopta" },
  { value: "BLOCK", label: "Blokada" },
  { value: "TURNOVER", label: "Izgubljena lopta" },
  { value: "FOUL", label: "Faul" },
  { value: "TIMEOUT", label: "Tajm-aut" },
  { value: "SUBSTITUTION", label: "Izmena" },
  { value: "QUARTER_END", label: "Kraj četvrtine" },
];

const PLAYER_EVENTS = [
  "SHOT_MADE",
  "SHOT_MISSED",
  "REBOUND",
  "ASSIST",
  "STEAL",
  "BLOCK",
  "TURNOVER",
  "FOUL",
  "SUBSTITUTION",
];

const TEAM_EVENTS = ["TIMEOUT"];

const SHOT_EVENTS = ["SHOT_MADE", "SHOT_MISSED"];

export function EventPanel({ teamA, teamB, onEventSent }: EventPanelProps) {
  const [eventType, setEventType] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<"A" | "B" | "">("");
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [points, setPoints] = useState<string>("");
  const [shotType, setShotType] = useState<string>("");

  const requiresPlayer = eventType && PLAYER_EVENTS.includes(eventType);
  const requiresTeam = eventType && TEAM_EVENTS.includes(eventType);
  const requiresShot = eventType && SHOT_EVENTS.includes(eventType);

  const currentTeam =
    selectedTeam === "A" ? teamA : selectedTeam === "B" ? teamB : null;

  const canSendEvent = () => {
    if (!eventType) return false;
    if (requiresPlayer && (!selectedTeam || !selectedPlayer)) return false;
    if (requiresTeam && !selectedTeam) return false;
    if (requiresShot && (!points || !shotType)) return false;
    return true;
  };

  const handleSendEvent = () => {
    if (!canSendEvent()) return;

    const currentTime = Date.now();
    let playerId: number | undefined;
    let teamId: number | undefined;

    if (requiresPlayer && selectedTeam && selectedPlayer) {
      const team = selectedTeam === "A" ? teamA : teamB;
      const player = team.players.find(
        (p) => p.id.toString() === selectedPlayer
      );
      if (player) {
        playerId = player.id;
        teamId = team.id;
      }
    } else if (requiresTeam && selectedTeam) {
      const team = selectedTeam === "A" ? teamA : teamB;
      teamId = team.id;
      // No player needed for team events like TIMEOUT
    }

    let details: Record<string, unknown> | undefined;
    if (requiresShot) {
      details = {
        points: Number.parseInt(points),
        shotType,
      };
    }

    const event: GameEventWithId = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: currentTime,
      timestamp_display: new Date(currentTime).toLocaleTimeString(),
      playerId,
      teamId,
      eventType: eventType as
        | "SHOT_MADE"
        | "SHOT_MISSED"
        | "REBOUND"
        | "ASSIST"
        | "STEAL"
        | "BLOCK"
        | "TURNOVER"
        | "FOUL"
        | "TIMEOUT", // Cast to match backend enum
      details,
    };

    onEventSent(event);

    // Reset form
    setEventType("");
    setSelectedTeam("");
    setSelectedPlayer("");
    setPoints("");
    setShotType("");
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Panel za događaje</CardTitle>
        <CardDescription>Unesite događaje tokom utakmice</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Event Type */}
        <div className="space-y-2">
          <Label htmlFor="event-type">Tip događaja</Label>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger id="event-type" className="bg-secondary">
              <SelectValue placeholder="Izaberite tip događaja" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Team Selection */}
        {(requiresPlayer || requiresTeam) && (
          <div className="space-y-2">
            <Label htmlFor="team">Tim</Label>
            <Select
              value={selectedTeam}
              onValueChange={(value) => {
                setSelectedTeam(value as "A" | "B");
                setSelectedPlayer("");
              }}
            >
              <SelectTrigger id="team" className="bg-secondary">
                <SelectValue placeholder="Izaberite tim" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">{teamA.name}</SelectItem>
                <SelectItem value="B">{teamB.name}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Player Selection */}
        {requiresPlayer && selectedTeam && currentTeam && (
          <div className="space-y-2">
            <Label htmlFor="player">Igrač</Label>
            <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
              <SelectTrigger id="player" className="bg-secondary">
                <SelectValue placeholder="Izaberite igrača" />
              </SelectTrigger>
              <SelectContent>
                {currentTeam.players.map((player) => (
                  <SelectItem key={player.id} value={player.id.toString()}>
                    {player.name} (#{player.number || player.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Shot Details */}
        {requiresShot && (
          <>
            <div className="space-y-2">
              <Label htmlFor="points">Poeni</Label>
              <Select value={points} onValueChange={setPoints}>
                <SelectTrigger id="points" className="bg-secondary">
                  <SelectValue placeholder="Izaberite broj poena" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 poen (slobodno bacanje)</SelectItem>
                  <SelectItem value="2">2 poena</SelectItem>
                  <SelectItem value="3">3 poena</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shot-type">Tip šuta</Label>
              <Select value={shotType} onValueChange={setShotType}>
                <SelectTrigger id="shot-type" className="bg-secondary">
                  <SelectValue placeholder="Izaberite tip šuta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="layup">Polaganje</SelectItem>
                  <SelectItem value="dunk">Zakucavanje</SelectItem>
                  <SelectItem value="jump_shot">Skok šut</SelectItem>
                  <SelectItem value="hook_shot">Kuka</SelectItem>
                  <SelectItem value="free_throw">Slobodno bacanje</SelectItem>
                  <SelectItem value="three_pointer">Trojka</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Send Button */}
        <Button
          onClick={handleSendEvent}
          disabled={!canSendEvent()}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          <Send className="mr-2 h-4 w-4" />
          Pošalji događaj
        </Button>
      </CardContent>
    </Card>
  );
}
