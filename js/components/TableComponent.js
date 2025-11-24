import { createElement } from "../utils/helpers.js";

export default class TableComponent {
  constructor(rootEl, options = {}) {
    this.rootEl = rootEl;
    this.rowHeight = options.rowHeight || 48;
    this.buffer = options.buffer || 6;
    this.data = [];
    this.totalRows = 0;
    this.visibleCount = 15;

    this._buildStructure();
  }

  _buildStructure() {
    this.rootEl.innerHTML = "";

    const wrapper = createElement("div", "table-wrapper");

    // Header table (fixed)
    const headerTable = createElement("table", "employee-table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = [
      "Employee",
      "Role",
      "Department",
      "Email",
      "Phone",
      "Location",
      "Age",
    ];
    headers.forEach((h) => {
      const th = document.createElement("th");
      th.textContent = h;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    headerTable.appendChild(thead);

    const scrollArea = createElement("div", "table-virtual-scroll");
    const spacer = createElement("div", "table-spacer");
    const bodyTable = createElement("table", ["employee-table", "body-only"]);
    const tbody = document.createElement("tbody");
    bodyTable.appendChild(tbody);

    scrollArea.appendChild(spacer);
    scrollArea.appendChild(bodyTable);

    wrapper.appendChild(headerTable);
    wrapper.appendChild(scrollArea);

    this.rootEl.appendChild(wrapper);

    this.scrollArea = scrollArea;
    this.spacer = spacer;
    this.bodyTable = bodyTable;
    this.tbody = tbody;

    this._onScroll = this._onScroll.bind(this);
    this.scrollArea.addEventListener("scroll", this._onScroll);

    requestAnimationFrame(() => {
      const height = this.scrollArea.clientHeight || 360;
      this.visibleCount = Math.ceil(height / this.rowHeight) + this.buffer;
      this._renderVisible(0);
    });
  }

  setData(rows) {
    this.data = rows || [];
    this.totalRows = this.data.length;
    this.spacer.style.height = `${this.totalRows * this.rowHeight}px`;
    this.scrollArea.scrollTop = 0;
    this._renderVisible(0);
  }

  _onScroll() {
    const scrollTop = this.scrollArea.scrollTop;
    const startIndex = Math.floor(scrollTop / this.rowHeight);
    this._renderVisible(startIndex);
  }

  _renderVisible(startIndex) {
    const total = this.totalRows;
    if (!total) {
      this.tbody.innerHTML = "";
      return;
    }

    const from = Math.max(0, startIndex);
    const to = Math.min(total, from + this.visibleCount);

    const fragment = document.createDocumentFragment();
    for (let i = from; i < to; i++) {
      const emp = this.data[i];
      const tr = document.createElement("tr");
      tr.setAttribute("data-row-index", String(i));

      const tdEmp = document.createElement("td");
      tdEmp.classList.add("col-name");

      const avatar = createElement("div", "avatar-circle");
      if (emp.image) {
        const img = createElement("img");
        img.src = emp.image;
        img.alt = emp.name;
        avatar.appendChild(img);
      } else {
        avatar.textContent = this._getInitials(emp.name);
      }

      const wrapperText = document.createElement("div");
      const nameEl = createElement("div", "cell-primary");
      nameEl.textContent = emp.name;
      const emailSmall = createElement("div", "cell-muted");
      emailSmall.textContent = emp.email || "—";

      wrapperText.append(nameEl, emailSmall);
      tdEmp.append(avatar, wrapperText);

      // Column: Role
      const tdRole = document.createElement("td");
      const roleBadge = createElement("span", "cell-badge");
      roleBadge.textContent = emp.role;
      tdRole.appendChild(roleBadge);

      // Column: Department
      const tdDept = document.createElement("td");
      tdDept.textContent = emp.department || "—";

      // Column: Email
      const tdEmail = document.createElement("td");
      tdEmail.textContent = emp.email || "—";

      // Column: Phone
      const tdPhone = document.createElement("td");
      tdPhone.textContent = emp.phone || "—";

      // Column: Location
      const tdLoc = document.createElement("td");
      tdLoc.textContent = emp.location || "—";

      // Column: Age
      const tdAge = document.createElement("td");
      tdAge.textContent = emp.age != null ? String(emp.age) : "—";

      tr.append(tdEmp, tdRole, tdDept, tdEmail, tdPhone, tdLoc, tdAge);
      fragment.appendChild(tr);
    }

    this.tbody.innerHTML = "";
    this.tbody.appendChild(fragment);
    this.bodyTable.style.transform = `translateY(${from * this.rowHeight}px)`;
  }

  _getInitials(name = "") {
    const parts = name.trim().split(" ");
    if (!parts.length) return "?";
    const first = parts[0][0] || "";
    const second = (parts[1] && parts[1][0]) || "";
    return (first + second).toUpperCase();
  }
}
