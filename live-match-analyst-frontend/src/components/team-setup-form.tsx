"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, Play, Loader2 } from "lucide-react";
import type { Team, Player } from "@/page";
import { startGame, type StartGameDto } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type TeamSetupFormProps = {
  onStartGame: (teamA: Team, teamB: Team) => void;
};

export function TeamSetupForm({ onStartGame }: TeamSetupFormProps) {
  const [teamA, setTeamA] = useState<Team>({
    id: 1,
    name: "",
    players: [],
  });
  const [teamB, setTeamB] = useState<Team>({
    id: 2,
    name: "",
    players: [],
  });

  const [nextPlayerId, setNextPlayerId] = useState(1);
  const [isStarting, setIsStarting] = useState(false);
  const { toast } = useToast();

  const addPlayer = (team: "A" | "B") => {
    const teamId = team === "A" ? 1 : 2;
    const newPlayer: Player = {
      id: nextPlayerId,
      name: "",
      number: "",
      teamId: teamId,
    };
    setNextPlayerId(nextPlayerId + 1);

    if (team === "A") {
      setTeamA({ ...teamA, players: [...teamA.players, newPlayer] });
    } else {
      setTeamB({ ...teamB, players: [...teamB.players, newPlayer] });
    }
  };

  const removePlayer = (team: "A" | "B", playerId: number) => {
    if (team === "A") {
      setTeamA({
        ...teamA,
        players: teamA.players.filter((p) => p.id !== playerId),
      });
    } else {
      setTeamB({
        ...teamB,
        players: teamB.players.filter((p) => p.id !== playerId),
      });
    }
  };

  const updatePlayer = (
    team: "A" | "B",
    playerId: number,
    field: "name" | "number",
    value: string
  ) => {
    const updateTeam = (t: Team) => ({
      ...t,
      players: t.players.map((p) =>
        p.id === playerId ? { ...p, [field]: value } : p
      ),
    });

    if (team === "A") {
      setTeamA(updateTeam(teamA));
    } else {
      setTeamB(updateTeam(teamB));
    }
  };

  const canStartGame = () => {
    return (
      teamA.name.trim() !== "" &&
      teamB.name.trim() !== "" &&
      teamA.players.length > 0 &&
      teamB.players.length > 0 &&
      teamA.players.every(
        (p) => p.name.trim() !== "" && (p.number?.trim() !== "" || true)
      ) &&
      teamB.players.every(
        (p) => p.name.trim() !== "" && (p.number?.trim() !== "" || true)
      )
    );
  };

  const handleStartGame = async () => {
    if (!canStartGame()) return;

    setIsStarting(true);

    try {
      // Prepare data for backend API
      const allPlayers = [...teamA.players, ...teamB.players];
      const allTeams = [teamA, teamB];

      const gameData: StartGameDto = {
        players: allPlayers.map((p) => ({
          id: p.id,
          name: p.name,
          teamId: p.teamId,
        })),
        teams: allTeams.map((t) => ({
          id: t.id,
          name: t.name,
        })),
      };

      const result = await startGame(gameData);

      if (result.success) {
        toast({
          title: "Game Started!",
          description: "The game has been successfully started on the backend.",
        });
        onStartGame(teamA, teamB);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to start game",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to start game. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-sans text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            ZAPISNIČKI STO
          </h1>
          <p className="text-lg text-muted-foreground">
            Košarkaška utakmica - Priprema timova
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Team A */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Tim A</CardTitle>
              <CardDescription>Unesite naziv tima i igrače</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamA-name">Naziv tima</Label>
                <Input
                  id="teamA-name"
                  placeholder="Unesite naziv tima A"
                  value={teamA.name}
                  onChange={(e) => setTeamA({ ...teamA, name: e.target.value })}
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Igrači</Label>
                  <Button
                    size="sm"
                    onClick={() => addPlayer("A")}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Dodaj igrača
                  </Button>
                </div>

                {teamA.players.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Nema dodanih igrača
                  </p>
                ) : (
                  <div className="space-y-2">
                    {teamA.players.map((player) => (
                      <div key={player.id} className="flex gap-2">
                        <Input
                          placeholder="Ime igrača"
                          value={player.name}
                          onChange={(e) =>
                            updatePlayer("A", player.id, "name", e.target.value)
                          }
                          className="flex-1 bg-secondary"
                        />
                        <Input
                          placeholder="Broj"
                          value={player.number}
                          onChange={(e) =>
                            updatePlayer(
                              "A",
                              player.id,
                              "number",
                              e.target.value
                            )
                          }
                          className="w-20 bg-secondary"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removePlayer("A", player.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team B */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Tim B</CardTitle>
              <CardDescription>Unesite naziv tima i igrače</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamB-name">Naziv tima</Label>
                <Input
                  id="teamB-name"
                  placeholder="Unesite naziv tima B"
                  value={teamB.name}
                  onChange={(e) => setTeamB({ ...teamB, name: e.target.value })}
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Igrači</Label>
                  <Button
                    size="sm"
                    onClick={() => addPlayer("B")}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Dodaj igrača
                  </Button>
                </div>

                {teamB.players.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Nema dodanih igrača
                  </p>
                ) : (
                  <div className="space-y-2">
                    {teamB.players.map((player) => (
                      <div key={player.id} className="flex gap-2">
                        <Input
                          placeholder="Ime igrača"
                          value={player.name}
                          onChange={(e) =>
                            updatePlayer("B", player.id, "name", e.target.value)
                          }
                          className="flex-1 bg-secondary"
                        />
                        <Input
                          placeholder="Broj"
                          value={player.number}
                          onChange={(e) =>
                            updatePlayer(
                              "B",
                              player.id,
                              "number",
                              e.target.value
                            )
                          }
                          className="w-20 bg-secondary"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removePlayer("B", player.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={handleStartGame}
            disabled={!canStartGame() || isStarting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
          >
            {isStarting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Play className="mr-2 h-5 w-5" />
            )}
            {isStarting ? "Starting..." : "Započni utakmicu"}
          </Button>
        </div>
      </div>
    </div>
  );
}
