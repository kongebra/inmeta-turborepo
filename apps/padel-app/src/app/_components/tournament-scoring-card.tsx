"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@inmeta/ui/card";
import { Label } from "@inmeta/ui/label";
import { RadioGroup, RadioGroupItem } from "@inmeta/ui/radio-group";
import { ScoringType, useTournamentStore } from "../store/tournament";

const avaiableValues: ScoringType[] = ["11", "16", "21", "24"];

export default function TournamentScoringCard() {
  const value = useTournamentStore((state) => state.scoring);
  const setValue = useTournamentStore((state) => state.setScoring);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scoring</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup defaultValue={value} onValueChange={setValue}>
          {avaiableValues.map((item) => (
            <div
              key={`scoring_${item}`}
              className="flex items-center space-x-2"
            >
              <RadioGroupItem id={`scoring_${item}`} value={item} />
              <Label htmlFor={`scoring_${item}`}>{item}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
