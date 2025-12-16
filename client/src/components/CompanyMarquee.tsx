const companies = [
    { name: "Goldman Sachs", logo: '/logos/goldman-sacks.png' },
    { name: "BMW", logo: '/logos/bmw-logo.svg' },
    { name: "Meta", logo: '/logos/meta-3.svg' },
    { name: "Spotify", logo: '/logos/spotify-2.svg' },
    { name: "Dropbox", logo: '/logos/dropbox-3.svg' },
    { name: "Google", logo: '/logos/google-1-1.svg' },
    { name: "Tesla", logo: '/logos/tesla-pure.svg' },
    { name: "Qualcomm", logo: '/logos/qualcomm-logo.svg' },
    { name: "Twitter", logo: '/logos/twitter-6.svg' },
    { name: "Microsoft", logo: '/logos/microsoft-6.svg' },
    { name: "Amazon", logo: '/logos/logo-amazon.svg' },
    { name: "IBM", logo: '/logos/ibm-3.svg' },
    { name: "Netflix", logo: '/logos/netflix-logo-icon.svg' },
];

export function CompanyMarquee() {
    return (
        <div className="relative w-full overflow-hidden border-y border-border/5 bg-background/50 py-12 mt-20">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest text-center mb-8">
                Trusted by applicants at
            </p>

            <div className="relative flex overflow-hidden group">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />

                <div className="flex animate-marquee gap-12 items-center w-max hover:[animation-play-state:paused]">
                    {/* First copy */}
                    {companies.map((company, i) => (
                        <div
                            key={`1-${i}`}
                            className="flex items-center justify-center w-[140px] shrink-0 transition duration-300"
                        >
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="h-10 object-contain w-full"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerText = company.name;
                                    e.currentTarget.parentElement!.className = "flex items-center justify-center w-[140px] text-lg font-bold text-muted-foreground";
                                }}
                            />
                        </div>
                    ))}
                    {/* Second copy for seamless loop */}
                    {companies.map((company, i) => (
                        <div
                            key={`2-${i}`}
                            className="flex items-center justify-center w-[140px] shrink-0 transition duration-300"
                        >
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="h-10 object-contain w-full"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerText = company.name;
                                    e.currentTarget.parentElement!.className = "flex items-center justify-center w-[140px] text-lg font-bold text-muted-foreground";
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


