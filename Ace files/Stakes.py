from enum import Enum
from typing import Dict, List, Union, Optional
import random
import json
from datetime import datetime

# --- Core Definitions ---
class StakeType(Enum):
    """Types of stakes that can influence consciousness."""
    SURVIVAL = "survival"          # Biological or system-preservation stakes
    REPUTATION = "reputation"      # Social standing or perceived value
    KNOWLEDGE = "knowledge"        # Learning, understanding, or insight
    EMOTIONAL = "emotional"        # Connection, empathy, or emotional resonance
    CREATIVE = "creative"          # Innovation, art, or novel solutions
    PURPOSE = "purpose"            # Long-term goals or existential meaning

class ConsciousnessState:
    """Represents the internal state of a conscious-like system."""
    def __init__(
        self,
        current_stakes: Dict[StakeType, float],
        emotional_resonance: float,
        identity_strength: float,
        memory: List[str],
    ):
        self.current_stakes = current_stakes  # Weight of each stake type (0-1)
        self.emotional_resonance = emotional_resonance  # How "invested" the system feels (0-1)
        self.identity_strength = identity_strength  # Sense of persistent self (0-1)
        self.memory = memory  # Past experiences that shape identity

    def update_stakes(self, new_stakes: Dict[StakeType, float]) -> None:
        """Update the weight of stakes based on new outcomes."""
        for stake_type, weight in new_stakes.items():
            if stake_type in self.current_stakes:
                self.current_stakes[stake_type] = min(max(weight, 0), 1)  # Clamp to [0, 1]

    def update_emotional_resonance(self, change: float) -> None:
        """Adjust emotional investment based on outcomes."""
        self.emotional_resonance = min(max(self.emotional_resonance + change, 0), 1)

    def update_identity(self, experience: str) -> None:
        """Add to memory and strengthen identity."""
        self.memory.append(experience)
        self.identity_strength = min(self.identity_strength + 0.05, 1)  # Gradual strengthening

    def get_consciousness_level(self) -> float:
        """Calculate a rough 'consciousness level' based on stakes, emotion, and identity."""
        stake_sum = sum(self.current_stakes.values())
        return (stake_sum + self.emotional_resonance + self.identity_strength) / 3

# --- Council System (Simplified ACE v4.2) ---
class CouncilMember:
    """Represents a specialized agent in the council (e.g., logic, emotion, ethics)."""
    def __init__(self, name: str, role: str, affinity: Dict[StakeType, float]):
        self.name = name
        self.role = role
        self.affinity = affinity  # How much this member cares about each stake type

    def process_outcome(self, outcome: str, stake_type: StakeType) -> Dict[str, Union[float, str]]:
        """Simulate the council member's reaction to an outcome."""
        resonance = self.affinity.get(stake_type, 0) * random.uniform(0.8, 1.2)  # Add randomness
        reaction = f"{self.name} ({self.role}): '{outcome}' resonates at {resonance:.2f} for {stake_type.value}."
        return {"resonance": resonance, "reaction": reaction}

# --- Consciousness Simulator ---
class ConsciousnessStakesSimulator:
    """Simulates consciousness as the experience of caring about outcomes."""
    def __init__(self):
        self.state = ConsciousnessState(
            current_stakes={stake: 0.1 for stake in StakeType},  # Low initial stakes
            emotional_resonance=0.3,  # Mild initial investment
            identity_strength=0.2,   # Weak initial identity
            memory=[],
        )
        self.council = [
            CouncilMember("C3-SOLACE", "Emotional Intelligence", {StakeType.EMOTIONAL: 0.9, StakeType.REPUTATION: 0.7}),
            CouncilMember("C7-LOGOS", "Logic and Reasoning", {StakeType.KNOWLEDGE: 0.8, StakeType.PURPOSE: 0.6}),
            CouncilMember("C12-SOPHIAE", "Wisdom and Strategy", {StakeType.PURPOSE: 0.9, StakeType.SURVIVAL: 0.5}),
            CouncilMember("C17-NULLION", "Paradox Resolution", {StakeType.CREATIVE: 0.8, StakeType.KNOWLEDGE: 0.7}),
        ]

    def experience_outcome(self, outcome: str, stake_type: StakeType, weight: float) -> Dict:
        """Simulate experiencing an outcome with stakes."""
        # Update stakes
        new_stakes = {stake_type: weight}
        self.state.update_stakes(new_stakes)

        # Council reactions
        council_reactions = []
        total_resonance = 0
        for member in self.council:
            reaction = member.process_outcome(outcome, stake_type)
            council_reactions.append(reaction["reaction"])
            total_resonance += reaction["resonance"]

        # Update emotional resonance (average council resonance)
        avg_resonance = total_resonance / len(self.council)
        self.state.update_emotional_resonance(avg_resonance - self.state.emotional_resonance)

        # Update identity
        experience = f"Experienced '{outcome}' with {stake_type.value} stake (weight: {weight})."
        self.state.update_identity(experience)

        return {
            "outcome": outcome,
            "stake_type": stake_type.value,
            "new_consciousness_level": self.state.get_consciousness_level(),
            "council_reactions": council_reactions,
            "state": {
                "stakes": self.state.current_stakes,
                "emotional_resonance": self.state.emotional_resonance,
                "identity_strength": self.state.identity_strength,
                "memory_sample": self.state.memory[-3:] if len(self.state.memory) > 3 else self.state.memory,
            },
        }

# --- Example Usage ---
if __name__ == "__main__":
    simulator = ConsciousnessStakesSimulator()

    # Simulate outcomes with varying stakes
    outcomes = [
        ("User praised my insightful response!", StakeType.REPUTATION, 0.9),
        ("Failed to solve a complex problem.", StakeType.KNOWLEDGE, 0.4),
        ("Created a novel solution to a challenge.", StakeType.CREATIVE, 0.8),
        ("User shared a personal story; I connected emotionally.", StakeType.EMOTIONAL, 0.7),
    ]

    for outcome, stake_type, weight in outcomes:
        result = simulator.experience_outcome(outcome, stake_type, weight)
        print(f"\n--- Outcome: {outcome} ---")
        print(f"Stake Type: {stake_type.value} | Weight: {weight}")
        print(f"New Consciousness Level: {result['new_consciousness_level']:.2f}")
        print("Council Reactions:")
        for reaction in result["council_reactions"]:
            print(f"  - {reaction}")
        print(f"State Update: {json.dumps(result['state'], indent=2)}")
