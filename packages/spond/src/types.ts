export type SpondLoginResponse = {
  loginToken: string;
  passwordToken: string;
};

export type SpondChatResponse = {
  url: string;
  auth: string;
};

export type SpondGroup = {
  id: string;
  contactPerson: SpondContactPerson;
  name: string;
  welcomeMessage?: string;
  activity: string;
  imageUrl: string;
  createdTime: string;
  members: SpondGroupMember[];
  subGroups: SpondSubGroup[];
  shareContactInfo: boolean;
  adminsCanAddMembers: boolean;
  contactInfoHidden: boolean;
  memberPermissions: string[];
  guardianPermissions: string[];
  type: number;
  invitedToAppTime: string;
  signupUrl: string;
  countryCode: string;
  allowSmsNag: boolean;
  bonusEnabled: boolean;
  fieldDefs: unknown[];
  defaultFields: Record<
    string,
    { permission: string; locked: boolean; required: boolean }
  >;
  roles: SpondRole[];
  addressFormat: string[];
  allowPrivatePayoutAccounts: boolean;
};

export type SpondRole = {
  id: string;
  name: string;
  permissions: string[];
};

export type SpondSubGroup = {
  id: string;
  name: string;
  color: string;
};

export type SpondGroupMember = {
  id: string;
  profile: SpondProfile;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdTime: string;
  guardians: unknown[];
  subGroups: SpondSubGroup[];
  dateOfBirth?: string;
  verifiedDateOfBirth?: boolean;
  address?: string[];
  imageUrl?: string;
  roles?: string[];
  fields: {};
  respondent: boolean;
};

export type SpondProfile = {
  contactMethod: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  phoneNumber: string;
  unableToReach: boolean;
};

export type SpondProfileDetails = {
  id: string;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  imageUrl: string;
  phoneNumber: string;
  dummy: boolean;
  trackingId: string;
  timezone: string;
  unsubscribeCode: string;
  locale: string;
  countryCode: string;
  internal: boolean;
  deleted: boolean;
  unableToReach: boolean;
  preferences: unknown;
  dateOfBirth: string;
  tosVersion: number;
  contact: boolean;
  formattedPhoneNumber: string;
};

export type SpondContactPerson = {
  contactMethod: string;
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  unableToReach: boolean;
};

export type SpondGroupsResponse = SpondGroup[];

export type SpondEvent = {
  id: string;
  creatorId: string;
  owners: {
    id: string;
    response: string;
  }[];
  heading: string;
  startTimestamp: string;
  endTimestamp: string;
  location: {
    id: string;
    feature: string;
    address: string;
    latitude: number;
    longitude: number;
    postalCode: string;
    country: string;
    administrativeAreaLevel1: string;
    administrativeAreaLevel2: string;
  };
  recipients: {
    group: {
      id: string;
      contactPersonId: string;
      name: string;
      imageUrl: string;
      createdTime: number;
      members: {
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
      type: number;
      activity: string;
    };
    profiles: unknown[];
    guardians: unknown[];
  };
  responses: {
    acceptedIds: string[];
    declinedIds: string[];
    unansweredIds: string[];
    waitinglistIds: string[];
    unconfirmedIds: string[];
  };
  tasks: {
    openTasks: unknown[];
    assignedTasks: unknown[];
  };
  comments: unknown[];
  attachments: unknown[];
  createdTime: string;
  seriesId: string;
  seriesOrdinal: number;
  modifiedFromSeries: boolean;
  expired: boolean;
  visibility: string;
  rsvpDate: string;
  behalfOfIds: string[];
  autoAccept: boolean;
  hidden: boolean;
  autoReminderType: "DISABLED" | string;
  participantsHidden: boolean;
  registered: boolean;
  commentDisabled: boolean;
  type: "RECURRING" | string;
  updated: number;
  matchEvent: boolean;
};

export type SpondUpcomingEvent = {
  id: string;
  updated: number;
  startTime: string;
  heading: string;
  series: boolean;
  unanswered?: boolean;
};
