import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { urlForImage } from "@/lib/sanity";
import { Person } from "@/lib/sanity/types";
import Image from "next/image";

type PodiumEntry = {
  rank: number;
  player: Person;
  score: number;
};

type Props = {
  readonly entries: PodiumEntry[];
  readonly variant?: "winners" | "losers";
};

export default function PodiumStage({ entries, variant = "winners" }: Props) {
  const isLosers = variant === "losers";
  const first = entries.find((e) => e.rank === 1);
  const second = entries.find((e) => e.rank === 2);
  const third = entries.find((e) => e.rank === 3);

  const renderPodiumColumn = (
    entry: PodiumEntry | undefined,
    height: string,
    bgColor: string,
    label: string
  ) => {
    if (!entry) return <div className="flex-1" />;

    const fullName = `${entry.player.firstName} ${entry.player.lastName}`;
    const initials = `${entry.player.firstName.charAt(0)}${entry.player.lastName.charAt(0)}`;
    const imageSrc = urlForImage(entry.player.image);

    return (
      <div className="flex flex-1 flex-col items-center gap-2">
        <div className="text-center">
          {entry.rank === 1 && <span className="text-4xl">{isLosers ? "💩" : "👑"}</span>}
          <Avatar className="h-16 w-16 mx-auto">
            <AvatarImage asChild src={imageSrc}>
              <Image
                src={imageSrc}
                alt={fullName}
                width={64}
                height={64}
              />
            </AvatarImage>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <p className="font-semibold mt-1">{fullName}</p>
          <p className="text-sm text-muted-foreground">{entry.score} poeng</p>
        </div>
        <div
          className={`w-full rounded-t-lg flex items-end justify-center pb-4 font-bold text-2xl text-white ${bgColor}`}
          style={{ height }}
        >
          {label}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-end justify-center gap-4 max-w-2xl mx-auto">
      {renderPodiumColumn(second, "120px", isLosers ? "bg-red-400" : "bg-slate-400", "2")}
      {renderPodiumColumn(first, "180px", isLosers ? "bg-red-600" : "bg-amber-500", "1")}
      {renderPodiumColumn(third, "90px", isLosers ? "bg-red-800" : "bg-amber-800", "3")}
    </div>
  );
}
