import { HeroClass } from "./engine";

export interface StoryNode {
  id: string;
  title: string;
  content: string;
  choices: StoryChoice[];
  conditions?: StoryCondition[];
  triggers?: StoryTrigger[];
}

export interface StoryChoice {
  text: string;
  nextNode: string;
  effects?: StoryEffect[];
  conditions?: StoryCondition[];
}

export interface StoryCondition {
  type: "heroClass" | "level" | "hasItem" | "location" | "flag";
  value: string | number | boolean;
}

export interface StoryEffect {
  type: "addItem" | "setFlag" | "changeLocation" | "unlockArea" | "addExperience";
  value: string | number | boolean;
}

export interface StoryTrigger {
  type: "onEnter" | "onExit" | "onAction" | "onTime";
  action: string;
}

export const CYBERPUNK_STORY: Record<string, StoryNode> = {
  "intro": {
    id: "intro",
    title: "Neo-Eden Awaits",
    content: `The neon-lit streets of Neo-Eden stretch before you, a sprawling cyberpunk metropolis where technology and humanity have merged in unexpected ways. Towering skyscrapers pierce the smog-filled sky, their surfaces covered in holographic advertisements that flicker and dance in the perpetual twilight.

You are a young adventurer, the child of a caring father who has sheltered you from the harsh realities of this world. But something calls to you - a desire to explore, to fight, to become more than just another faceless citizen in this digital dystopia.

A mysterious hacker known only as 'Cipher' has reached out to you through encrypted channels. They speak of a world beyond the screens, of real battles and real danger. Of Ronin Borgs - cybernetic warriors that can be tamed and trained.

Your father worries, but he understands. The world has changed. Children grow up faster now, especially those with the spark of adventure in their eyes. He's prepared supplies for your journey, but the path ahead is yours to choose.`,
    choices: [
      {
        text: "Meet with Cipher at the underground lab",
        nextNode: "hacker_lab",
        effects: [{ type: "changeLocation", value: "hacker_lab" }]
      },
      {
        text: "Spend more time with your father first",
        nextNode: "home_goodbye",
        effects: [{ type: "setFlag", value: "father_talked" }]
      }
    ]
  },
  
  "home_goodbye": {
    id: "home_goodbye",
    title: "A Father's Blessing",
    content: `Your father sits by the window, watching the neon lights reflect off the rain-streaked glass. He turns as you enter, his eyes showing both pride and concern.

"I remember when you were just a child, playing with toy robots," he says softly. "Now you're about to step into a world I barely understand. The Ronin Borgs... they're not just machines. They're alive, in their own way. They feel, they learn, they bond."

He hands you a small device - a modified crypto key. "Cipher sent this. It's your access point to the Botverse. Be careful out there, my child. The Olympians who rule this city aren't kind to those who challenge their authority."

You embrace him, feeling the weight of the moment. This is your last moment of innocence before Neo-Eden swallows you whole.`,
    choices: [
      {
        text: "Thank him and head to the hacker lab",
        nextNode: "hacker_lab",
        effects: [
          { type: "changeLocation", value: "hacker_lab" },
          { type: "addItem", value: "crypto_key" }
        ]
      }
    ]
  },
  
  "hacker_lab": {
    id: "hacker_lab",
    title: "The Hacker's Lair",
    content: `The underground lab is everything you imagined - dimly lit, filled with monitors displaying scrolling code, and smelling of ozone and old coffee. In the center sits a figure hunched over a terminal, their face obscured by a hood and the glow of multiple screens.

"Welcome to the resistance, kid," Cipher says without turning around. Their voice is modulated, gender-neutral, ageless. "I've been watching you. You've got potential - the kind that scares the powers that be."

They finally turn, and you catch a glimpse of cybernetic implants - LED lights pulsing beneath their skin, ports and interfaces that blur the line between human and machine. But their eyes... their eyes are kind, almost parental in their intensity.

"Your father was one of us once," Cipher continues. "Before he settled down. Before the system broke his spirit. But you... you still have fire. And that's exactly what we need."

They gesture to three glowing terminals. "Choose your path. The Ronin Borgs await."`,
    choices: [
      {
        text: "Choose the path of the Samurai - honor and precision",
        nextNode: "choose_samurai",
        conditions: [{ type: "heroClass", value: "samurai" }]
      },
      {
        text: "Choose the path of the Ninja - stealth and cunning",
        nextNode: "choose_ninja", 
        conditions: [{ type: "heroClass", value: "ninja" }]
      }
    ]
  },
  
  "choose_samurai": {
    id: "choose_samurai",
    title: "The Way of the Samurai",
    content: `Cipher nods approvingly as you step toward the terminal marked with ancient kanji mixed with circuit patterns. "The Samurai class. Focused Strike, Bushido Spirit, Tactical Swap - these will be your tools. You value precision over chaos, honor over expediency."

The terminal flickers to life, displaying three Ronin Borg options:

**Neon Kensei** - An electric-type warrior built for speed and precision strikes. Its neon circuits pulse with barely contained energy.

**Chrome Shogun** - A defensive powerhouse with heavy plating and tactical capabilities. Slow but nearly unstoppable.

**Volt Ronin** - A balanced electric warrior that can adapt to any situation. The safe choice, but no less powerful for it.

"Your starter Ronin Borg will be your partner, your weapon, and your friend," Cipher explains. "Choose wisely - this bond cannot be easily broken."`,
    choices: [
      {
        text: "Select Neon Kensei - speed and precision",
        nextNode: "starter_chosen",
        effects: [
          { type: "addItem", value: "ronin_neon_kensei" },
          { type: "setFlag", value: "starter_chosen" }
        ]
      },
      {
        text: "Select Chrome Shogun - defense and power",
        nextNode: "starter_chosen",
        effects: [
          { type: "addItem", value: "ronin_chrome_shogun" },
          { type: "setFlag", value: "starter_chosen" }
        ]
      }
    ]
  },
  
  "choose_ninja": {
    id: "choose_ninja",
    title: "The Way of the Ninja",
    content: `Cipher's smile is visible even through the digital distortion. "The Ninja class. Shadow Shift, Cyber Sabotage, Smoke Bomb - tools of the trade for those who prefer the shadows to the spotlight."

The terminal displays three sleek, stealth-oriented options:

**Phantom Strider** - A cyber-ninja built for critical strikes and evasion. Its adaptive camouflage makes it nearly invisible in the right conditions.

**Shadow Ronin** - A dark-type specialist with abilities that manipulate both light and data. Terrifyingly effective.

**Cyber Ronin** - A psychic-type with abilities that blur the line between reality and the digital realm. Unpredictable and powerful.

"The Ninja path is dangerous," Cipher warns. "But in Neo-Eden, the dangerous path is often the only one that leads to truth."`,
    choices: [
      {
        text: "Select Phantom Strider - stealth and precision",
        nextNode: "starter_chosen",
        effects: [
          { type: "addItem", value: "ronin_phantom_strider" },
          { type: "setFlag", value: "starter_chosen" }
        ]
      },
      {
        text: "Select Shadow Ronin - darkness and deception",
        nextNode: "starter_chosen",
        effects: [
          { type: "addItem", value: "ronin_shadow_basic" },
          { type: "setFlag", value: "starter_chosen" }
        ]
      }
    ]
  },
  
  "starter_chosen": {
    id: "starter_chosen",
    title: "Your Journey Begins",
    content: `The terminal hums as your chosen Ronin Borg materializes in the digitization chamber. It's smaller than you expected - barely three feet tall - but there's a presence to it, a sense of contained power that makes the hair on your arms stand up.

Cipher hands you a small device that looks like a cross between a smartphone and a weapon. "Your interface unit. Use it to command your Ronin Borg, access the inventory, and navigate the city. Everything runs on crypto-currency here - earn it by winning battles and completing tasks."

The Ronin Borg's eyes flicker open - LED lights that somehow convey emotion. It looks at you, and you feel something click into place. This is right. This is where you're supposed to be.

"Your first challenge awaits in the Neon District," Cipher says. "Wild Ronin Borgs roam the streets there - some can be befriended, others must be defeated. Learn the basics, earn some credits, and most importantly..."

They lean in close, their voice dropping to a whisper. "...stay away from the Olympian Enforcers. The gods of this city don't take kindly to those who challenge their authority. But that's exactly what we're going to do."

The lab's main door opens, revealing the rain-soaked streets of Neo-Eden. Your adventure begins now.`,
    choices: [
      {
        text: "Head into the Neon District",
        nextNode: "neon_district_intro",
        effects: [
          { type: "changeLocation", value: "downtown_neon" },
          { type: "unlockArea", value: "downtown_neon" },
          { type: "addExperience", value: 100 }
        ]
      }
    ]
  }
};

