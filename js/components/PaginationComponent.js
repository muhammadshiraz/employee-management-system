import { createElement } from "../utils/helpers.js";

export default class PaginationComponent {
  constructor(rootEl, { onPageChange, onPageSizeChange }) {
    this.rootEl = rootEl;
    this.onPageChange = onPageChange;
    this.onPageSizeChange = onPageSizeChange;

    this.currentPage = 1;
    this.pageSize = 25;
    this.totalItems = 0;

    this._render();
  }

  _render() {
    this.rootEl.innerHTML = "";
    const container = createElement("div");

    const pagination = createElement("div", "pagination");

    const prev = createElement("button", null, { type: "button" });
    prev.textContent = "‹";
    const next = createElement("button", null, { type: "button" });
    next.textContent = "›";

    const info = createElement("span", "pagination__info");
    const select = createElement("select", "pagination__page-size");
    [10, 25, 50, 100].forEach((size) => {
      const opt = createElement("option", null, { value: String(size) });
      opt.textContent = `${size} / page`;
      if (size === this.pageSize) opt.selected = true;
      select.appendChild(opt);
    });

    pagination.append(prev, info, select, next);
    container.appendChild(pagination);
    this.rootEl.appendChild(container);

    this.prevBtn = prev;
    this.nextBtn = next;
    this.infoEl = info;
    this.pageSizeSelect = select;

    prev.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.setPage(this.currentPage - 1);
      }
    });

    next.addEventListener("click", () => {
      const totalPages = this._getTotalPages();
      if (this.currentPage < totalPages) {
        this.setPage(this.currentPage + 1);
      }
    });

    select.addEventListener("change", () => {
      const newSize = Number(select.value);
      this.pageSize = newSize;
      if (this.onPageSizeChange) this.onPageSizeChange(newSize);
    });

    this._updateUI();
  }

  _getTotalPages() {
    if (this.pageSize <= 0) return 1;
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  _updateUI() {
    const totalPages = this._getTotalPages();
    this.currentPage = Math.min(this.currentPage, totalPages);
    const from =
      this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
    const to = Math.min(this.totalItems, this.currentPage * this.pageSize);

    this.infoEl.textContent = `${from}–${to} of ${this.totalItems}`;

    this.prevBtn.disabled = this.currentPage <= 1;
    this.nextBtn.disabled = this.currentPage >= totalPages;
  }

  setPage(page) {
    this.currentPage = page;
    this._updateUI();
    if (this.onPageChange) this.onPageChange(page);
  }

  setTotalItems(totalItems) {
    this.totalItems = totalItems;
    this._updateUI();
  }

  setPageSize(pageSize) {
    this.pageSize = pageSize;
    this._updateUI();
  }

  getPageSize() {
    return this.pageSize;
  }

  getCurrentPage() {
    return this.currentPage;
  }
}
