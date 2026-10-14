// Supply videoSrc and optionally poster when the project film is available.
// This single player stays mounted while its frame moves between the two slots.
export function ProjectVideo({ videoSrc, poster }: { videoSrc?: string; poster?: string }) {
  return (
    <div data-project-stage className="relative -mt-6 aspect-[2/1] w-full max-w-[669px] self-center lg:absolute lg:left-[calc(25%-10px)] lg:top-[1491px] lg:mt-0 lg:aspect-[669/254] lg:w-[669px]">
      <div data-project-side="left" aria-hidden="true" className="absolute left-[8%] top-[8%] aspect-video w-[64%] -rotate-3 rounded-xl bg-[#FDD4D4] lg:left-0 lg:top-[4%] lg:w-[54.41%] lg:-rotate-[6.5deg]" />
      <div data-project-side="right" aria-hidden="true" className="absolute right-[8%] top-[8%] aspect-video w-[64%] rotate-3 rounded-xl bg-[#F7C3C3] lg:right-0 lg:top-[4%] lg:w-[54.41%] lg:rotate-[6.5deg]" />
      <div data-project-target className="absolute left-[18%] top-[8%] aspect-video w-[64%] lg:left-[23.32%] lg:top-[3.55%] lg:w-[54.41%]">
        <div data-project-frame className="absolute left-0 top-0 h-full w-full origin-top-left">
          <div data-project-surface className="relative h-full w-full overflow-hidden rounded-xl bg-[#FFEBEB]">
            <VideoContent videoSrc={videoSrc} poster={poster} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function InlineVideo({ videoSrc, poster, content = "video" }: { videoSrc?: string; poster?: string; content?: "video" | "pong" | "website" }) {
  return (
    <span data-inline-player className={`relative inline-block h-[45px] w-0 overflow-hidden rounded-xl ${content === "website" ? "bg-white ring-1 ring-inset ring-neutral-200" : content === "pong" ? "bg-neutral-800" : "bg-[#FFEBEB]"} opacity-0 [--inline-player-width:80px] [vertical-align:var(--inline-player-align,middle)] sm:h-[63px] sm:[--inline-player-width:112px]`}>
      {content === "website" ? <WebsiteSkeleton /> : content === "pong" ? <PongRally /> : <VideoContent videoSrc={videoSrc} poster={poster} />}
    </span>
  );
}

function WebsiteSkeleton() {
  return (
    <svg role="img" aria-label="Miniature website with a left sidebar and top navigation" viewBox="0 0 112 63" className="absolute inset-0 h-full w-full" fill="none">
      <path d="M23 0H112V11H23Z" fill="#fafafa" />
      <path d="M0 0H23V63H0Z" fill="#f5f5f5" />
      <path d="M23 0V63M23 11H112" stroke="#e5e5e5" strokeWidth="0.8" />
      <rect x="6" y="6" width="11" height="4" rx="2" fill="#a3a3a3" />
      <rect x="5" y="17" width="14" height="5" rx="2" fill="#dedede" />
      <path d="M7 28H16M7 35H14M7 42H16M7 54H13" stroke="#c4c4c4" strokeWidth="2" strokeLinecap="round" />
      <rect x="29" y="4" width="25" height="3" rx="1.5" fill="#e5e5e5" />
      <circle cx="104" cy="5.5" r="2.5" fill="#d4d4d4" />
      <path d="M85 5.5H95" stroke="#d4d4d4" strokeWidth="2" strokeLinecap="round" />
      <rect x="30" y="18" width="31" height="4" rx="2" fill="#bcbcbc" />
      <rect x="30" y="25" width="49" height="2" rx="1" fill="#e5e5e5" />
      <rect x="30" y="33" width="22" height="12" rx="2" fill="#f0f0f0" />
      <rect x="56" y="33" width="22" height="12" rx="2" fill="#f0f0f0" />
      <rect x="82" y="33" width="22" height="12" rx="2" fill="#f0f0f0" />
      <path d="M31 51H74M31 56H96" stroke="#e5e5e5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PongRally() {
  return (
    <svg role="img" aria-label="Animated Pong rally" viewBox="0 0 112 63" className="absolute inset-0 h-full w-full" fill="none">
      <path d="M56 8V55" stroke="white" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 4" />
      <rect className="pong-paddle-left" x="8" y="0" width="3" height="18" rx="1.5" fill="#fafafa" />
      <rect className="pong-paddle-right" x="101" y="0" width="3" height="18" rx="1.5" fill="#fafafa" />
      <circle className="pong-ball" r="2.5" fill="#fafafa" />
    </svg>
  );
}

function VideoContent({ videoSrc, poster }: { videoSrc?: string; poster?: string }) {
  return videoSrc ? (
    <video src={videoSrc} poster={poster} controls playsInline preload="metadata" aria-label="Project video" className="block h-full w-full object-cover" />
  ) : (
    <span role="img" aria-label="Project video placeholder" className="absolute inset-0 flex items-center justify-center">
      <svg aria-hidden="true" viewBox="0 0 48 48" className="h-8 w-8 text-black/40" fill="none">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 16L32 24L20 32V16Z" fill="currentColor" />
      </svg>
    </span>
  );
}
