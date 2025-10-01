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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { Team } from "@/page";
import {
  registerAssistStreakTemplate,
  registerScoringStreakTemplate,
  type AssistStreakByIdTemplateDto,
  type ScoringStreakTemplateDto,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type RuleTemplatePanelProps = {
  teamA: Team;
  teamB: Team;
};

const TEMPLATE_TYPES = [
  { value: "assist-streak", label: "Assist Streak by Player" },
  { value: "scoring-streak", label: "Scoring Streak" },
];

const IMPORTANCE_LEVELS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

export function RuleTemplatePanel({ teamA, teamB }: RuleTemplatePanelProps) {
  const [templateType, setTemplateType] = useState<string>("");
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [streakCount, setStreakCount] = useState<string>("");
  const [timeWindow, setTimeWindow] = useState<string>("5");
  const [commentText, setCommentText] = useState<string>("");
  const [importance, setImportance] = useState<string>("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const allPlayers = [...teamA.players, ...teamB.players];

  const canSubmit = () => {
    return (
      templateType &&
      selectedPlayer &&
      streakCount &&
      timeWindow &&
      commentText &&
      importance
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;

    setIsSubmitting(true);
    try {
      const playerId = parseInt(selectedPlayer);
      const count = parseInt(streakCount);
      const timeWindowMinutes = parseInt(timeWindow);

      let result;

      if (templateType === "assist-streak") {
        const templateData: AssistStreakByIdTemplateDto = {
          playerId,
          assistCount: count,
          timeWindowMinutes,
          commentText,
          importance: importance as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        };
        result = await registerAssistStreakTemplate(templateData);
      } else if (templateType === "scoring-streak") {
        const templateData: ScoringStreakTemplateDto = {
          playerId,
          shotCount: count,
          timeWindowMinutes,
          commentText,
          importance: importance as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        };
        result = await registerScoringStreakTemplate(templateData);
      }

      if (result?.success) {
        toast({
          title: "Rule Template Added",
          description: result.result || "Template successfully registered.",
        });
        // Reset form
        setTemplateType("");
        setSelectedPlayer("");
        setStreakCount("");
        setTimeWindow("5");
        setCommentText("");
        setImportance("MEDIUM");
      } else {
        toast({
          title: "Error Adding Template",
          description: result?.error || "Failed to register template.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStreakLabel = () => {
    switch (templateType) {
      case "assist-streak":
        return "Minimum Assists";
      case "scoring-streak":
        return "Minimum Shots";
      default:
        return "Streak Count";
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Rule Templates</CardTitle>
        <CardDescription>
          Create custom rule templates for game analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Type */}
        <div className="space-y-2">
          <Label htmlFor="template-type">Template Type</Label>
          <Select value={templateType} onValueChange={setTemplateType}>
            <SelectTrigger id="template-type" className="bg-secondary">
              <SelectValue placeholder="Select template type" />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Player Selection */}
        {templateType && (
          <div className="space-y-2">
            <Label htmlFor="player">Player</Label>
            <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
              <SelectTrigger id="player" className="bg-secondary">
                <SelectValue placeholder="Select player" />
              </SelectTrigger>
              <SelectContent>
                {allPlayers.map((player) => {
                  const team = teamA.players.includes(player) ? teamA : teamB;
                  return (
                    <SelectItem key={player.id} value={player.id.toString()}>
                      {player.name} - {team.name} (#{player.number || player.id}
                      )
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Streak Count */}
        {templateType && (
          <div className="space-y-2">
            <Label htmlFor="streak-count">{getStreakLabel()}</Label>
            <Input
              id="streak-count"
              type="number"
              min="1"
              value={streakCount}
              onChange={(e) => setStreakCount(e.target.value)}
              placeholder="Enter minimum count"
              className="bg-secondary"
            />
          </div>
        )}

        {/* Time Window */}
        {templateType && (
          <div className="space-y-2">
            <Label htmlFor="time-window">Time Window (minutes)</Label>
            <Input
              id="time-window"
              type="number"
              min="1"
              max="60"
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value)}
              placeholder="Time window in minutes"
              className="bg-secondary"
            />
          </div>
        )}

        {/* Comment Text */}
        {templateType && (
          <div className="space-y-2">
            <Label htmlFor="comment-text">Comment Text</Label>
            <Input
              id="comment-text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Enter commentary text"
              className="bg-secondary"
            />
          </div>
        )}

        {/* Importance */}
        {templateType && (
          <div className="space-y-2">
            <Label htmlFor="importance">Importance Level</Label>
            <Select value={importance} onValueChange={setImportance}>
              <SelectTrigger id="importance" className="bg-secondary">
                <SelectValue placeholder="Select importance level" />
              </SelectTrigger>
              <SelectContent>
                {IMPORTANCE_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit() || isSubmitting}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          {isSubmitting ? "Adding Template..." : "Add Rule Template"}
        </Button>
      </CardContent>
    </Card>
  );
}
