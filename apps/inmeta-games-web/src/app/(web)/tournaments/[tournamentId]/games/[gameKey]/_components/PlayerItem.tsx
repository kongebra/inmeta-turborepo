import { Person } from "@/lib/sanity/types";
import Image from "next/image";
import React from "react";
import { urlForImage } from "@/lib/sanity";
import Heading, { HeadingProps } from "@/components/heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  player?: Person;

  skeleton?: boolean;
};

const PlayerItem: React.FC<Props> = ({ player, skeleton }) => {
  const fullName = `${player?.firstName} ${player?.lastName}`;
  const initials = `${player?.firstName.charAt(0)}${player?.lastName.charAt(
    0
  )}`;
  const imageSrc = player?.image ? urlForImage(player.image) : "";

  if (skeleton) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-6 w-48" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src={imageSrc} alt={fullName} className="grayscale" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <span className="text-lg lg:text-xl">{fullName}</span>
    </div>
  );
};

export default PlayerItem;
