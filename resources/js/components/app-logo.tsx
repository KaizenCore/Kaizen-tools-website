export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg">
                <img
                    src="/Kaizen.png"
                    alt="Kaizen Tools"
                    className="size-full object-cover"
                />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-bold text-foreground group-data-[collapsible=icon]:hidden">
                    Kaizen Tools
                </span>
                <span className="truncate text-xs leading-tight text-muted-foreground group-data-[collapsible=icon]:hidden">
                    Minecraft Toolkit
                </span>
            </div>
        </>
    );
}
