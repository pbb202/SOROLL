import { useEffect, useState } from "react";

const QUESTIONS = [
  { text: "Vas de forma habitual a la discoteca?", points: 1 },
  { text: "Escoltes música a través d’altaveus pel carrer o en espais públics?", points: 1 },
  { text: "Participes o organitzes botellots o trobades sorolloses en espais públics?", points: 1 },
  { text: "Conduint, acceleres fort i ràpid encara que no sigui necessari?", points: 1 },
  { text: "Poses música a tot volum quan condueixes?", points: 1 },
  { text: "Fas servir petards o coets durant festes o celebracions?", points: 1 },
  { text: "Utilitzes el mòbil parlant en veu molt alta en espais tancats (cafeteries, vagons de tren, sales d’espera...)?", points: 1 },
  { text: "T’has barallat o cridat a l’espai públic provocant molèsties?", points: 1 },
  { text: "Asisteixes de forma habitual a concerts o festivals de musica?", points: 1 },
  { text: "Fas servir la moto o el cotxe amb el tub d’escapament modificat o molt sorollós?", points: 1 },
  { text: "Permets als teus animals de companyia bordar o fer soroll sense controlar-los?", points: 1 },
  { text: "Has participat en manifestacions o protestes?", points: 1 },
  { text: "Toques el clàxon del cotxe sovint, fins i tot quan no és estrictament necessari?", points: 1 },
  { text: "Quan tens reunions familiars o amb amics, us adoneu si esteu fent massa soroll?", points: 1 },
  { text: "Has fet festes a casa sense tenir en compte el descans dels veïns?", points: 1 },
];

export default function SorollApp() {
  const [page, setPage] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    if (page === 0) {
      const timer = setTimeout(() => setPage(1), 3000);
      return () => clearTimeout(timer);
    }
    if (page === 1) {
      const timer = setTimeout(() => setPage(2), 3000);
      return () => clearTimeout(timer);
    }
  }, [page]);

  const handleStart = () => setPage(3);
  const handleSpace = () => {
    if (page === 3) setPage(4);
  };

  const handleAnswer = (yes) => {
    const current = QUESTIONS[questionIndex];
    const newScore = score + (yes ? current.points : 0);
    setScore(newScore);
    if (yes && !sound) setSound(true);
    const next = questionIndex + 1;
    if (next < QUESTIONS.length) {
      setQuestionIndex(next);
    } else {
      if (newScore >= 7) {
        setPage(5);
      } else {
        setPage(6);
      }
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") handleSpace();
      if (page === 4) {
        if (e.code === "ArrowRight") handleAnswer(true);
        if (e.code === "ArrowLeft") handleAnswer(false);
      }
      if (page === 5 && (e.code === "Space" || e.type === "click")) setPage(7);
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("click", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("click", handleKey);
    };
  }, [page, questionIndex, score]);

  useEffect(() => {
    if (page === 8) {
      const timer = setTimeout(() => setPage(9), 10000);
      return () => clearTimeout(timer);
    }
  }, [page]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-white bg-black text-center p-4">
      {page === 0 && <img src="/logo.png" className="w-48" alt="Soroll" />}
      {page === 1 && (
        <>
          <div className="absolute top-4 left-4">
            <img src="/logo.png" className="w-12" alt="Soroll" />
          </div>
          <h1 className="text-2xl">Quan va ser la ultima vegada que vas notar el silenci?</h1>
        </>
      )}
      {page === 2 && (
        <button onClick={handleStart} className="mt-8 p-4 border border-white">
          Començar
        </button>
      )}
      {page === 3 && (
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
      )}
      {page === 4 && (
        <div>
          <h2 className="text-xl mb-4">{QUESTIONS[questionIndex].text}</h2>
          <p className="text-sm">Fletxa esquerra = NO | Fletxa dreta = SI</p>
        </div>
      )}
      {page === 5 && <h1 className="text-2xl">El sistema ha colapsat. Desitjes reiniciar el sistema?</h1>}
      {page === 6 && <h1 className="text-2xl">Gràcies per tenir cura del silenci. Continua així.</h1>}
      {page === 7 && <h2 className="text-xl">Restablint sistema...</h2>}
      {page === 8 && (
        <p>
          La contaminació acústica a Barcelona és un problema de salut pública. Segons
          l’Atles de Resiliència de l’Ajuntament de Barcelona, durant el dia els nivells de
          soroll oscil·len entre 55 i 70 decibels dB(A), i a la nit entre 50 i 65 dB(A).
          L’exposició pot provocar trastorns del son, estrès, hipertensió, malalties
          cardiovasculars, deteriorament cognitiu i pèrdua auditiva.
        </p>
      )}
      {page === 9 && (
        <div>
          <p className="text-2xl mb-4">El silenci parla. Escolta.</p>
          <img src="/logo_white.png" className="w-48" alt="Soroll" />
        </div>
      )}
      {sound && <audio src="/background-sound.mp3" autoPlay loop volume={0.2} />}
    </div>
  );
}
