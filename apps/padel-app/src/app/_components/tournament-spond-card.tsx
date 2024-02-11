"use client";

import { SpondEvent } from "@inmeta/spond";
import { Button } from "@inmeta/ui/button";
import React from "react";
import useSWR from "swr";
import { useTournamentStore } from "../store/tournament";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Response = Pick<
  SpondEvent,
  "id" | "heading" | "startTimestamp" | "endTimestamp" | "location"
> & {
  participants: {
    id: string;
    profile: {
      id: string;
      unableToReach: boolean;
    };
    firstName: string;
    lastName: string;
    respondent: boolean;
    guardians: unknown[];
  }[];
};

type Props = {
  onAddParticipants: (participants: Response["participants"]) => void;
};

export default function TournamentSpondCard({ onAddParticipants }: Props) {
  const participants = useTournamentStore((state) => state.participants);
  const participantNames = new Set(participants.map((item) => item.name));

  const { data, error, isLoading } = useSWR<Response>(
    "/api/spond/participants",
    fetcher
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <div>
      <dl className="mb-8">
        <dt className="font-semibold">Event ID</dt>
        <dd>{data.id}</dd>

        <dt className="font-semibold">Heading</dt>
        <dd>{data.heading}</dd>

        <dt className="font-semibold">Start time</dt>
        <dd>{new Date(data.startTimestamp).toLocaleString()}</dd>

        <dt className="font-semibold">End time</dt>
        <dd>{new Date(data.endTimestamp).toLocaleString()}</dd>

        <dt className="font-semibold">Location</dt>
        <dd>
          {data.location.feature} ({data.location.address},{" "}
          {data.location.postalCode})
        </dd>

        <dt className="font-semibold">Participants</dt>
        <dd>
          <ul>
            {data.participants.map((participant) => (
              <li key={participant.id}>
                {participant.firstName} {participant.lastName}
                {participantNames.has(
                  `${participant.firstName} ${participant.lastName}`
                )
                  ? " (already added)"
                  : ""}
              </li>
            ))}
          </ul>
        </dd>
      </dl>

      <Button
        type="button"
        onClick={() => {
          onAddParticipants(data.participants);
        }}
      >
        Add these participants
      </Button>
    </div>
  );
}
