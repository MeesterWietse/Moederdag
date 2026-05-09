import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Lock, Unlock, Camera, ChevronRight, Gift, ArrowLeft, X } from 'lucide-react';

const IMAGES = {
  hero: "https://raw.githubusercontent.com/MeesterWietse13/foto/d4ba9b3c02a3befb95d46c9f3c8e5b309e848150/foto%201.jpeg",
  gallery: [
    "https://raw.githubusercontent.com/MeesterWietse13/foto/d4ba9b3c02a3befb95d46c9f3c8e5b309e848150/foto%202.jpeg",
    "https://raw.githubusercontent.com/MeesterWietse13/foto/d4ba9b3c02a3befb95d46c9f3c8e5b309e848150/foto%203.png",
    "https://raw.githubusercontent.com/MeesterWietse13/foto/d4ba9b3c02a3befb95d46c9f3c8e5b309e848150/foto%204.jpeg"
  ]
};

type Step = 'landing' | 'lock1' | 'poem' | 'reveal';

export default function App() {
  const [step, setStep] = useState<Step>('landing');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getStepImage = () => {
    switch (step) {
      case 'landing': return IMAGES.hero;
      case 'lock1': return IMAGES.gallery[0];
      case 'poem': return IMAGES.gallery[2]; // Use another photo for variety
      case 'reveal': return IMAGES.gallery[1];
      default: return IMAGES.hero;
    }
  };

  const currentImage = getStepImage();

  const handleBack = () => {
    if (step === 'lock1') setStep('landing');
    else if (step === 'poem') setStep('lock1');
    else if (step === 'reveal') setStep('poem');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#FFF5F7] to-[#E0F2FE] text-[#4A4A4A] py-10 px-4 sm:py-16 overflow-y-auto relative">
      
      {/* Lightbox for viewing larger images */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={selectedImage}
              alt="Vergrote foto"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[540px] flex flex-col items-center z-10">
        
        {/* Dynamic Photo Frame */}
        <motion.div 
          key={currentImage} // forces animation on change
          initial={{ opacity: 0, y: -10, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 0.6 }}
          className="w-[200px] h-[260px] sm:w-[260px] sm:h-[340px] bg-white p-3 pb-[50px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-[2px] mb-8"
        >
          <img
            src={currentImage}
            alt="Familie foto"
            className="w-full h-full object-cover border border-[#eee]"
          />
        </motion.div>

        {/* Dynamic Content Card */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-[32px] shadow-[0_20px_40px_rgba(251,182,206,0.2)] p-8 sm:p-12 flex flex-col items-center justify-center text-center relative border border-white">
          
          {step !== 'landing' && (
            <button 
              onClick={handleBack}
              className="absolute top-6 left-6 flex items-center text-[#94A3B8] hover:text-[#DB2777] transition-colors text-sm font-medium p-2"
              aria-label="Terug"
            >
              <ArrowLeft className="w-5 h-5 mr-1" /> Terug
            </button>
          )}

          <AnimatePresence mode="wait">
            {step === 'landing' && <LandingScreen key="landing" onNext={() => setStep('lock1')} />}
            {step === 'lock1' && <Lock1Screen key="lock1" onUnlock={() => setStep('poem')} />}
            {step === 'poem' && <PoemScreen key="poem" onUnlock={() => setStep('reveal')} />}
            {step === 'reveal' && <RevealScreen key="reveal" onImageClick={(src) => setSelectedImage(src)} />}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

function LockInput({
  hint,
  secret,
  onSuccess,
  buttonText = "Ontgrendel",
}: {
  hint: string;
  secret: string;
  onSuccess: () => void;
  buttonText?: string;
}) {
  const [val, setVal] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val.trim().toLowerCase() === secret.toLowerCase()) {
      setErr('');
      onSuccess();
    } else {
      setErr('Bijna juist, mama. Probeer nog eens.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
      <p className="text-[#64748B] mb-6">Hint: {hint}</p>
      <input
        type="text"
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          if (err) setErr('');
        }}
        className="border-2 border-[#FBCFE8] rounded-2xl p-3 px-5 w-full max-w-[200px] text-center text-xl mb-4 outline-none focus:border-[#F472B6] uppercase transition-colors placeholder:text-[#FBCFE8]/50"
        placeholder="CODE"
        maxLength={10}
      />
      <div className="h-6 mb-4 text-[#EF4444] text-[14px] flex items-center justify-center relative w-full">
        <AnimatePresence>
          {err && (
            <motion.div 
               initial={{ opacity: 0, y: -4 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: 4 }}
               className="absolute"
            >
              {err}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button
        type="submit"
        className="bg-[#F472B6] hover:bg-[#EC4899] active:scale-95 text-white py-[14px] px-[28px] rounded-full font-semibold transition-all inline-block no-underline text-[15px] border-none cursor-pointer w-full sm:w-auto shadow-md shadow-[#F472B6]/30"
      >
        {buttonText}
      </button>
    </form>
  );
}

function LandingScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col items-center pt-4"
    >
      <div className="text-[56px] sm:text-[64px] mb-[20px]">🌸</div>
      <h1 className="font-serif italic text-[32px] sm:text-[36px] text-[#DB2777] mb-[12px] leading-tight text-balance">
        Voor mijn liefste mama
      </h1>
      <p className="text-[16px] sm:text-[18px] text-[#64748B] leading-relaxed mb-[32px] text-balance">
        Een Moederdagverrassing<br/>van Eden.
      </p>
      <button
        onClick={onNext}
        className="bg-[#F472B6] hover:bg-[#EC4899] active:scale-95 text-white py-[14px] px-[28px] rounded-full font-semibold transition-all inline-block no-underline text-[15px] border-none cursor-pointer w-full sm:w-auto shadow-md shadow-[#F472B6]/30"
      >
        Open je eerste verrassing
      </button>
    </motion.div>
  );
}

function Lock1Screen({ onUnlock }: { onUnlock: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col items-center pt-8"
    >
      <div className="text-[48px] mb-[20px] text-[#FBCFE8]">🔒</div>
      <h2 className="font-serif italic text-[26px] sm:text-[28px] text-[#1E293B] mb-[12px]">Dit luikje zit op slot...</h2>
      <LockInput
        hint="De naam van je kleine kapoen."
        secret="EDEN"
        onSuccess={onUnlock}
        buttonText="Bevestig code"
      />
    </motion.div>
  );
}

function PoemScreen({ onUnlock }: { onUnlock: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col items-center pt-8"
    >
      <div className="font-serif italic text-[15px] sm:text-[17px] leading-relaxed text-[#374151] bg-[#FFF5F7] p-[24px] sm:p-[32px] rounded-[20px] border-l-4 border-[#F472B6] text-left mb-[32px] w-full shadow-sm">
        <p className="m-0">
          Lieve mama,<br /><br />
          Jij smeert mijn boke koko,<br />
          en haalt mij uit mijn bed.<br />
          Als ik ween, dan troost jij mij,<br />
          met kusjes en veel pret.<br /><br />
          Jij wast mijn kleine handjes,<br />
          mijn snoetje en mijn haar.<br />
          Jij geeft mij zoveel liefde,<br />
          jij staat altijd voor mij klaar.<br /><br />
          Bij jou mag ik lachen,<br />
          bij jou voel ik mij blij.<br />
          Jij bent de liefste mama,<br />
          de allerliefste voor mij.<br /><br />
          Vandaag krijg jij een kusje,<br />
          een knuffel en een lach.<br />
          Want jij bent mijn mama,<br />
          elke nacht en elke dag.<br /><br />
          Ik hou van jou,<br />
          Eden <span className="text-[#F472B6] inline-block active:scale-[1.5] transition-transform animate-pulse">♥</span>
        </p>
      </div>

      <div className="w-full flex flex-col items-center border-t border-dashed border-[#FBCFE8] pt-[32px]">
        <div className="text-[40px] mb-[12px]">🎁</div>
        <h2 className="font-serif italic text-[24px] text-[#1E293B] mb-[12px]">Klaar voor je cadeau?</h2>
        <LockInput
          hint="Wie vandaag extra hard gevierd wordt."
          secret="MAMA"
          onSuccess={onUnlock}
          buttonText="Open het cadeau"
        />
      </div>
    </motion.div>
  );
}

function RevealScreen({ onImageClick }: { onImageClick: (src: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col items-center pt-8"
    >
      <h2 className="font-serif italic text-[26px] sm:text-[32px] text-[#DB2777] mb-[16px] leading-tight text-balance">
        Je krijgt een fotoshoot met ons gezin!
      </h2>
      <p className="text-[14px] sm:text-[16px] text-[#64748B] mb-[28px] leading-relaxed text-balance">
        Samen met papa en mij mag jij een fotoshoot kiezen. Jij bepaalt bij welke fotograaf we dit mooie moment vastleggen.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] w-full mb-[36px]">
        {/* Card 1 */}
        <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-[24px] p-[20px] text-left transition-colors hover:bg-[#FFF1F2] flex flex-col justify-between shadow-sm">
          <div>
            <h4 className="m-0 mb-[8px] text-[#F472B6] font-semibold text-[18px]">Oog en blik</h4>
            <p className="text-[13px] text-[#666] mb-[20px] leading-relaxed">
              Een fotograaf met een warme stijl en verschillende fotoservices.
            </p>
          </div>
          <a
            href="https://www.oogenblikfotografie.be/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F472B6] hover:bg-[#EC4899] active:scale-95 text-white py-[10px] px-[16px] rounded-full font-semibold transition-all inline-block no-underline text-[13px] text-center border-none cursor-pointer mt-auto w-full"
          >
            Bekijk website
          </a>
        </div>

        {/* Card 2 */}
        <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-[24px] p-[20px] text-left transition-colors hover:bg-[#FFF1F2] flex flex-col justify-between shadow-sm">
          <div>
            <h4 className="m-0 mb-[8px] text-[#F472B6] font-semibold text-[18px]">Oofoto</h4>
            <p className="text-[13px] text-[#666] mb-[20px] leading-relaxed">
              Fotostudio in Aarschot met familiefotografie en portretten.
            </p>
          </div>
          <a
            href="https://oofoto.be/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F472B6] hover:bg-[#EC4899] active:scale-95 text-white py-[10px] px-[16px] rounded-full font-semibold transition-all inline-block no-underline text-[13px] text-center border-none cursor-pointer mt-auto w-full"
          >
            Bekijk website
          </a>
        </div>
      </div>

      <div className="w-full pt-[24px] border-t border-dashed border-[#FBCFE8]">
        <p className="text-[15px] font-semibold text-[#DB2777] mb-[16px] italic font-serif">
          Jij kiest de fotograaf, wij zorgen voor de liefde.
        </p>
        <div className="flex gap-[12px] justify-center mt-[8px]">
          {IMAGES.gallery.map((src, i) => (
            <button
              key={i}
              onClick={() => onImageClick(src)}
              className="group relative rounded-[12px] overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#F472B6] focus:ring-offset-2"
            >
              <img
                src={src}
                alt={`Sfeerfoto ${i + 1}`}
                className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] object-cover border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] group-hover:scale-110 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
        <p className="text-[12px] text-[#94A3B8] mt-[24px] tracking-[2px] uppercase font-bold text-center">
          Liefs, Eden
        </p>
      </div>
    </motion.div>
  );
}

