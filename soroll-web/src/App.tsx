import { useEffect, useRef, useState, type JSX } from "react";
import "./App.css";

const MAX_SCORE = 5;
// POL: Canviar el volum global
const AUDIO_VOLUME = 0.5;

const Logo = () => (
  <div className="absolute top-4 left-4">
    <img
      src="https://github.com/user-attachments/assets/ae0df648-3034-43b9-837c-cbb478d78c7b"
      className="w-44"
      alt="Soroll"
    />
  </div>
);

const LoadingBar = ({
  seconds,
  onLoadingComplete,
}: {
  seconds: number;
  onLoadingComplete: () => void;
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onLoadingComplete();
          return prev;
        }
        return prev + 100 / (10 * seconds);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onLoadingComplete, seconds]);

  return (
    <div className="w-full max-w-md mx-auto p-8">
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-center mt-4 text-gray-600">{progress}%</p>
    </div>
  );
};

export default function SorollApp() {
  const [currentPage, setPage] = useState(0);
  const [questionnairePage, setQuestionnairePage] = useState(-1);
  const [collapsedSystemPage, setCollapsedSystemPage] = useState(-1);
  const [successPage, setSuccessPage] = useState(false);
  const [score, setScore] = useState(0);
  // Store all audio instances to control them together
  const audioInstancesRef = useRef<HTMLAudioElement[]>([]);

  const stopAllAudio = () => {
    audioInstancesRef.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    audioInstancesRef.current = []; // Clear the array
  };

  const CollapsedSystemPage = () => {
    const SECONDS_LOADING_BAR = 5;
    useEffect(() => {
      switch (collapsedSystemPage) {
        case 1: {
          return;
        }
        case 0:
        case 2:
        case 3:
          break;
        default: {
          return;
        }
      }

      const handleKey = (e: KeyboardEvent) => {
        if (e.code === "ArrowRight") setScore((score) => score + 1);

        setCollapsedSystemPage((page) => page + 1);
      };
      window.addEventListener("keydown", handleKey);

      return () => {
        window.removeEventListener("keydown", handleKey);
      };
    }, []);

    const children = (() => {
      switch (collapsedSystemPage) {
        case 0:
          return (
            <div>
              <div className="flex flex-col gap-y-2">
                <h2 className="text-6xl">El sistema ha colapsat</h2>
                <h3 className="text-4xl">Desitges reinicar el sistema?</h3>
              </div>
            </div>
          );
        case 1: {
          return (
            <LoadingBar
              seconds={SECONDS_LOADING_BAR}
              onLoadingComplete={() => setCollapsedSystemPage(() => 2)}
            />
          );
        }
        case 2: {
          return (
            <p className="text-4xl px-26 leading-12">
              La contaminació acústica a Barcelona és un problema de salut
              pública. Segons l’Atles de Resiliència de l’Ajuntament de
              Barcelona, durant el dia els nivells de soroll oscil·len entre 55
              i 70 decibels dB(A), i a la nit entre 50 i 65 dB(A). L’exposició
              pot provocar trastorns del son, estrès, hipertensió, malalties
              cardiovasculars, deteriorament cognitiu i pèrdua auditiva.
            </p>
          );
        }
        case 3: {
          return <p className="text-6xl">El silenci parla. Escolta</p>;
        }
        default: {
          return null;
        }
      }
    })();

    return (
      <>
        <Logo />
        {children}
      </>
    );
  };

  const QuestionnairePage = ({
    page,
    text,
    onPageChange,
    volume,
  }: {
    page: number;
    text: string;
    onPageChange?: () => void;
    volume: number;
  }) => {
    // Define your audio URLs based on page number
    const getAudioPreguntaUrl = (pageNumber: number) => {
      // Since your example URL was for page 0, we add 1 to get the correct file number
      const fileNumber = pageNumber + 1;
      return `https://raw.githubusercontent.com/pbb202/SOROLL/refs/heads/main/AUDIOS/PREGUNTA%20${fileNumber}.mp3`;
    };

    useEffect(() => {
      if (page !== questionnairePage) return;

      const handleKey = (e: KeyboardEvent) => {
        if (e.code === "ArrowRight") {
          setScore((score) => score + 1);

          const overlayAudioUrl = getAudioPreguntaUrl(page);
          const newAudio = new Audio(overlayAudioUrl);
          newAudio.loop = true;
          newAudio.volume = volume * AUDIO_VOLUME;
          newAudio.play().catch(console.error);

          // Add to our collection of audio instances
          audioInstancesRef.current.push(newAudio);
        }

        if (score > MAX_SCORE) {
          setCollapsedSystemPage(0);
          setQuestionnairePage(-1);
          stopAllAudio();

          const newAudio = new Audio(
            `https://raw.githubusercontent.com/pbb202/SOROLL/refs/heads/main/AUDIOS/SO%20COLAPSE.mp3`,
          );
          newAudio.loop = true;

          /*POL: To change the volume of the colapse question (Change the 1)*/
          newAudio.volume = 2 * AUDIO_VOLUME;
          newAudio.play().catch(console.error);
        } else {
          setQuestionnairePage((page) => page + 1);
          if (onPageChange) onPageChange();
        }
      };

      window.addEventListener("keydown", handleKey);
      return () => {
        window.removeEventListener("keydown", handleKey);
      };
    }, [onPageChange, page, volume]);

    if (page !== questionnairePage) return null;

    return (
      <>
        <Logo />
        <div className="relative w-full">
          <div className="absolute w-40 left-0 overflow-x-hidden z-0">
            <img
              className="rotate-180 -translate-x-1/2"
              src="https://github.com/user-attachments/assets/429393ac-7933-4ece-a944-51079a867082"
            />
          </div>
          <h2 className="text-4xl z-1 px-16">{text}</h2>
          <div className="absolute w-40 right-0 top-0 overflow-x-hidden z-0">
            <img
              src="https://github.com/user-attachments/assets/6113b49c-e1ce-4264-9b6e-92597902ce6e"
              className="rotate-180 translate-x-1/2"
            />
          </div>
        </div>
      </>
    );
  };

  const NonQuestionairePage = ({
    children,
    page,
    drawLogo = true,
    onPageChange,
  }: {
    children: JSX.Element;
    page: number;
    drawLogo?: boolean;
    onPageChange?: () => void;
  }) => {
    useEffect(() => {
      if (page !== currentPage) return;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handleKey = (_e: unknown) => {
        setPage((page) => page + 1);
        if (onPageChange) onPageChange();
      };
      window.addEventListener("keydown", handleKey);
      window.addEventListener("click", handleKey);
      return () => {
        window.removeEventListener("keydown", handleKey);
        window.removeEventListener("click", handleKey);
      };
    }, [page, onPageChange]);

    if (page !== currentPage) return;
    return (
      <>
        {drawLogo && <Logo />}
        <div className="w-full">{children}</div>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center text-white bg-black text-center h-screen w-screen">
      <NonQuestionairePage page={0} drawLogo={false}>
        <img
          src="https://github.com/user-attachments/assets/227b3993-4c9b-43bb-abab-ab2e250a23e3"
          alt="Soroll"
          className="w-full"
        />
      </NonQuestionairePage>
      <NonQuestionairePage page={1}>
        <h1 className="text-2xl">
          Quan va ser la ultima vegada que vas notar el silenci?
        </h1>
      </NonQuestionairePage>
      <NonQuestionairePage
        page={2}
        onPageChange={() => setQuestionnairePage(0)}
      >
        <div className="flex flex-col gap-y-0">
          <h2 className="text-4xl">COM NAVEGAR</h2>
          <p className="text-2xl">Avançar: Premeu la tecla espai</p>
          <p className="text-2xl">per passar a la següent pàgina.</p>
          <br />
          <h2 className="text-4xl">COM RESPONDRE</h2>
          <p className="text-2xl">SI Premeu la fletxa dreta.</p>
          <p className="text-2xl">NO Premeu la fletxa esquerra.</p>
          <br />
          <h2 className="text-4xl">CONFIGURACIÓ SONORA</h2>
          <p className="text-2xl">
            Ajusta el volum al màxim durant tota l’experiència.
          </p>
        </div>
      </NonQuestionairePage>
      {/*POL: To change the volume of all the questions*/}
      <QuestionnairePage
        page={0}
        text="Vas de forma habitual a la discoteca?"
        volume={0.75}
      />
      <QuestionnairePage
        page={1}
        text="Escoltes música a través d’altaveus pel carrer o en espais públics?"
        volume={0.5}
      />
      <QuestionnairePage
        page={2}
        text="Participes o organitzes botellots o trobades sorolloses en espais públics?"
        volume={1.5}
      />
      <QuestionnairePage
        page={3}
        text="Conduint, acceleres fort i ràpid encara que no sigui necessari?"
        volume={1.5}
      />
      <QuestionnairePage
        page={4}
        text="Poses música a tot volum quan condueixes?"
        volume={2}
      />
      <QuestionnairePage
        page={5}
        text="Fas servir petards o coets durant festes o celebracions?"
        volume={1.75}
      />
      <QuestionnairePage
        page={6}
        text="Utilitzes el mòbil parlant en veu molt alta en espais tancats (cafeteries, vagons de tren, sales d’espera...)?"
        volume={0.7}
      />
      <QuestionnairePage
        page={7}
        text="T’has barallat o cridat a l’espai públic provocant molèsties?"
        volume={1}
      />
      <QuestionnairePage
        page={8}
        text="Asisteixes de forma habitual a concerts o festivals de musica?"
        volume={0.8}
      />
      <QuestionnairePage
        page={9}
        text="Fas servir la moto o el cotxe amb el tub d’escapament modificat o molt sorollós?"
        volume={0.7}
      />
      <QuestionnairePage
        page={10}
        text="Permets als teus animals de companyia bordar o fer soroll sense controlar-los?"
        volume={1}
      />
      <QuestionnairePage
        page={11}
        text="Has participat en manifestacions o protestes?"
        volume={1}
      />
      <QuestionnairePage
        page={12}
        text="Toques el clàxon del cotxe sovint, fins i tot quan no és estrictament necessari?"
        volume={1}
      />
      <QuestionnairePage
        page={13}
        text="Quan tens reunions familiars o amb amics, us adoneu si esteu fent massa soroll?"
        volume={1.2}
      />
      <QuestionnairePage
        page={14}
        text="Has fet festes a casa sense tenir en compte el descans dels veïns?"
        onPageChange={() => {
          setSuccessPage(true);
          stopAllAudio();

          const newAudio = new Audio(
            `https://raw.githubusercontent.com/pbb202/SOROLL/refs/heads/main/AUDIOS/SO%20FINAL%20si%20ho%20han%20fet%20be.mp3`,
          );
          newAudio.loop = true;

          // POL: To change the volume of the succes sound (change the 1)
          newAudio.volume = 2 * AUDIO_VOLUME;
          newAudio.play().catch(console.error);
        }}
        volume={1}
      />

      <CollapsedSystemPage />

      {successPage ? (
        <>
          <Logo />
          <p className="text-6xl">
            Enhorabona! Gràcies per contribuir a un entorn més tranquil i
            saludable.
          </p>
        </>
      ) : null}
    </div>
  );
}
