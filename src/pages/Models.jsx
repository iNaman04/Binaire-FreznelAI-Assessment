import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../services/AuthContext";
import { ModelApi } from "../services/ModelApi";
import { ModelCache } from "../services/ModelCache";
import { ModelFilter } from "../services/ModelFilter";
import { ModelSorter } from "../services/ModelSorter";
import { BackgroundSync } from "../services/BackgroundSync";
import { debounce, throttle } from "../services/debounce";
import ConnectionBadge from "../components/ConnectionBadge";
import ModelCard from "../components/ModelCard";

const api = new ModelApi();
const cache = new ModelCache();
const filterer = new ModelFilter();
const sorter = new ModelSorter();

export default function Models() {
  const { user, logout } = useAuth();
  const [models, setModels] = useState([]);
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("");
  const [pipeline, setPipeline] = useState("");
  const [architecture, setArchitecture] = useState("");
  const [weight, setWeight] = useState("");
  const [minSafe, setMinSafe] = useState(0);
  const [maxSafe, setMaxSafe] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const syncRef = useRef(null);

  const load = function (showSpinner) {
    if (showSpinner) setLoading(true);
    return api.request({ limit: 100 })
      .then(function (data) {
        return cache.save(data).then(function () {
          setModels(data);
          setNotice("Fresh API data loaded");
        });
      })
      .catch(function () {
        return cache.load().then(function (cached) {
          setModels(cached);
          setNotice(cached.length ? "Using cached data — offline mode" : "API unavailable and no cache exists");
        });
      })
      .finally(function () { setLoading(false); });
  };

  const throttledRefresh = useMemo(function () {
    return throttle(function () { load(false); }, 2000);
  }, []);

  const debouncedSearch = useMemo(function () {
    return debounce(function () {
      throttledRefresh();
    }, 350);
  }, [throttledRefresh]);

  useEffect(function () {
    cache.load().then(function (cached) {
      if (cached.length) {
        setModels(cached);
        setNotice("Loaded local cache");
      }
    }).finally(function () {
      load(false);
    });

    syncRef.current = new BackgroundSync(api, cache, function (data) {
      setModels(data);
      setNotice(navigator.onLine ? "Background sync complete" : "Using cached data");
    });
    syncRef.current.start(120000);

    return function () {
      if (syncRef.current) syncRef.current.stop();
    };
  }, []);

  const options = useMemo(function () {
    return {
      families: [...new Set(models.map(m => m.family).filter(Boolean))].sort(),
      pipelines: [...new Set(models.map(m => m.pipeline).filter(Boolean))].sort(),
      architectures: [...new Set(models.map(m => m.architecture).filter(Boolean))].sort()
    };
  }, [models]);

  const visibleModels = useMemo(function () {
    const filtered = filterer.apply(models, { query, family, pipeline, architecture, weight, minSafe, maxSafe });
    return sorter.sort(filtered, sortKey, sortDir);
  }, [models, query, family, pipeline, architecture, weight, minSafe, maxSafe, sortKey, sortDir]);

  function onQuery(value) {
    setQuery(value);
    debouncedSearch();
  }

  function clearFilters() {
    setQuery(""); setFamily(""); setPipeline(""); setArchitecture(""); setWeight("");
    setMinSafe(0); setMaxSafe("");
  }

  function changeSort(value) {
    const parts = value.split(":");
    setSortKey(parts[0]);
    setSortDir(parts[1]);
  }

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">BIN<span>AIRE</span></div>
        <div className="top-actions">
          <ConnectionBadge />
          <span className="user">{user?.email}</span>
          <button className="ghost" onClick={() => logout()}>Sign out</button>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">MODEL SEARCH UTILITY</p>
          <h1>Choose intelligence<br /><span>with precision.</span></h1>
          <p className="hero-text">Explore available models, narrow them by capabilities and architecture, then sort the results into a useful shortlist.</p>
        </div>
        <div className="hero-metric"><strong>{visibleModels.length}</strong><span>matching models</span></div>
      </section>

      <section className="workspace">
        <aside className="filters">
          <div className="section-title"><span>FILTERS</span><button className="link-btn" onClick={clearFilters}>Clear</button></div>

          <label className="field">Search model / family
            <input value={query} onChange={e => onQuery(e.target.value)} placeholder="Try: llama, bert..." />
          </label>

          <label className="field">Family
            <select value={family} onChange={e => setFamily(e.target.value)}>
              <option value="">All families</option>
              {options.families.map(x => <option key={x}>{x}</option>)}
            </select>
          </label>

          <label className="field">Pipeline
            <select value={pipeline} onChange={e => setPipeline(e.target.value)}>
              <option value="">All pipelines</option>
              {options.pipelines.map(x => <option key={x}>{x}</option>)}
            </select>
          </label>

          <label className="field">Architecture
            <select value={architecture} onChange={e => setArchitecture(e.target.value)}>
              <option value="">All architectures</option>
              {options.architectures.map(x => <option key={x}>{x}</option>)}
            </select>
          </label>

          <label className="field">Weight / parameter tag
            <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 7B" />
          </label>

          <div className="range-title">Safetensor file count</div>
          <div className="range-row">
            <input type="number" min="0" value={minSafe} onChange={e => setMinSafe(e.target.value)} placeholder="Min" />
            <span>—</span>
            <input type="number" min="0" value={maxSafe} onChange={e => setMaxSafe(e.target.value)} placeholder="Max" />
          </div>

          <div className="filter-note">Search is debounced and API refresh is throttled to reduce unnecessary network traffic.</div>
        </aside>

        <section className="results">
          <div className="results-toolbar">
            <div>
              <h2>Available models</h2>
              <p>{notice}</p>
            </div>
            <select value={sortKey + ":" + sortDir} onChange={e => changeSort(e.target.value)}>
              <option value="name:asc">Name · A → Z</option>
              <option value="name:desc">Name · Z → A</option>
              <option value="safetensorCount:asc">Safetensors · Low → High</option>
              <option value="safetensorCount:desc">Safetensors · High → Low</option>
            </select>
          </div>

          {loading ? (
            <div className="loading-grid">{[1,2,3,4,5,6].map(i => <div className="skeleton" key={i} />)}</div>
          ) : visibleModels.length ? (
            <div className="model-grid">{visibleModels.map(model => <ModelCard key={model.id} model={model} />)}</div>
          ) : (
            <div className="empty"><strong>No matching models</strong><span>Try removing a filter or broadening the search.</span></div>
          )}
        </section>
      </section>

      <footer>
        <span>BIN AIRE / FREZNEL ASSESSMENT</span>
        <span>Local cache enabled · Background sync enabled</span>
      </footer>
    </main>
  );
}