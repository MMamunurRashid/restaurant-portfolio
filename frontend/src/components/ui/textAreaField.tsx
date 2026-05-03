export function FieldTextarea({
  label,
  placeholder = '',
  icon,
  value,
  onChange,
  required = false,
  rows = 4,
}: {
  label: string;
  placeholder?: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div className="group">
      <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600 mb-2 block group-focus-within:text-[#CC826C] transition-colors">
        {label}
        {required && <span className="text-[#dc1f52] ml-0.5">*</span>}
      </label>

      <div className="flex gap-3 border-b-2 border-stone-100 group-focus-within:border-[#CC826C] transition-colors pb-2">
        <span className="text-stone-400 group-focus-within:text-[#CC826C] transition-colors shrink-0 mt-1">
          {icon}
        </span>

        <textarea
          placeholder={placeholder}
          value={value}
          required={required}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-stone-700 placeholder:text-stone-400 outline-none resize-y min-h-[80px]"
        />
      </div>
    </div>
  );
}