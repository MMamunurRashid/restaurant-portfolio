export function FieldInput({ label, placeholder = '', icon, type = 'text', value, onChange, required = false }: {
    label: string;
    placeholder?: string;
    icon: React.ReactNode;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    required?: boolean;
}) {
    return (
        <div className="group">
            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600 mb-2 block group-focus-within:text-primary transition-colors">
                {label}
                {required && <span className="text-primary ml-0.5">*</span>}
            </label>
            <div className="flex items-center gap-3 border-b-2 border-stone-100 group-focus-within:border-primary transition-colors pb-2">
                <span className="text-stone-400 group-focus-within:text-primary transition-colors shrink-0">
                    {icon}
                </span>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    required={required}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-transparent text-sm text-stone-700 placeholder:text-stone-400 outline-none"
                />
            </div>
        </div>
    );
}
