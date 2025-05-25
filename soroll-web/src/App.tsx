import { useEffect, useState, type JSX } from "react";
import "./App.css";

const MAX_SCORE = 5;

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
                <h2 className="text-xl mb-4">El sistema ha colapsat</h2>
                <h3>Desitges reinicar el sistema?</h3>
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
            <p>
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
          return <>El silenci parla. Escolta</>;
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
  }: {
    page: number;
    text: string;
    onPageChange?: () => void;
  }) => {
    useEffect(() => {
      if (page !== questionnairePage) return;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handleKey = (e: KeyboardEvent) => {
        if (e.code === "ArrowRight") setScore((score) => score + 1);

        if (score > MAX_SCORE) {
          setCollapsedSystemPage(0);
          setQuestionnairePage(-1);
        } else {
          setQuestionnairePage((page) => page + 1);
          if (onPageChange) onPageChange();
        }
      };
      window.addEventListener("keydown", handleKey);
      return () => {
        window.removeEventListener("keydown", handleKey);
      };
    }, [onPageChange, page]);

    if (page !== questionnairePage) return;
    return (
      <>
        <Logo />
        <div>
          <h2 className="text-xl mb-4">{text}</h2>
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
        <div>
          <h2 className="text-xl mb-4">COM NAVEGAR</h2>
          <p>Avançar: Premeu la tecla espai</p>
          <p>per passar a la següent pàgina.</p>
          <br />
          <h2 className="text-xl mb-4">COM RESPONDRE</h2>
          <p>SI Premeu la fletxa dreta.</p>
          <p>NO Premeu la fletxa esquerra.</p>
          <br />
          <h2 className="text-xl mb-4">CONFIGURACIÓ SONORA</h2>
          <p>Ajusta el volum al màxim durant tota l’experiència.</p>
        </div>
      </NonQuestionairePage>
      <QuestionnairePage
        page={0}
        text="Vas de forma habitual a la discoteca?"
      />
      <QuestionnairePage
        page={1}
        text="Escoltes música a través d’altaveus pel carrer o en espais públics?"
      />
      <QuestionnairePage
        page={2}
        text="Participes o organitzes botellots o trobades sorolloses en espais públics?"
      />
      <QuestionnairePage
        page={3}
        text="Conduint, acceleres fort i ràpid encara que no sigui necessari?"
      />
      <QuestionnairePage
        page={4}
        text="Poses música a tot volum quan condueixes?"
      />
      <QuestionnairePage
        page={5}
        text="Fas servir petards o coets durant festes o celebracions?"
      />
      <QuestionnairePage
        page={6}
        text="Utilitzes el mòbil parlant en veu molt alta en espais tancats (cafeteries, vagons de tren, sales d’espera...)?"
      />
      <QuestionnairePage
        page={7}
        text="T’has barallat o cridat a l’espai públic provocant molèsties?"
      />
      <QuestionnairePage
        page={8}
        text="Asisteixes de forma habitual a concerts o festivals de musica?"
      />
      <QuestionnairePage
        page={9}
        text="Fas servir la moto o el cotxe amb el tub d’escapament modificat o molt sorollós?"
      />
      <QuestionnairePage
        page={10}
        text="Permets als teus animals de companyia bordar o fer soroll sense controlar-los?"
      />
      <QuestionnairePage
        page={11}
        text="Has participat en manifestacions o protestes?"
      />
      <QuestionnairePage
        page={12}
        text="Toques el clàxon del cotxe sovint, fins i tot quan no és estrictament necessari?"
      />
      <QuestionnairePage
        page={13}
        text="Quan tens reunions familiars o amb amics, us adoneu si esteu fent massa soroll?"
      />
      <QuestionnairePage
        page={14}
        text="Has fet festes a casa sense tenir en compte el descans dels veïns?"
        onPageChange={() => setSuccessPage(true)}
      />

      <CollapsedSystemPage />

      {successPage ? (
        <>
          <Logo />
          <p>
            Enhorabona! Gràcies per contribuir a un entorn més tranquil i
            saludable.
          </p>
        </>
      ) : null}
    </div>
  );
}
