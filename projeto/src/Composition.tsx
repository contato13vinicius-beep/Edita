import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 5 * FPS;

const fontFamily = '"Arial Black", "Helvetica Neue", Arial, sans-serif';

export const EditaTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const scale = interpolate(enter, [0, 1], [0.6, 1]);
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const letterSpacing = interpolate(frame, [0, DURATION_IN_FRAMES], [-20, 10], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b0b0f",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: 300,
          color: "#ffffff",
          letterSpacing,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        EDITA
      </div>
    </AbsoluteFill>
  );
};

