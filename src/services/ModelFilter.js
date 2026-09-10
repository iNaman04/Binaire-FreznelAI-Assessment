export class ModelFilter {
  apply(models, filters) {
    const q = String(filters.query || "").trim().toLowerCase();
    const family = String(filters.family || "").toLowerCase();
    const pipeline = String(filters.pipeline || "").toLowerCase();
    const architecture = String(filters.architecture || "").toLowerCase();
    const weight = String(filters.weight || "").toLowerCase();
    const minSafe = Number(filters.minSafe || 0);
    const maxSafe = filters.maxSafe === "" ? Infinity : Number(filters.maxSafe);

    return models.filter(function (model) {
      const searchable = [
        model.name,
        model.family,
        model.pipeline,
        model.architecture,
        model.weight,
        ...(model.tags || [])
      ].join(" ").toLowerCase();

      const queryMatch = !q || searchable.includes(q);
      const familyMatch = !family || model.family.toLowerCase() === family;
      const pipelineMatch = !pipeline || model.pipeline.toLowerCase() === pipeline;
      const architectureMatch = !architecture || model.architecture.toLowerCase() === architecture;
      const weightMatch = !weight || model.weight.toLowerCase().includes(weight);
      const safeMatch = model.safetensorCount >= minSafe && model.safetensorCount <= maxSafe;

      return queryMatch && familyMatch && pipelineMatch &&
        architectureMatch && weightMatch && safeMatch;
    });
  }
}