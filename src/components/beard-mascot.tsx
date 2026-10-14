"use client";

import { Mascot } from "page-mascot";

export function BeardMascot() {
  return (
    <span data-name-mascot className="relative ml-[10px] inline-block h-[48.384px] w-[48.384px] overflow-hidden rounded-full border border-[#D5D5D5] bg-white align-middle transition-transform duration-360 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 motion-reduce:transition-none sm:h-[64.512px] sm:w-[64.512px]">
      <span className="absolute inset-0 flex items-center justify-center">
        {/* Shrink only the character to add padding inside the unchanged frame. */}
        <span className="block h-[38.32px] w-[38.32px] shrink-0 scale-75 sm:h-[51.76px] sm:w-[51.76px]">
          {/* Match the generated atlases' shared transparent margins. */}
          <Mascot directions="/mascots/alok-directions.webp?v=skin-tone-2" reactions="/mascots/alok-reactions.webp?v=skin-tone-2" size={64} label="Alok mascot" className="!h-full !w-full translate-y-[16%] scale-[2.2] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-black" />
        </span>
      </span>
    </span>
  );
}
