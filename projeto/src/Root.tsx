import { Composition } from "remotion";
import { DURATION_IN_FRAMES, EditaTitle, FPS, HEIGHT, WIDTH } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Vertical"
        component={EditaTitle}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
