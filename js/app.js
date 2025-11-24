import EmployeeAPI from "./api/EmployeeAPI.js";
import DataService from "./services/DataService.js";
import TableComponent from "./components/TableComponent.js";
import SearchComponent from "./components/SearchComponent.js";
import PaginationComponent from "./components/PaginationComponent.js";
import { downloadCSV, downloadJSON } from "./utils/helpers.js";

class App {
  constructor() {
    this.api = new EmployeeAPI();
    this.dataService = new DataService(this.api);

    this.currentFilters = {
      searchTerm: "",
      departments: [],
    };

    this.filteredEmployees = [];
    this.allEmployees = [];

    this.tableComponent = null;
    this.searchComponent = null;
    this.paginationComponent = null;

    this.statsEl = document.getElementById("stats-summary");
    this.loaderEl = document.getElementById("table-loader");
    this.errorEl = document.getElementById("table-error");
  }

  async init() {
    this._initComponents();
    this._initExports();
    this._initRefresh();

    await this._loadAndRender();
  }

  _initComponents() {
    const tableRoot = document.getElementById("table-component");
    const searchRoot = document.getElementById("search-component");
    const paginationRoot = document.getElementById("pagination-component");

    this.tableComponent = new TableComponent(tableRoot, {
      rowHeight: 48,
      buffer: 6,
    });

    this.searchComponent = new SearchComponent(searchRoot, {
      onSearchChange: (term) => {
        this.currentFilters.searchTerm = term;
        this.paginationComponent.setPage(1);
        this._applyFiltersAndRender();
      },
      onDepartmentFilterChange: (departments) => {
        this.currentFilters.departments = departments;
        this.paginationComponent.setPage(1);
        this._applyFiltersAndRender();
      },
      onClear: () => {
        this.currentFilters = { searchTerm: "", departments: [] };
        this.paginationComponent.setPage(1);
        this._applyFiltersAndRender();
      },
    });

    this.paginationComponent = new PaginationComponent(paginationRoot, {
      onPageChange: () => this._renderPage(),
      onPageSizeChange: () => {
        this.paginationComponent.setPage(1);
        this._renderPage();
      },
    });
  }

  _initExports() {
    const csvBtn = document.querySelector('[data-export="csv"]');
    const jsonBtn = document.querySelector('[data-export="json"]');

    csvBtn.addEventListener("click", () => {
      const plain = this.filteredEmployees.map((e) => e.toPlainObject());
      downloadCSV("employees.csv", plain);
    });

    jsonBtn.addEventListener("click", () => {
      const plain = this.filteredEmployees.map((e) => e.toPlainObject());
      downloadJSON("employees.json", plain);
    });
  }

  _initRefresh() {
    const refreshBtn = document.getElementById("refresh-btn");
    refreshBtn.addEventListener("click", async () => {
      await this._loadAndRender(true);
    });
  }

  async _loadAndRender(force = false) {
    this._setLoading(true);
    this._setError(null);

    try {
      if (!this.dataService.isLoaded() || force) {
        this.allEmployees = await this.dataService.loadEmployees();
      } else {
        this.allEmployees = this.dataService.getAllEmployees();
      }

      const departments = this.dataService.getDepartments();
      this.searchComponent.setDepartments(departments);

      this.currentFilters = { searchTerm: "", departments: [] };
      this.searchComponent.reset();
      this.paginationComponent.setPageSize(25);
      this.paginationComponent.setPage(1);

      this._applyFiltersAndRender();
    } catch (err) {
      console.error(err);
      this._setError(
        "Unable to load employees from API. Please try again in a moment."
      );
    } finally {
      this._setLoading(false);
    }
  }

  _applyFiltersAndRender() {
    this.filteredEmployees = this.dataService.getFilteredEmployees(
      this.currentFilters
    );
    this.paginationComponent.setTotalItems(this.filteredEmployees.length);
    this._updateStats();
    this._renderPage();
  }

  _renderPage() {
    const pageSize = this.paginationComponent.getPageSize();
    const page = this.paginationComponent.getCurrentPage();
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageRows = this.filteredEmployees.slice(start, end);
    this.tableComponent.setData(pageRows);
  }

  _updateStats() {
    if (!this.statsEl) return;
    const total = this.allEmployees.length;
    const filtered = this.filteredEmployees.length;
    const activeDepts = this.currentFilters.departments.length;

    this.statsEl.className = "stats-summary";
    this.statsEl.innerHTML = `
      <span class="stats-pill">
        <strong>${filtered}</strong> shown
        ${filtered !== total ? ` of ${total} total` : ""}
      </span>
      <span class="stats-pill">
        Search: ${
          this.currentFilters.searchTerm
            ? `"${this.currentFilters.searchTerm}"`
            : "—"
        }
      </span>
      <span class="stats-pill">
        Departments: ${activeDepts ? `${activeDepts} selected` : "All"}
      </span>
    `;
  }

  _setLoading(isLoading) {
    if (!this.loaderEl) return;
    this.loaderEl.classList.toggle("hidden", !isLoading);
  }

  _setError(message) {
    if (!this.errorEl) return;
    if (!message) {
      this.errorEl.classList.add("hidden");
      this.errorEl.textContent = "";
    } else {
      this.errorEl.classList.remove("hidden");
      this.errorEl.textContent = message;
    }
  }
}

// Bootstrapping
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
