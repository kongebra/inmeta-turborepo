"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@inmeta/ui/dialog";
import TournamentSpondCard from "./tournament-spond-card";
import { useTournamentStore } from "../store/tournament";
import { useState } from "react";

export default function FetchSpondParticipants() {
  const participants = useTournamentStore((state) => state.participants);
  const participantNames = new Set(participants.map((item) => item.name));
  const addParticipant = useTournamentStore((state) => state.addParticipant);

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Spond</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Data from upcoming Spond event</DialogTitle>
        </DialogHeader>

        <div>
          <TournamentSpondCard
            onAddParticipants={(participants) => {
              const names = participants
                .map((item) => `${item.firstName} ${item.lastName}`)
                .filter((name) => !participantNames.has(name));

              names.forEach(addParticipant);
              setOpen(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
