import { NextResponse } from "next/server";
import { Spond, getAcceptedFromSpondEvent } from "@inmeta/spond";

export async function GET(req: Request) {
  const spond = new Spond("<email>", "<password>");
  await spond.login();

  const inmetaGroupId = "D1B20C683F314907ABA283D8F3E067B4";
  const ukentligPadleSeriesId = "7CB7F12CBCD64A2EAB36D4520790CD9B";

  const events = await spond.getEvents({
    groupId: inmetaGroupId,
    seriesId: ukentligPadleSeriesId,
    min_end: new Date(),
    includeComments: true,
    includeHidden: false,
    scheduled: true,
    max_events: 5,
  });

  const data = events.map((event) => {
    const accepted = getAcceptedFromSpondEvent(event);

    return {
      id: event.id,
      name: event.heading,
      start: event.startTimestamp,
      end: event.endTimestamp,
      accepted,
    };
  });

  return NextResponse.json({ data });
}
