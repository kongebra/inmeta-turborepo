import { SpondEvent } from ".";

export function getAcceptedFromSpondEvent(event: SpondEvent) {
  const {
    recipients: {
      group: { members },
    },
    responses: { acceptedIds },
  } = event;

  const membersMap = members.reduce(
    (acc, member) => {
      acc[member.id] = member;
      return acc;
    },
    {} as Record<string, (typeof members)[0]>
  );

  const result = acceptedIds
    .map((id) => {
      const member = membersMap[id];

      if (member) {
        return {
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          profileId: member.profile.id,
        };
      }

      return null;
    })
    .filter((m) => !!m);

  return result;
}
