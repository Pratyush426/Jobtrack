import ColorBends from "@/components/effects/colorBlends";

export function LandingBackground({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 -z-10">
                <ColorBends
                    colors={["#6366f1", "#22d3ee", "#a855f7"]}
                    speed={0.15}
                    warpStrength={1.1}
                    frequency={0.9}
                    mouseInfluence={0.5}
                    parallax={0.4}
                    noise={0.05}
                    transparent
                />

                {/* Readability overlay */}
                <div className="absolute inset-0 bg-background/30 backdrop-blur-sm" />
            </div>

            {children}
        </div>
    );
}
