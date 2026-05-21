import { useState } from "react";
import { HeroClass } from "../game/engine";
import { STARTER_RONIN_BORGS, type StarterRoninBorg } from "../game/starterRoninBorgs";
import { playSound } from "../game/audioManager";
import { AnimatedRoninBorg } from "../components/AnimatedRoninBorg";
import { createRoninBorg } from "../game/roninBorgDatabase";

interface StarterSelectionProps {
  heroClass: HeroClass;
  onSelect: (starter: StarterRoninBorg) => void;
  onBack: () => void;
}

const TYPE_COLORS: Record<string, { primary: string; secondary: string; emoji: string }> = {
  electric: { primary: "#ffff00", secondary: "#ffd700", emoji: "⚡" },
  water: { primary: "#00bfff", secondary: "#1e90ff", emoji: "💧" },
  fire: { primary: "#ff4500", secondary: "#ff6347", emoji: "🔥" },
  grass: { primary: "#32cd32", secondary: "#228b22", emoji: "🌿" },
  psychic: { primary: "#ff69b4", secondary: "#da70d6", emoji: "🔮" },
  dark: { primary: "#4b0082", secondary: "#8b008b", emoji: "🌑" },
  normal: { primary: "#a9a9a9", secondary: "#808080", emoji: "⚪" }
};

