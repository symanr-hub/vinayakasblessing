import React from "react";

export const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
  hint,
  required = false,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 text-sm p-3.5 transition-colors resize-y focus:outline-none focus:ring-2 focus:ring-forest-500/20 disabled:bg-slate-50 disabled:text-slate-500 ${
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
            : "border-slate-300 hover:border-slate-400 focus:border-forest-600"
        }`}
        {...props}
      />
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
};

