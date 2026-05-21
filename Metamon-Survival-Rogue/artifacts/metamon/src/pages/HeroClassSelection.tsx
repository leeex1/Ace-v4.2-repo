import { useState } from "react";
import { HeroClass } from "../game/engine";
import { playSound } from "../game/audioManager";

interface HeroClassSelectionProps {
  onSelect: (heroClass: HeroClass) => void;
  onBack: () => void;
}

const HERO_CLASSES = [
  {
    id: HeroClass.SAMURAI,
    name: "SAMURAI",
    title: "The Way of Honor",
    description: "Masters of precision and tactical combat. Samurai command their Ronin Borgs with focused strikes and strategic mastery.",
    abilities: [
      "⚔️ Focused Strike - Ignore 30% enemy DEF",
      "🛡️ Bushido Spirit - +20% team defense",
      "⚡ Tactical Swap - Instant part change"
    ],
    color: "#ff6b35",
    accentColor: "#ff4500",
    stats: { hp: 110, atk: 85, def: 75, spd: 60 }
  },
  {
    id: HeroClass.NINJA,
    name: "NINJA",
    title: "Shadows & Circuitry",
    description: "Stealth operatives who manipulate the battlefield. Ninjas use cunning and speed to outmaneuver opponents.",
    abilities: [
      "🌑 Shadow Shift - Force immediate action",
      "💨 Smoke Bomb - Evasion boost",
      "🔌 Cyber Sabotage - Disable enemy parts"
    ],
    color: "#9d00ff",
    accentColor: "#6a0dad",
    stats: { hp: 85, atk: 95, def: 55, spd: 95 }
  }
];

export function HeroClassSelection({ onSelect, onBack }: HeroClassSelectionProps) {
  const [selectedClass, setSelectedClass] = useState<HeroClass | null>(null);
  const [hoveredClass, setHoveredClass] = useState<HeroClass | null>(null);

  const handleSelect = (heroClass: HeroClass) => {
    setSelectedClass(heroClass);
    playSound("menu", 0.4);
  };

  const handleConfirm = () => {
    if (selectedClass) {
      playSound("levelup", 0.5);
      onSelect(selectedClass);
    }
  };

  const displayClass = hoveredClass || selectedClass;
  const classInfo = HERO_CLASSES.find(c => c.id === displayClass);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-scroll 20s linear infinite'
          }}
        />
      </div>

      {/* Title */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
          CHOOSE YOUR PATH
        </h1>
        <p className="text-cyan-300 text-lg font-mono tracking-wider">
          Your hero class determines your command abilities and starting Ronin Borg
        </p>
      </div>

      {/* Class selection cards */}
      <div className="relative z-10 flex gap-8 mb-12">
        {HERO_CLASSES.map((heroClass) => (
          <button
            key={heroClass.id}
            onClick={() => handleSelect(heroClass.id)}
            onMouseEnter={() => {
              setHoveredClass(heroClass.id);
              playSound("menu", 0.2);
            }}
            onMouseLeave={() => setHoveredClass(null)}
            className={`
              relative w-80 h-96 rounded-2xl overflow-hidden transition-all duration-500
              ${selectedClass === heroClass.id 
                ? 'ring-4 ring-white scale-105 shadow-[0_0_50px_rgba(255,255,255,0.3)]' 
                : 'ring-2 ring-white/20 hover:ring-white/60 hover:scale-102'
              }
            `}
            style={{
              background: `linear-gradient(135deg, ${heroClass.color}40 0%, ${heroClass.accentColor}60 100%)`,
              boxShadow: selectedClass === heroClass.id 
                ? `0 0 60px ${heroClass.color}80, inset 0 0 60px ${heroClass.accentColor}40`
                : `0 0 30px ${heroClass.color}40`
            }}
          >
            {/* Glitch effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            
            {/* Class content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
              {/* Class icon placeholder */}
              <div 
                className="w-32 h-32 rounded-full mb-6 flex items-center justify-center text-6xl font-bold"
                style={{ 
                  background: `linear-gradient(135deg, ${heroClass.color}, ${heroClass.accentColor})`,
                  boxShadow: `0 0 40px ${heroClass.color}`
                }}
              >
                {heroClass.id === HeroClass.SAMURAI ? "⚔️" : "🥷"}
              </div>

              <h2 className="text-3xl font-bold text-white mb-2 tracking-wider">
                {heroClass.name}
              </h2>
              <p className="text-sm text-white/80 font-mono mb-4">
                {heroClass.title}
              </p>

              {/* Stats preview */}
              <div className="grid grid-cols-2 gap-2 text-xs text-white/90 font-mono">
                <div>HP: {heroClass.stats.hp}</div>
                <div>ATK: {heroClass.stats.atk}</div>
                <div>DEF: {heroClass.stats.def}</div>
                <div>SPD: {heroClass.stats.spd}</div>
              </div>

              {/* Selection indicator */}
              {selectedClass === heroClass.id && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <span className="text-black text-lg">✓</span>
                </div>
              )}
            </div>

            {/* Animated border */}
            <div 
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: `linear-gradient(90deg, transparent, ${heroClass.color}60, transparent)`,
                animation: 'border-rotate 3s linear infinite'
              }}
            />
          </button>
        ))}
      </div>

      {/* Class details panel */}
      {classInfo && (
        <div 
          className="relative z-10 w-full max-w-4xl p-8 rounded-2xl mb-8 transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${classInfo.color}20 0%, rgba(0,0,0,0.8) 100%)`,
            border: `2px solid ${classInfo.color}60`,
            boxShadow: `0 0 40px ${classInfo.color}30`
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-4" style={{ color: classInfo.color }}>
            Class Abilities
          </h3>
          <p className="text-white/90 mb-6 text-lg leading-relaxed">
            {classInfo.description}
          </p>
          <div className="grid gap-3">
            {classInfo.abilities.map((ability, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 text-white/80 font-mono text-sm p-3 rounded-lg"
                style={{ background: `${classInfo.color}20` }}
              >
                <span className="text-lg">{ability}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="relative z-10 flex gap-6">
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all border border-white/30"
        >
          ← Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={!selectedClass}
          className={`
            px-12 py-4 rounded-xl font-bold text-lg transition-all
            ${selectedClass 
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400 shadow-[0_0_30px_rgba(0,255,255,0.5)]' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {selectedClass ? "CONFIRM SELECTION →" : "SELECT A CLASS"}
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes grid-scroll {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes border-rotate {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
