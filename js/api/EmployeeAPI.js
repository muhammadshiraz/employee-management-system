export default class EmployeeAPI {
  constructor(baseUrl = "https://dummyjson.com") {
    this.baseUrl = baseUrl;
    this.localFallbackPath = "api-data/employees.json";
  }

  async fetchEmployees(limit = 200) {
    try {
      const remote = await this._fetchRemoteEmployees(limit);
      return remote;
    } catch (remoteError) {
      console.warn(
        "[EmployeeAPI] Remote API failed, falling back to local data:",
        remoteError
      );

      try {
        const local = await this._fetchLocalEmployees();
        return local;
      } catch (localError) {
        console.error("[EmployeeAPI] Local fallback also failed:", localError);
        throw new Error(
          "Unable to load employees from remote API or local fallback."
        );
      }
    }
  }

  /**
   * Fetch from remote open data API
   */
  async _fetchRemoteEmployees(limit) {
    const url = `${this.baseUrl}/users?limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch remote employees (status: ${response.status})`
      );
    }

    const data = await response.json();
    return data.users || [];
  }

  /**
   * Fetch from local JSON fallback: /api-data/employees.json
   */
  async _fetchLocalEmployees() {
    const response = await fetch(this.localFallbackPath);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch local employees (status: ${response.status})`
      );
    }

    const data = await response.json();
    return data.users || [];
  }
}
