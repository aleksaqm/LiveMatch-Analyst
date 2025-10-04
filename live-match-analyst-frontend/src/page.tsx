"use client";

import { useState } from "react";
import { TeamSetupForm } from "@/components/team-setup-form";
import { GameScreen } from "@/components/game-screen";
import { RuleTemplatesView } from "@/components/rule-templates-view";
import {
  startGame,
  type StartGameDto,
  type Player as BackendPlayer,
  type Team as BackendTeam,
  type Score,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Updated types to match backend
export type Player = {
  id: number;
  name: string;
  teamId: number;
  number?: string; // Keep for UI compatibility
};

export type Team = {
  id: number;
  name: string;
  players: Player[];
};

export type GameState = {
  teamA: Team;
  teamB: Team;
  isGameStarted: boolean;
  gameInitialized: boolean;
  currentView: "game" | "rules";
};

export default function Home() {
  const { toast } = useToast();

  const [gameState, setGameState] = useState<GameState>({
    teamA: { id: 1, name: "", players: [] },
    teamB: { id: 2, name: "", players: [] },
    isGameStarted: false,
    gameInitialized: false,
    currentView: "game",
  });

  // Lifted state to persist across views
  const [events, setEvents] = useState<any[]>([]);
  const [commentaries, setCommentaries] = useState<any[]>([]);
  const [score, setScore] = useState<Score>({
    team1Id: gameState.teamA.id,
    team2Id: gameState.teamB.id,
    team1Score: 0,
    team2Score: 0,
  });

  const handleStartGame = async (teamA: Team, teamB: Team) => {
    // Convert frontend teams/players to backend format
    const backendPlayers: BackendPlayer[] = [];
    const backendTeams: BackendTeam[] = [
      { id: teamA.id, name: teamA.name },
      { id: teamB.id, name: teamB.name },
    ];

    // Add players with proper teamId
    teamA.players.forEach((player) => {
      backendPlayers.push({
        id: player.id,
        name: player.name,
        teamId: teamA.id,
      });
    });

    teamB.players.forEach((player) => {
      backendPlayers.push({
        id: player.id,
        name: player.name,
        teamId: teamB.id,
      });
    });

    const gameData: StartGameDto = {
      players: backendPlayers,
      teams: backendTeams,
    };

    const result = await startGame(gameData);
    if (result.success) {
      toast({
        title: "Igra je počela",
        description: "Uspešno povezano sa serverom.",
      });

      setGameState({
        teamA,
        teamB,
        isGameStarted: true,
        gameInitialized: true,
        currentView: "game",
      });
    } else {
      toast({
        title: "Greška pri pokretanju igre",
        description: result.error || "Pokušajte ponovo.",
        variant: "destructive",
      });
    }
  };

  const handleEndGame = () => {
    setGameState({
      teamA: { id: 1, name: "", players: [] },
      teamB: { id: 2, name: "", players: [] },
      isGameStarted: false,
      gameInitialized: false,
      currentView: "game",
    });
    // clear lifted state
    setEvents([]);
    setCommentaries([]);
    setScore({ team1Id: 1, team2Id: 2, team1Score: 0, team2Score: 0 });
  };

  const handleShowRules = () => {
    setGameState((prev) => ({
      ...prev,
      currentView: "rules",
    }));
  };

  const handleBackToGame = () => {
    setGameState((prev) => ({
      ...prev,
      currentView: "game",
    }));
  };

  if (!gameState.isGameStarted) {
    return <TeamSetupForm onStartGame={handleStartGame} />;
  }

  if (gameState.currentView === "rules") {
    return (
      <RuleTemplatesView
        teamA={gameState.teamA}
        teamB={gameState.teamB}
        onBack={handleBackToGame}
      />
    );
  }

  return (
    <GameScreen
      teamA={gameState.teamA}
      teamB={gameState.teamB}
      onEndGame={handleEndGame}
      onShowRules={handleShowRules}
      events={events}
      setEvents={setEvents}
      commentaries={commentaries}
      setCommentaries={setCommentaries}
      score={score}
      setScore={setScore}
    />
  );
}
