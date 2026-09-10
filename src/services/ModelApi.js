export class ModelApi {
  constructor(baseUrl) {
    const defaultUrl = "https://huggingface.co/api/models";
    
    
    this.baseUrl = (typeof baseUrl === "string" && baseUrl.trim()) 
      ? baseUrl.trim() 
      : (import.meta.env.VITE_MODELS_API_URL || defaultUrl);

    this.apiKey = import.meta.env.VITE_API_KEY || "";
  }

 buildUrl(params = {}) {
  
  const fallbackUrl = "https://huggingface.co/api/models";
  let targetUrl = this.baseUrl && this.baseUrl.trim() ? this.baseUrl.trim() : fallbackUrl;

  let url;
  try {
    url = new URL(targetUrl);
  } catch (e) {
    
    url = new URL(targetUrl, window.location.origin);
  }

  Object.keys(params).forEach((key) => {
    const value = params[key];

    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

  request(params = {}) {
    const headers = {
      Accept: "application/json",
    };

    if (this.apiKey) {
      headers.Authorization = "Bearer " + this.apiKey;
    }

    return fetch(this.buildUrl(params), {
      method: "GET",
      headers,
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("API request failed: " + response.status);
        }

        return response.json();
      })
      .then((payload) => {
        const list = Array.isArray(payload)
          ? payload
          : payload.models ||
            payload.data ||
            payload.results ||
            [];

        return list.map(this.normalizeModel.bind(this));
      });
  }

  normalizeModel(raw) {
    const tags = Array.isArray(raw.tags) ? raw.tags : [];
    const siblings = Array.isArray(raw.siblings) ? raw.siblings : [];
    const safetensors = raw.safetensors || {};

    const pipeline =
      raw.pipeline_tag ||
      raw.pipeline ||
      tags.find((t) => t.startsWith("pipeline:")) ||
      "Unknown";

    const family =
      raw.family ||
      raw.model_family ||
      tags
        .find((t) => t.startsWith("family:"))
        ?.replace("family:", "") ||
      "Unknown";

    const architecture =
      raw.architecture ||
      raw.architectures?.[0] ||
      tags
        .find((t) => t.startsWith("architecture:"))
        ?.replace("architecture:", "") ||
      "Unknown";

    const weight =
      raw.weight ||
      raw.parameter_count ||
      raw.parameters ||
      tags.find((t) =>
        /\b\d+(?:\.\d+)?\s*[bmk]\b/i.test(t)
      ) ||
      "Unknown";

    const safeCount = Number(
      safetensors.total ||
        raw.safetensor_file_count ||
        raw.safetensors_count ||
        siblings.filter((x) =>
          String(x.rfilename || x.name || x).endsWith(".safetensors")
        ).length ||
        0
    );

    return {
      id:
        raw.id ||
        raw.modelId ||
        raw.name ||
        crypto.randomUUID(),

      name:
        raw.name ||
        raw.modelId ||
        raw.id ||
        "Unnamed model",

      family: String(family),
      pipeline: String(pipeline),
      architecture: String(architecture),
      weight: String(weight),
      safetensorCount: safeCount,
      downloads: Number(raw.downloads || 0),
      likes: Number(raw.likes || 0),
      tags,
    };
  }
}