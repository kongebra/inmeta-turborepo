import { NextResponse } from "next/server";
import { Spond } from "@inmeta/spond";

export async function GET(req: Request) {
  const email = process.env.SPOND_EMAIL;
  const password = process.env.SPOND_PASSWORD;
  const groupId = process.env.SPOND_GROUP_ID;
  const seriesId = process.env.SPOND_SERIES_ID;

  if (!email || !password || !groupId || !seriesId) {
    return NextResponse.error();
  }

  const spond = new Spond(email, password);

  const events = await spond.getEvents({
    groupId: groupId,
    seriesId: seriesId,
    min_end: new Date(),
    includeComments: true,
    includeHidden: false,
    scheduled: true,
    max_events: 1,
  });

  if (events.length === 0) {
    return NextResponse.json(
      { message: "not found" },
      { status: 404, statusText: "Not Found" }
    );
  }

  return NextResponse.json(events[0]);
}