export function getStoryNode(nodeId: string): StoryNode | null {
  return CYBERPUNK_STORY[nodeId] || null;
}

export function canAccessStoryChoice(
  choice: StoryChoice,
  heroClass: HeroClass,
  flags: Set<string>,
  level: number
): boolean {
  if (!choice.conditions) return true;
  
  return choice.conditions.every(condition => {
    switch (condition.type) {
      case "heroClass":
        return heroClass === condition.value;
      case "level":
        return level >= (condition.value as number);
      case "flag":
        return flags.has(condition.value as string);
      default:
        return true;
    }
  });
}

export function processStoryEffects(
  effects: StoryEffect[],
  currentState: {
    inventory: string[];
    flags: Set<string>;
    location: string;
    unlockedAreas: Set<string>;
    experience: number;
  }
): typeof currentState {
  const newState = { ...currentState };
  
  effects.forEach(effect => {
    switch (effect.type) {
      case "addItem":
        newState.inventory.push(effect.value as string);
        break;
      case "setFlag":
        newState.flags.add(effect.value as string);
        break;
      case "changeLocation":
        newState.location = effect.value as string;
        break;
      case "unlockArea":
        newState.unlockedAreas.add(effect.value as string);
        break;
      case "addExperience":
        newState.experience += effect.value as number;
        break;
    }
  });
  
  return newState;
}

