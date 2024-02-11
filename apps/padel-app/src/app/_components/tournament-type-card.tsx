"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@inmeta/ui/card";
import { Label } from "@inmeta/ui/label";
import { RadioGroup, RadioGroupItem } from "@inmeta/ui/radio-group";
import { TournamentType, useTournamentStore } from "../store/tournament";

const avaiableValues: TournamentType[] = ["americano", "mexicano"];

export default function TournamentTypeCard() {
  const value = useTournamentStore((state) => state.type);
  const setValue = useTournamentStore((state) => state.setType);

  function printName(type: TournamentType) {
    if (type === "americano") {
      return "Americano";
    } else {
      return "Mexicano";
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tournament type</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup defaultValue={value} onValueChange={setValue}>
          {avaiableValues.map((item) => (
            <div key={`type_${item}`} className="flex items-center space-x-2">
              <RadioGroupItem id={`type_${item}`} value={item} />
              <Label htmlFor={`type_${item}`}>{printName(item)}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
