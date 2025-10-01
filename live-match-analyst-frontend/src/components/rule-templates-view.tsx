"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Team } from "@/page";
import { RuleTemplatePanel } from "@/components/rule-template-panel";

export function RuleTemplatesView({
  teamA,
  teamB,
  onBack,
}: {
  teamA: Team;
  teamB: Team;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Nazad na utakmicu
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              ŠABLONI PRAVILA
            </h1>
            <div className="w-32"></div> {/* Spacer for centering */}
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
        <div className="max-w-4xl mx-auto">
          <RuleTemplatePanel teamA={teamA} teamB={teamB} />
        </div>
      </div>
    </div>
  );
}
