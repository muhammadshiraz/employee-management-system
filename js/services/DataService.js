import EmployeeCollection from "../models/EmployeeCollection.js";

export default class DataService {
  constructor(api) {
    this.api = api;
    this.collection = new EmployeeCollection();
    this._loaded = false;
  }

  async loadEmployees() {
    const rawEmployees = await this.api.fetchEmployees();
    this.collection.setEmployees(rawEmployees);
    this._loaded = true;
    return this.collection.getAll();
  }

  isLoaded() {
    return this._loaded;
  }

  getAllEmployees() {
    return this.collection.getAll();
  }

  getDepartments() {
    return this.collection.getDepartments();
  }

  getFilteredEmployees(criteria) {
    return this.collection.filter(criteria);
  }
}
