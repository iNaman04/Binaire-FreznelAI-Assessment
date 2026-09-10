export class ModelSorter {
  sort(models, key, direction) {
    const sign = direction === "desc" ? -1 : 1;
    return [...models].sort(function (a, b) {
      if (key === "safetensorCount") return (a.safetensorCount - b.safetensorCount) * sign;
      return String(a[key] || "").localeCompare(String(b[key] || "")) * sign;
    });
  }
}