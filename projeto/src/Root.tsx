import { Composition } from "remotion";
import { DURATION_IN_FRAMES, EditaTitle, FPS, HEIGHT, WIDTH } from "./Composition";
import { DURACAO_QUADROS, EstudarUK } from "./uk/EstudarUK";

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
      <Composition
        id="EstudarUK"
        component={EstudarUK}
        durationInFrames={DURACAO_QUADROS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
