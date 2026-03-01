

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-[95%] 2xl:w-7xl mx-auto">
            {children}
        </div>
    )
}
