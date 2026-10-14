import { Fragment } from "react";
import { ScrollRevealSequence, ScrollRevealText } from "@/components/scroll-reveal-text";
import { ProjectVideo } from "@/components/project-video";
import { IntroBounceCards } from "@/components/intro-bounce-cards";

// Positions, widths, wording, and line heights are taken directly from the
// Homepage artboard in Paper's "Engaging quartz" file.
const blocks = [
  {
    text: "Hi I am Alok .   I am a web designer - developer. ",
    position: "lg:top-[153px]",
  },
  {
    text: "I build premium UI/UX for organisation that cares about user",
    position: "lg:top-[646px]",
    heading: true,
  },
  {
    text: "My principle behind building a great interface is for it to be functional, smooth, intuitive and awsome. ",
    position: "lg:top-[899px]",
  },
  {
    text: "When I am not working I like to write blogs and building side projects.",
    position: "lg:top-[1192px]",
    relaxed: true,
  },
  {
    text: "And when I take on a project, I make sure to understand the problem, keep communication clear throughout the process, and get things done on time.",
    position: "lg:top-[1833px]",
  },
  {
    text: "I'd love the opportunity to bring my experience and my skills to your next work.",
    position: "lg:top-[2201px]",
  },
  {
    text: "Looking forward to bring your ideas to life",
    position: "lg:top-[2445px]",
  },
  {
    text: "Find a little more about me and my work at ",
    position: "lg:top-[2627px]",
  },
  {
    text: "or just Book a call",
    position: "lg:top-[2795px] lg:translate-x-px",
  },
] as const;

export default function Home() {
  return (
    <ScrollRevealSequence className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-[48px] overflow-clip bg-neutral-100 px-6 py-[64px] text-black antialiased sm:gap-[56px] sm:px-12 sm:py-[96px] lg:block lg:min-h-[2965px] lg:p-0">
      {blocks.map((block, index) => {
        const Tag = "heading" in block ? "h1" : "p";
        return (
          <Fragment key={index}>
            <ScrollRevealText
              as={Tag}
              mascotAfter={index === 0 ? "Alok" : undefined}
              text={block.text}
              avatars={index === 1}
              inlineVideoAfter={index === 1 ? "UI/UX" : index === 5 ? "skills" : undefined}
              inlineVideoContent={index === 1 ? "website" : index === 5 ? "pong" : "video"}
              socialIcons={index === 7}
              opportunityIcon={index === 5}
              callIcon={index === 8}
              techWord={index === 2 ? "functional" : undefined}
              gradientWord={index === 2 ? "smooth" : undefined}
              fuzzyWord={index === 2 ? "intuitive" : undefined}
              glitchWord={index === 2 ? "awsome" : undefined}
              projectVideo={index === 3}
              conveyorAfter={index === 6 ? "your ideas to life" : undefined}
              className={`m-0 w-full max-w-[696px] self-center whitespace-pre-wrap text-[32px] font-normal [overflow-wrap:normal] [font-synthesis:none] sm:text-[40px] lg:absolute lg:left-1/4 lg:w-[696px] lg:text-[48px] ${"relaxed" in block ? "leading-[160%]" : "leading-[130%]"} ${block.position}`}
            />
            {index === 0 && <IntroBounceCards />}
            {index === 3 && <ProjectVideo />}
          </Fragment>
        );
      })}
    </ScrollRevealSequence>
  );
}