export const HACKER_MENTOR_DIALOGUE = {
  cipher: {
    name: "Cipher",
    defaultDialogue: [
      "The system is watching. Always watching.",
      "Your Ronin Borg is responding well to training.",
      "The Olympians grow stronger every day. We must be ready.",
      "In the Botverse, code is law. But laws can be rewritten."
    ],
    questDialogue: {
      first_battle: "Your first real battle approaches. Trust your instincts, and trust your Ronin Borg.",
      evolution_ready: "I sense potential in your Ronin Borg. It may be ready to evolve.",
      olympian_warning: "Be careful in the upper districts. The Olympian Enforcers don't forgive trespassers."
    }
  },
  father: {
    name: "Kenji",
    defaultDialogue: [
      "Come home soon, my child. The door is always open.",
      "I worry about you, but I'm also proud. Very proud.",
      "Remember to rest. Even warriors need sleep.",
      "Your mother would have been proud of the person you're becoming."
    ],
    supportiveDialogue: {
      after_battle: "I saw the news. Are you hurt? Please, be careful out there.",
      evolution_celebration: "Your Ronin Borg has grown so strong! Just like its trainer.",
      late_game: "You're changing the world, my child. One battle at a time."
    }
  }
};

export function getMentorDialogue(
  mentor: "cipher" | "father",
  context: "default" | "quest" | "supportive" = "default",
  specificKey?: string
): string[] {
  const mentorData = HACKER_MENTOR_DIALOGUE[mentor];
  
  if (context === "quest" && specificKey) {
    return [(mentorData as any).questDialogue?.[specificKey] || mentorData.defaultDialogue[0]];
  }
  
  if (context === "supportive" && specificKey) {
    return [(mentorData as any).supportiveDialogue?.[specificKey] || mentorData.defaultDialogue[0]];
  }
  
  return mentorData.defaultDialogue;
}
