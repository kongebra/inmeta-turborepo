"use client";

import { Button } from "@inmeta/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@inmeta/ui/card";
import { Input } from "@inmeta/ui/input";
import { useState } from "react";
import { useTournamentStore } from "../store/tournament";
import { cn } from "@inmeta/ui/lib/utils";

export default function TournamentCourtCard() {
  const courts = useTournamentStore((state) => state.courts);
  const addCourt = useTournamentStore((state) => state.addCourt);
  const removeCourt = useTournamentStore((state) => state.removeCourt);

  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleAddCourt = () => {
    const nameUsed = courts.some((court) => court.name === value);
    if (nameUsed) {
      setError("Court name already used");
      return;
    }

    addCourt(value);
    setValue("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Courts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Input
              placeholder="Add court"
              value={value}
              className={cn({
                "border-destructive": !!error,
              })}
              onChange={(e) => {
                setError("");
                setValue(e.currentTarget.value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter" && !!value) {
                  handleAddCourt();
                }
              }}
            />

            <Button
              disabled={!value || !!error}
              onClick={() => {
                handleAddCourt();
              }}
            >
              Add
            </Button>
          </div>
          <p className={cn("text-sm font-medium text-destructive")}>{error}</p>
        </div>

        <div className="grid">
          {courts.map((court, index) => (
            <div
              key={court.id}
              className="flex items-center justify-between border-b last:border-b-0 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono">{index + 1}.</span>
                <span>{court.name}</span>
              </div>
              <div>
                <span></span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeCourt(court.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