export function StarterSelection({ heroClass, onSelect, onBack }: StarterSelectionProps) {
  const [selectedStarter, setSelectedStarter] = useState<StarterRoninBorg | null>(null);
  const [hoveredStarter, setHoveredStarter] = useState<StarterRoninBorg | null>(null);

  // Filter starters by hero class
  const availableStarters = STARTER_RONIN_BORGS.filter(starter => {
    if (heroClass === HeroClass.NINJA) {
      return starter.recommendedHeroClass === HeroClass.NINJA;
    }
    return starter.recommendedHeroClass === HeroClass.SAMURAI || starter.name === "Chrome Shogun";
  });

  const handleSelect = (starter: StarterRoninBorg) => {
    setSelectedStarter(starter);
    playSound("menu", 0.4);
  };

  const handleConfirm = () => {
    if (selectedStarter) {
      playSound("levelup", 0.6);
      onSelect(selectedStarter);
    }
  };

  const displayStarter = hoveredStarter || selectedStarter;
  const typeInfo = displayStarter ? TYPE_COLORS[STARTER_RONIN_BORGS.find(s => s.name === displayStarter.name)?.baseStats ? "normal" : "electric"] : null;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 opacity-15">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
          CHOOSE YOUR FIRST RONIN BORG
        </h1>
        <p className="text-cyan-300 text-lg font-mono">
          {heroClass === HeroClass.SAMURAI 
            ? "Samurai Class: Focus on balanced or defensive starters" 
            : "Ninja Class: Choose speed and critical strike specialists"}
        </p>
      </div>

      {/* Starter cards */}
      <div className="relative z-10 flex gap-8 mb-8">
        {availableStarters.map((starter) => {
          const isSelected = selectedStarter?.name === starter.name;
          const typeColor = TYPE_COLORS[starter.baseStats ? "normal" : "electric"] || TYPE_COLORS.normal;
          
          return (
            <button
              key={starter.speciesId}
              onClick={() => handleSelect(starter)}
              onMouseEnter={() => {
                setHoveredStarter(starter);
                playSound("menu", 0.2);
              }}
              onMouseLeave={() => setHoveredStarter(null)}
              className={`
                relative w-72 h-[28rem] rounded-2xl overflow-hidden transition-all duration-500 group
                ${isSelected 
                  ? 'ring-4 ring-white scale-105' 
                  : 'ring-2 ring-white/20 hover:ring-white/50'
                }
              `}
              style={{
                background: `linear-gradient(135deg, ${typeColor.primary}30 0%, ${typeColor.secondary}50 100%)`,
                boxShadow: isSelected 
                  ? `0 0 60px ${typeColor.primary}80, inset 0 0 40px ${typeColor.secondary}40`
                  : `0 10px 40px rgba(0,0,0,0.4)`
              }}
            >
              {/* Hologram scanline effect */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-b from-transparent via-white/10 to-transparent animate-pulse" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col p-6">
                {/* Type badge */}
                <div 
                  className="self-start px-3 py-1 rounded-full text-xs font-bold text-black mb-4"
                  style={{ background: typeColor.primary }}
                >
                  {typeColor.emoji} {starter.recommendedHeroClass.toUpperCase()}
                </div>

                {/* Animated Ronin Borg */}
                <div className="w-48 h-48 mx-auto mb-2 flex items-center justify-center">
                  <AnimatedRoninBorg 
                    roninBorg={createRoninBorg(starter.speciesId, 5, starter.startingParts)}
                    size="medium"
                    animation={isSelected ? "victory" : hoveredStarter?.name === starter.name ? "attack" : "idle"}
                  />
                </div>

                {/* Name and description */}
                <h2 className="text-2xl font-bold text-white mb-2 text-center">
                  {starter.name}
                </h2>
                <p className="text-white/80 text-sm mb-4 text-center leading-relaxed">
                  {starter.description}
                </p>

                {/* Stats */}
                <div className="mt-auto space-y-2">
                  <div className="flex justify-between text-xs font-mono text-white/90">
                    <span>HP</span>
                    <div className="flex-1 mx-2 bg-black/30 rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(starter.baseStats.hp / 150) * 100}%`,
                          background: `linear-gradient(90deg, ${typeColor.primary}, ${typeColor.secondary})`
                        }}
                      />
                    </div>
                    <span className="w-8 text-right">{starter.baseStats.hp}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-white/90">
                    <span>ATK</span>
                    <div className="flex-1 mx-2 bg-black/30 rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(starter.baseStats.atk / 150) * 100}%`,
                          background: `linear-gradient(90deg, ${typeColor.primary}, ${typeColor.secondary})`
                        }}
                      />
                    </div>
                    <span className="w-8 text-right">{starter.baseStats.atk}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-white/90">
                    <span>SPD</span>
                    <div className="flex-1 mx-2 bg-black/30 rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(starter.baseStats.spd / 150) * 100}%`,
                          background: `linear-gradient(90deg, ${typeColor.primary}, ${typeColor.secondary})`
                        }}
                      />
                    </div>
                    <span className="w-8 text-right">{starter.baseStats.spd}</span>
                  </div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <span className="text-black text-xl">✓</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed stats panel */}
      {displayStarter && (
        <div 
          className="relative z-10 w-full max-w-4xl p-6 rounded-2xl mb-6 transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,40,0.9) 100%)',
            border: '2px solid rgba(0,255,255,0.3)',
            boxShadow: '0 0 40px rgba(0,255,255,0.1)'
          }}
        >
          <h3 className="text-xl font-bold text-cyan-400 mb-4 font-mono">
            📊 DETAILED ANALYSIS: {displayStarter.name.toUpperCase()}
          </h3>
          <div className="grid grid-cols-3 gap-6">
            {/* Animated preview */}
            <div className="flex items-center justify-center">
              <AnimatedRoninBorg 
                roninBorg={createRoninBorg(displayStarter.speciesId, 5, displayStarter.startingParts)}
                size="large"
                animation="idle"
              />
            </div>
            <div>
              <h4 className="text-white/80 text-sm mb-2">Base Stats</h4>
              <div className="space-y-1 text-sm font-mono">
                <div className="flex justify-between text-white/70">
                  <span>Health Points:</span>
                  <span className="text-green-400">{displayStarter.baseStats.hp}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Attack Power:</span>
                  <span className="text-red-400">{displayStarter.baseStats.atk}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Defense:</span>
                  <span className="text-blue-400">{displayStarter.baseStats.def}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Speed:</span>
                  <span className="text-yellow-400">{displayStarter.baseStats.spd}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white/80 text-sm mb-2">Starting Equipment</h4>
              <div className="space-y-1 text-sm">
                {Object.entries(displayStarter.startingParts).map(([part, id]) => (
                  <div key={part} className="text-white/60 font-mono text-xs">
                    {part.charAt(0).toUpperCase() + part.slice(1)}: {id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="relative z-10 flex gap-6">
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all border border-white/30 backdrop-blur-sm"
        >
          ← Back to Class
        </button>
        <button
          onClick={handleConfirm}
          disabled={!selectedStarter}
          className={`
            px-12 py-4 rounded-xl font-bold text-lg transition-all
            ${selectedStarter 
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400 shadow-[0_0_30px_rgba(0,255,255,0.5)]' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {selectedStarter ? "BEGIN ADVENTURE →" : "SELECT A RONIN BORG"}
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
