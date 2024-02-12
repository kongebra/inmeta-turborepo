"use client";

import { Button } from "@inmeta/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@inmeta/ui/card";
import { Input } from "@inmeta/ui/input";
import { useState } from "react";
import { useTournamentStore } from "../store/tournament";
import { cn } from "@inmeta/ui/lib/utils";
import FetchSpondParticipants from "./fetch-spond-participants";

export default function TournamentParticipantsCard() {
  const format = useTournamentStore((state) => state.format);
  const participants = useTournamentStore((state) => state.participants);
  const addParticipant = useTournamentStore((state) => state.addParticipant);
  const removeParticipant = useTournamentStore(
    (state) => state.removeParticipant
  );

  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleAddParticipant = () => {
    const nameUsed = participants.some((item) => item.name === value);
    if (nameUsed) {
      setError("Court name already used");
      return;
    }

    addParticipant(value);
    setValue("");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>{format === "individual" ? "Players" : "Teams"}</CardTitle>
        {format === "individual" ? <FetchSpondParticipants /> : null}
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Input
              placeholder={format === "individual" ? "Add player" : "Add team"}
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
                  handleAddParticipant();
                }
              }}
            />

            <Button
              disabled={!value || !!error}
              onClick={() => {
                handleAddParticipant();
              }}
            >
              Add
            </Button>
          </div>
          <p className={cn("text-sm font-medium text-destructive")}>{error}</p>
        </div>

        <div className="grid">
          {participants.map((participant, index) => (
            <div
              key={participant.id}
              className="flex items-center justify-between border-b last:border-b-0 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono">{index + 1}.</span>
                <span>{participant.name}</span>
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeParticipant(participant.id)}
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
