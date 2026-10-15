import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Interactive,
  interpolate,
  type InteractivitySchema,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type BarProps = {
  label: string;
  value: number;
  color: string;
  style?: CSSProperties;
};

const BarInner = ({ label, value, color, style }: BarProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(frame, [0, 1.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <Interactive.Div
      style={{
        position: "absolute",
        width: 130,
        height: 364,
        fontFamily: "Arial, sans-serif",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 64,
          width: "100%",
          height: Math.max(0, Math.min(100, value)) * 3 * progress,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -43,
            width: "100%",
            textAlign: "center",
            color: "#effff7",
            fontSize: 30,
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
            opacity: progress,
          }}
        >
          {Math.round(value * progress)}
        </div>
        <div
          style={{
            height: "100%",
            borderRadius: "10px 10px 0 0",
            background: `linear-gradient(180deg, ${color} 0%, ${color}b3 100%)`,
            boxShadow: `0 0 40px ${color}0c`,
            overflow: "hidden",
          }}
        >
          <div
            style={{ height: 2, margin: "0 8px", background: "#ffffff55" }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 16,
          width: "100%",
          textAlign: "center",
          color: "#a1b1ab",
          fontSize: 22,
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
    </Interactive.Div>
  );
};

const barSchema = {
  label: { type: "text-content", default: "Jan", description: "Label" },
  value: {
    type: "number",
    default: 32,
    min: 0,
    max: 100,
    step: 1,
    hiddenFromList: false,
    description: "Value (0–100)",
  },
  color: { type: "color", default: "#8ce8bd", description: "Bar color" },
} as const satisfies InteractivitySchema;

export const ChartBar = Interactive.withSchema({
  Component: BarInner,
  componentName: "<ChartBar>",
  schema: barSchema,
  wrapInSequence: true,
});

export const FiveBarChart = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#101a18",
        color: "#f0f4ef",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 80% 20%, #284a3933, transparent 65%)",
        }}
      />
      <Interactive.Div
        name="Heading"
        premountFor={fps}
        style={{
          position: "absolute",
          left: 80,
          top: 65,
          opacity: interpolate(frame, [0, 0.65 * fps], [0, 1], {
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [0, 0.8 * fps],
            ["0px 16px", "0px 0px"],
            {
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        <div
          style={{
            color: "#a4c2b4",
            fontSize: 16,
            letterSpacing: 4,
            marginBottom: 22,
          }}
        >
          THE GROWTH REPORT
        </div>
        <div style={{ fontSize: 58, fontWeight: 500, letterSpacing: -2.8 }}>
          Momentum, month by month.
        </div>
        <div style={{ color: "#8eaaa0", fontSize: 22, marginTop: 15 }}>
          Five months. A clear upward trend.
        </div>
      </Interactive.Div>
      <Interactive.Div
        name="Chart grid"
        premountFor={fps}
        style={{
          position: "absolute",
          left: 80,
          top: 274,
          width: 1120,
          height: 300,
          opacity: interpolate(frame, [0.3 * fps, 0.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {[0, 25, 50, 75, 100].map((tick) => (
          <div
            key={tick}
            style={{
              position: "absolute",
              left: 0,
              bottom: tick * 3,
              width: "100%",
              height: 1,
              backgroundColor: tick === 0 ? "#708b7d" : "#d6f5e611",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                top: -23,
                color: "#6c887b",
                fontSize: 14,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {tick}
            </span>
          </div>
        ))}
      </Interactive.Div>
      <ChartBar
        name="January"
        from={0.8 * fps}
        premountFor={fps}
        label="JAN"
        value={32}
        color="#75b99a"
        style={{ left: 190, top: 274 }}
      />
      <ChartBar
        name="February"
        from={1.1 * fps}
        premountFor={fps}
        label="FEB"
        value={48}
        color="#7bc9a5"
        style={{ left: 386, top: 274 }}
      />
      <ChartBar
        name="March"
        from={1.4 * fps}
        premountFor={fps}
        label="MAR"
        value={43}
        color="#85d8af"
        style={{ left: 582, top: 274 }}
      />
      <ChartBar
        name="April"
        from={1.7 * fps}
        premountFor={fps}
        label="APR"
        value={68}
        color="#94ebbc"
        style={{ left: 778, top: 274 }}
      />
      <ChartBar
        name="May"
        from={2 * fps}
        premountFor={fps}
        label="MAY"
        value={92}
        color="#c5f79b"
        style={{ left: 974, top: 274 }}
      />
      <Interactive.Div
        name="Footer"
        premountFor={fps}
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 45,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 15,
          color: "#799689",
          letterSpacing: 1.3,
          opacity: interpolate(frame, [2.7 * fps, 3.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span>SAMPLE DATA · INDEX / 100</span>
        <span style={{ color: "#c5f79b" }}>JAN — MAY ↗</span>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <Composition
    id="FiveBarChart"
    component={FiveBarChart}
    durationInFrames={210}
    fps={30}
    width={1280}
    height={720}
  />
);
