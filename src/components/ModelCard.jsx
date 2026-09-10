import React from "react";

export default function ModelCard({ model }) {
  return (
    <article className="model-card">
      <div className="model-card-top">
        <div>
          <span className="eyebrow">{model.pipeline}</span>
          <h3>{model.name}</h3>
        </div>
        <span className="safe-count">{model.safetensorCount} safetensors</span>
      </div>

      <div className="chips">
        <span className="chip">{model.family}</span>
        <span className="chip">{model.architecture}</span>
        <span className="chip">{model.weight}</span>
      </div>

      <div className="model-stats">
        <span>↓ {model.downloads.toLocaleString()}</span>
        <span>♥ {model.likes.toLocaleString()}</span>
      </div>
    </article>
  );
}