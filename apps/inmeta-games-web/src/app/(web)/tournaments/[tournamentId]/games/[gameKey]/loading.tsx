import { Skeleton } from "@/components/ui/skeleton";
import PlayerItemsCard from "./_components/PlayerItemsCard";

export default function Loading() {
  return (
    <main>
      <div className="container py-8">
        <Skeleton className="h-5 w-52 mb-8" />

        <Skeleton className="h-10 w-72 mb-8" />

        <div className="grid grid-cols-12 gap-8 mb-8">
          <dl className="col-span-12 lg:col-span-4">
            <dt className="font-bold mb-4">{"Arrangør"}</dt>
            <dd className="flex items-center gap-4 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-48" />
            </dd>
            <dd className="flex items-center gap-4 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-48" />
            </dd>
          </dl>

          <dl className="col-span-12 lg:col-span-8">
            <dt className="font-bold mb-4">Beskrivelse</dt>
            <dd>
              <Skeleton className="h-6 w-full mb-1" />
              <Skeleton className="h-6 w-full mb-1" />
              <Skeleton className="h-6 w-full mb-1" />
            </dd>
          </dl>
        </div>

        <PlayerItemsCard
          title="Førsteplass"
          description="3 poeng for førsteplass"
          players={[]}
          className="border-amber-500 border-4"
          skeleton
        />

        <PlayerItemsCard
          title="Andreplass"
          description="2 poeng for andreplass"
          players={[]}
          className="border-slate-300 border-4"
          skeleton
        />

        <PlayerItemsCard
          title="Tredjeplass"
          description="1 poeng for tredjeplass"
          players={[]}
          className="border-amber-800 border-4"
          skeleton
        />

        <PlayerItemsCard
          title="Deltakere"
          description="3 poeng for deltakelse"
          players={[]}
          skeleton
        />

        <PlayerItemsCard
          title="Tilskuere"
          description="1 poeng for tilskuere"
          players={[]}
          skeleton
        />
      </div>
    </main>
  );
}
