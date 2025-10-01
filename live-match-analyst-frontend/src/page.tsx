"use client";

import { useState } from "react";
import { TeamSetupForm } from "@/components/team-setup-form";
import { GameScreen } from "@/components/game-screen";

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
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    teamA: { id: 1, name: "", players: [] },
    teamB: { id: 2, name: "", players: [] },
    isGameStarted: false,
  });

  const handleStartGame = (teamA: Team, teamB: Team) => {
    setGameState({
      teamA,
      teamB,
      isGameStarted: true,
    });
  };

  const handleEndGame = () => {
    setGameState({
      teamA: { id: 1, name: "", players: [] },
      teamB: { id: 2, name: "", players: [] },
      isGameStarted: false,
    });
  };

  if (!gameState.isGameStarted) {
    return <TeamSetupForm onStartGame={handleStartGame} />;
  }

  return (
    <GameScreen
      teamA={gameState.teamA}
      teamB={gameState.teamB}
      onEndGame={handleEndGame}
    />
  );
}
