import {
  SpondChatResponse,
  SpondEvent,
  SpondGroup,
  SpondGroupsResponse,
  SpondLoginResponse,
  SpondProfile,
  SpondProfileDetails,
  SpondUpcomingEvent,
} from "./types";

export class Spond {
  private username: string;
  private password: string;

  private readonly api_url: string = "https://api.spond.com/core/v1/";

  private token: string = "";
  private chat_url: string = "";
  private auth: string = "";

  private groups: string[] = [];
  private events: string[] = [];

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  /**
   * Logs in to Spond and gets the token and chat auth
   */
  public async login(): Promise<void> {
    try {
      await this.getToken();
      await this.getChatAuth();
    } catch (error) {
      console.error("Login failure:", error);
      throw new Error("Could not login to Spond");
    }
  }

  /**
   *
   * @returns The groups the user is a member of
   */
  public async getGroups(): Promise<SpondGroup[]> {
    if (!this.token) {
      await this.login();
    }

    const url = this.api_url + "groups";
    const result = await this.GET<SpondGroup[]>(url);

    return result;
  }

  /**
   *
   * @returns The profile details of the user
   */
  public async getProfile(): Promise<SpondProfileDetails> {
    if (!this.token) {
      await this.login();
    }

    const url = this.api_url + "profile";
    const result = await this.GET<SpondProfileDetails>(url);

    return result;
  }

  /**
   *
   * @param id The id of the group
   * @returns The group with the given id, or null if not found
   */
  public async getGroup(id: string): Promise<SpondGroup | null> {
    const groups = await this.getGroups();
    const group = groups?.find((g) => g.id === id);

    return group || null;
  }

  /**
   *
   * @param args The arguments to filter the events by
   * @returns The events that match the given criteria
   */
  public async getEvents(
    args: {
      groupId?: string;
      seriesId?: string;
      scheduled?: boolean;
      includeComments?: boolean;
      includeHidden?: boolean;
      max_end?: Date;
      min_end?: Date;
      max_start?: Date;
      min_start?: Date;
      max_events?: number;
      order?: "asc" | "desc";
    } = {}
  ): Promise<SpondEvent[]> {
    if (!this.token) {
      await this.login();
    }

    const url = new URL("sponds", this.api_url);
    url.searchParams.set(
      "scheduled",
      args.scheduled === true ? "true" : "false"
    );
    url.searchParams.set("max", (args.max_events || 15).toString());

    if (args.includeComments !== undefined) {
      url.searchParams.set(
        "includeComments",
        args.includeComments === true ? "true" : "false"
      );
    }

    if (args.includeHidden !== undefined) {
      url.searchParams.set(
        "includeHidden",
        args.includeHidden === true ? "true" : "false"
      );
    }

    if (!!args.max_end) {
      url.searchParams.set(
        "maxEndTimestamp",
        new Date(args.max_end).toISOString()
      );
    }

    if (!!args.min_end) {
      url.searchParams.set(
        "minEndTimestamp",
        new Date(args.min_end).toISOString()
      );
    }

    if (!!args.max_start) {
      url.searchParams.set(
        "maxStartTimestamp",
        new Date(args.max_start).toISOString()
      );
    }

    if (!!args.min_start) {
      url.searchParams.set(
        "minStartTimestamp",
        new Date(args.min_start).toISOString()
      );
    }

    if (!!args.groupId) {
      url.searchParams.set("groupId", args.groupId);
    }

    if (!!args.seriesId) {
      url.searchParams.set("seriesId", args.seriesId);
    }

    url.searchParams.set("order", args.order ?? "asc");

    console.log(url.toString());

    const events = await this.GET<SpondEvent[]>(url.toString());

    return events;
  }

  /**
   *
   * @param id The id of the event
   * @param args The arguments to filter the event by
   * @returns The event with the given id
   */
  public async getEvent(
    id: string,
    args: {
      includeComments?: boolean;
      includeHidden?: boolean;
      addProfileInfo?: boolean;
    } = {}
  ): Promise<SpondEvent> {
    if (!this.token) {
      await this.login();
    }

    const url = new URL(`sponds/${id}`, this.api_url);

    if (args.includeComments) {
      url.searchParams.set("includeComments", "true");
    }

    if (args.includeHidden) {
      url.searchParams.set("includeHidden", "true");
    }

    if (args.addProfileInfo) {
      url.searchParams.set("addProfileInfo", "true");
    }

    const result = await this.GET<SpondEvent>(url.toString());

    return result;
  }

  /**
   *
   * @returns The upcoming events
   */
  public async getUpcomingEvents(): Promise<SpondUpcomingEvent[]> {
    if (!this.token) {
      await this.login();
    }

    const url = new URL("sponds/upcoming", this.api_url);

    const events = await this.GET<SpondUpcomingEvent[]>(url.toString());

    return events;
  }

  private async getChatAuth(): Promise<void> {
    try {
      const url = this.api_url + "chat";

      const result = await this.POST<SpondChatResponse>(url);

      this.chat_url = result.url;
      this.auth = result.auth;
    } catch (error) {
      console.error("could not get chat auth");
      throw error;
    }
  }

  private async getToken(): Promise<void> {
    try {
      const url = this.api_url + "login";
      const data = {
        email: this.username,
        password: this.password,
      };

      const result = await this.POST<SpondLoginResponse>(url, data);

      this.token = result.loginToken;
    } catch (error) {
      console.error("could not get token");
      throw error;
    }
  }

  private async GET<T = any>(
    url: string,
    headersInit: HeadersInit = {}
  ): Promise<T> {
    const headers = this.makeHeaders(headersInit);

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `GET request to ${url} failed: ${response.status} - ${response.statusText}`
      );
    }

    return response.json() as Promise<T>;
  }

  private makeHeaders(headersInit: HeadersInit): HeadersInit {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...headersInit,
    });

    if (!!this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }

    if (!!this.auth) {
      headers.set("auth", this.auth);
    }

    return headers;
  }

  private async POST<T = any, P = {}>(
    url: string,
    data: P | undefined = undefined,
    headersInit: HeadersInit = {}
  ): Promise<T> {
    const headers = this.makeHeaders(headersInit);

    let body: string | undefined = undefined;
    if (!!data) {
      body = JSON.stringify(data);
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(
        `POST request to ${url} failed: ${response.status} - ${response.statusText}`
      );
    }

    return response.json() as Promise<T>;
  }
}
