import { Button } from "@/components/ui/button";
import { fetchTournamentDetails } from "@/lib/sanity/queries";
import { calculateScoreboard } from "@/lib/utils";
import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Inmeta Games - Resultater";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Params = {
  tournamentId: string;
};

// Image generation
export default async function Image({ params }: { params: Params }) {
  console.log("og:image", { params });
  const tournament = await fetchTournamentDetails(params.tournamentId);
  if (!tournament) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          not found
        </div>
      ),
      { status: 404 }
    );
  }

  const scoreboard = calculateScoreboard(tournament);
  const topThree = scoreboard.slice(0, 3);

  const leaders = topThree
    .map((score) => `${score.player.firstName} (${score.score} poeng)`)
    .join(", ");

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <div tw="bg-gray-50 flex py-8 justify-between">
          <div tw="flex flex-col w-full py-12 px-4 md:items-center justify-between p-8 gap-8">
            <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
              <span>{tournament.name}</span>
              <span tw="text-teal-500">Resultater</span>
            </h2>

            <span className="mb-8 text-lg">Topp 3: {leaders}</span>

            <div tw="mt-8 flex">
              <div tw="flex rounded-md shadow">
                <a
                  href="#"
                  tw="flex items-center justify-center rounded-md border border-transparent bg-teal-500 px-5 py-3 text-base font-medium text-white"
                >
                  Se mer
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
