// src/app/.../freepik/components/FreepikDownloader.tsx
"use client";

import React, { useState } from "react";
import {
  getFreepikOptions,
  FreepikOption,
} from "./../../../src/services/freepikService";

interface FreepikDownloaderProps {
  url: string;
  onOptionChange: (optionId?: string) => void;
}

const FreepikDownloader: React.FC<FreepikDownloaderProps> = ({
  url,
  onOptionChange,
}) => {
  const [options, setOptions] = useState<FreepikOption[] | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(
    undefined
  );
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadOptions = async () => {
    setError(null);
    setOptions(null);
    setSelectedOptionId(undefined);
    onOptionChange(undefined);

    if (!url.trim()) {
      setError("Pega primero el enlace de Freepik.");
      return;
    }

    try {
      setLoadingOptions(true);
      const opts = await getFreepikOptions(url);
      setOptions(opts);
      if (opts.length) {
        const firstId = opts[0].id;
        setSelectedOptionId(firstId);
        onOptionChange(firstId);
      }
    } catch (e: any) {
      setError(e?.message || "Error al cargar opciones");
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedOptionId(id);
    onOptionChange(id);
  };

  return (
    <div className="space-y-2">
      {/* Solo botón de opciones, sin otro input */}
      <button
        type="button"
        onClick={handleLoadOptions}
        disabled={loadingOptions || !url.trim()}
        className="w-full rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-semibold py-2"
      >
        {loadingOptions ? "Buscando opciones..." : "Ver opciones de descarga"}
      </button>

      {options && options.length > 0 && (
        <div className="border border-slate-700 rounded-xl px-3 py-2 space-y-2 bg-slate-900/60">
          <p className="text-xs font-semibold text-slate-200">
            Elige calidad / formato:
          </p>
          <div className="space-y-1">
            {options.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 text-xs text-slate-200"
              >
                <input
                  type="radio"
                  name="freepik-option"
                  value={opt.id}
                  checked={selectedOptionId === opt.id}
                  onChange={() => handleSelect(opt.id)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
};

export default FreepikDownloader;
