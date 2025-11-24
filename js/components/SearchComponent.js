import { debounce, createElement } from "../utils/helpers.js";

export default class SearchComponent {
  constructor(rootEl, { onSearchChange, onDepartmentFilterChange, onClear }) {
    this.rootEl = rootEl;
    this.onSearchChange = onSearchChange;
    this.onDepartmentFilterChange = onDepartmentFilterChange;
    this.onClear = onClear;
    this.departments = [];
    this._render();
  }

  _render() {
    this.rootEl.innerHTML = "";

    const card = createElement("div", "search-card");
    const header = createElement("div", "search-card__header");

    const title = createElement("div", "search-card__title", {
      text: "Filters & Search",
    });
    const badge = createElement("span", "badge-pill", {
      text: "Live API · Instant Search",
    });

    header.append(title, badge);

    const body = createElement("div", "search-card__body");

    // Search input
    const searchWrapper = createElement("div", "search-input-wrapper");
    const icon = createElement("span", null, { text: "🔍" });
    const input = createElement("input", "search-input", {
      type: "text",
      placeholder: "Search by name, role, email…",
    });
    searchWrapper.append(icon, input);

    const chips = createElement("div", "chip-row");
    chips.append(
      createElement("span", "chip", { text: "Name" }),
      createElement("span", "chip", { text: "Role" }),
      createElement("span", "chip", { text: "Email" })
    );

    const searchColumn = createElement("div");
    searchColumn.append(searchWrapper, chips);

    // Department filter
    const filterGroup = createElement("div", "filter-group");
    const label = createElement("span", "filter-label", {
      text: "Department (multi-select)",
    });
    const select = createElement("select", "select-multi", {
      multiple: "multiple",
    });
    this.selectEl = select;

    const clearBtn = createElement("button", ["btn", "btn-outline"], {
      type: "button",
    });
    clearBtn.textContent = "Clear filters";

    filterGroup.append(label, select, clearBtn);

    body.append(searchColumn, filterGroup);

    card.append(header, body);
    this.rootEl.appendChild(card);

    // Events
    const debouncedSearch = debounce((e) => {
      if (this.onSearchChange) {
        this.onSearchChange(e.target.value || "");
      }
    }, 250);

    input.addEventListener("input", debouncedSearch);

    select.addEventListener("change", () => {
      if (!this.onDepartmentFilterChange) return;
      const selected = Array.from(select.selectedOptions).map(
        (opt) => opt.value
      );
      this.onDepartmentFilterChange(selected);
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      Array.from(select.options).forEach((opt) => (opt.selected = false));
      if (this.onClear) this.onClear();
    });

    this.inputEl = input;
  }

  setDepartments(departments) {
    this.departments = departments || [];
    if (!this.selectEl) return;

    this.selectEl.innerHTML = "";
    this.departments.forEach((dept) => {
      const option = createElement("option", null, { value: dept });
      option.textContent = dept;
      this.selectEl.appendChild(option);
    });
  }

  reset() {
    if (this.inputEl) this.inputEl.value = "";
    if (this.selectEl) {
      Array.from(this.selectEl.options).forEach(
        (opt) => (opt.selected = false)
      );
    }
  }
}
