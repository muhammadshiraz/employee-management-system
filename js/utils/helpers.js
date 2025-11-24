export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  triggerDownload(blob, filename);
}

export function downloadCSV(filename, data) {
  if (!data || !data.length) {
    alert("No data to export.");
    return;
  }

  const keys = Object.keys(data[0]);
  const escape = (value) => {
    if (value == null) return "";
    const stringValue = String(value).replace(/"/g, '""');
    return `"${stringValue}"`;
  };

  const header = keys.map(escape).join(",");
  const rows = data.map((row) => keys.map((key) => escape(row[key])).join(","));
  const csv = [header, ...rows].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });
  triggerDownload(blob, filename);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function createElement(tag, classNames = [], attributes = {}) {
  const el = document.createElement(tag);
  if (typeof classNames === "string") {
    el.className = classNames;
  } else if (Array.isArray(classNames)) {
    el.classList.add(...classNames.filter(Boolean));
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "text") {
      el.textContent = value;
    } else {
      el.setAttribute(key, value);
    }
  });
  return el;
}
