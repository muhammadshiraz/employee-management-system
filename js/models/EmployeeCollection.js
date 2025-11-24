import Employee from "./Employee.js";

export default class EmployeeCollection {
  constructor(employees = []) {
    this.employees = employees;
  }

  setEmployees(apiPayload) {
    this.employees = apiPayload.map((item) => Employee.fromAPI(item));
  }

  getAll() {
    return this.employees;
  }

  getDepartments() {
    const set = new Set(
      this.employees.map((e) => e.department).filter(Boolean)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  filter({ searchTerm = "", departments = [] } = {}) {
    let result = [...this.employees];

    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((e) => {
        return (
          e.name.toLowerCase().includes(term) ||
          e.role.toLowerCase().includes(term) ||
          e.department.toLowerCase().includes(term) ||
          (e.email || "").toLowerCase().includes(term)
        );
      });
    }

    if (departments && departments.length) {
      const set = new Set(departments);
      result = result.filter((e) => set.has(e.department));
    }

    return result;
  }
}
