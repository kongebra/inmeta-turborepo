import { Person } from "@/lib/sanity/types";
import Image from "next/image";
import React from "react";
import { urlForImage } from "@/lib/sanity";
import Heading, { HeadingProps } from "@/components/heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  player: Person;

  size?: HeadingProps["size"];
};

const PlayerItem: React.FC<Props> = ({ player, size = "h3" }) => {
  const fullName = `${player.firstName} ${player.lastName}`;
  const initials = `${player.firstName.charAt(0)}${player.lastName.charAt(0)}`;
  const imageSrc = urlForImage(player.image);

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
