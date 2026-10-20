import { Composition } from "remotion";
import { DURATION_IN_FRAMES, EditaTitle, FPS, HEIGHT, WIDTH } from "./Composition";
import { DURACAO_QUADROS, EstudarUK } from "./uk/EstudarUK";
import { DURACAO_QUADROS as DURACAO_STUDY_QUEST, StudyQuest } from "./estudar/StudyQuest";
import { AnuncioStudentAdvisor, DURACAO_QUADROS as DURACAO_ANUNCIO } from "./anuncio/AnuncioStudentAdvisor";
import { AnuncioV2, DURACAO_QUADROS as DURACAO_ANUNCIO_V2 } from "./anuncio/AnuncioV2";

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
      <Composition
        id="StudyQuest"
        component={StudyQuest}
        durationInFrames={DURACAO_STUDY_QUEST}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AnuncioStudentAdvisor"
        component={AnuncioStudentAdvisor}
        durationInFrames={DURACAO_ANUNCIO}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AnuncioV2"
        component={AnuncioV2}
        durationInFrames={DURACAO_ANUNCIO_V2}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
