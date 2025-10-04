// Backend API communication utilities

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"

// Backend data models matching the Java backend
export type Player = {
  id: number
  name: string
  teamId: number
}

export type Team = {
  id: number
  name: string
}

export type GameEvent = {
  timestamp?: number
  playerId?: number
  teamId?: number
  eventType: "SHOT_MADE" | "SHOT_MISSED" | "REBOUND" | "ASSIST" | "STEAL" | "BLOCK" | "TURNOVER" | "FOUL" | "TIMEOUT" | "PASS"
  details?: Record<string, unknown>
  processed?: boolean
}

export type StartGameDto = {
  players: Player[]
  teams: Team[]
}

export type CommentaryLine = {
  text: string
  importance: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  type: "PLAY_BY_PLAY" | "ANALYSIS" | "STATISTIC" | "HIGHLIGHT"
}

export type Score = {
  team1Id: number
  team2Id: number
  team1Score: number
  team2Score: number
}

export type GameEventResponse = {
  commentary: CommentaryLine[]
  score: Score
}

export type AssistStreakByIdTemplateDto = {
  playerId: number
  assistCount: number
  timeWindowMinutes: number
  commentText: string
  importance: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}

export type ScoringStreakTemplateDto = {
  playerId: number
  shotCount: number
  timeWindowMinutes: number
  commentText: string
  importance: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}

/**
 * Start a new game with teams and players
 */
export async function startGame(gameData: StartGameDto): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rules/startgame`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error starting game:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Send a game event to the backend via HTTP POST
 */
export async function sendGameEvent(event: GameEvent): Promise<{ success: boolean; data?: GameEventResponse; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rules/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json() as GameEventResponse
    return { success: true, data }
  } catch (error) {
    console.error("Error sending game event:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * End the current game
 */
export async function endGame(): Promise<{ success: boolean; result?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rules/endgame`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.text()
    return { success: true, result }
  } catch (error) {
    console.error("Error ending game:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Register an assist streak template rule
 */
export async function registerAssistStreakTemplate(templateData: AssistStreakByIdTemplateDto): Promise<{ success: boolean; result?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rules/templates/register/assist-streak-by-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(templateData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.text()
    return { success: true, result }
  } catch (error) {
    console.error("Error registering assist streak template:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Register a scoring streak template rule
 */
export async function registerScoringStreakTemplate(templateData: ScoringStreakTemplateDto): Promise<{ success: boolean; result?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rules/templates/register/scoring-streak`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(templateData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.text()
    return { success: true, result }
  } catch (error) {
    console.error("Error registering scoring streak template:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Note: The backend uses HTTP-based communication, not WebSocket
// Commentary is returned directly from the event processing endpoint
// This class is kept for backward compatibility but may not be needed
