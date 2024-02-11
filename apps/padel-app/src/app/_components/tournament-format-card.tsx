"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@inmeta/ui/card";
import { Label } from "@inmeta/ui/label";
import { RadioGroup, RadioGroupItem } from "@inmeta/ui/radio-group";
import { TournamentFormat, useTournamentStore } from "../store/tournament";

const avaiableValues: TournamentFormat[] = ["individual", "team"];

export default function TournamentFormatCard() {
  const value = useTournamentStore((state) => state.format);
  const setValue = useTournamentStore((state) => state.setFormat);

  function printName(type: TournamentFormat) {
    if (type === "individual") {
      return "Individual";
    }

    return "Team";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Format</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup defaultValue={value} onValueChange={setValue}>
          {avaiableValues.map((item) => (
            <div key={`format_${item}`} className="flex items-center space-x-2">
              <RadioGroupItem id={`format_${item}`} value={item} />
              <Label htmlFor={`format_${item}`}>{printName(item)}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
