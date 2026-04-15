#!/usr/bin/env python3
"""
🖥️ Minimal Desktop Agent (Vision + Control Loop)

Features:
- Screenshot capture (vision input)
- LLM decision loop (plug your model)
- Mouse + keyboard control
- CLI fallback (exec tool)
"""

import subprocess
import time
import json
import base64
from io import BytesIO

import pyautogui
from PIL import Image

# =========================
# ⚙️ CONFIG
# =========================

STEP_DELAY = 1.5
MAX_STEPS = 20

GOAL = "Open a browser and search for 'open source ai agents'"


# =========================
# 📸 VISION (SCREEN CAPTURE)
# =========================

def capture_screen():
    img = pyautogui.screenshot()
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    encoded = base64.b64encode(buffered.getvalue()).decode()
    return encoded


# =========================
# 🖱️ ACTION SPACE
# =========================

def click(x, y):
    pyautogui.click(x, y)
    return f"clicked ({x},{y})"

def type_text(text):
    pyautogui.write(text, interval=0.02)
    return f"typed: {text}"

def press(key):
    pyautogui.press(key)
    return f"pressed: {key}"

def hotkey(*keys):
    pyautogui.hotkey(*keys)
    return f"hotkey: {keys}"

def exec_cmd(command):
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    return result.stdout[:1000]


# =========================
# 🧠 MODEL (REPLACE THIS)
# =========================

def call_model(goal, screenshot_b64, history):
    """
    Replace with your actual model (OpenAI, local, Quillan, etc.)

    Expected return:
    {
      "action": "click" | "type" | "press" | "hotkey" | "exec" | "done",
      "args": {...},
      "reason": "why"
    }
    """

    # ⚠️ MOCK LOGIC (replace this)
    if not history:
        return {
            "action": "hotkey",
            "args": {"keys": ["win"]},
            "reason": "Open start menu"
        }

    if len(history) == 1:
        return {
            "action": "type",
            "args": {"text": "chrome"},
            "reason": "Search for browser"
        }

    if len(history) == 2:
        return {
            "action": "press",
            "args": {"key": "enter"},
            "reason": "Launch browser"
        }

    return {"action": "done", "args": {}, "reason": "finished"}


# =========================
# 🔁 AGENT LOOP
# =========================

def run_agent(goal):
    history = []

    print(f"\n🎯 GOAL: {goal}\n")

    for step in range(MAX_STEPS):
        print(f"\n--- STEP {step+1} ---")

        # 👁️ Observe
        screen = capture_screen()

        # 🧠 Decide
        decision = call_model(goal, screen, history)

        action = decision["action"]
        args = decision.get("args", {})
        reason = decision.get("reason", "")

        print(f"🧠 Reason: {reason}")
        print(f"⚙️ Action: {action} {args}")

        # 🖱️ Act
        if action == "click":
            result = click(**args)

        elif action == "type":
            result = type_text(**args)

        elif action == "press":
            result = press(**args)

        elif action == "hotkey":
            result = hotkey(*args["keys"])

        elif action == "exec":
            result = exec_cmd(**args)

        elif action == "done":
            print("✅ Task complete")
            break

        else:
            result = "unknown action"

        print(f"📤 Result: {result}")

        history.append({
            "step": step,
            "action": action,
            "args": args,
            "result": result
        })

        time.sleep(STEP_DELAY)


# =========================
# 🚀 ENTRY
# =========================

if __name__ == "__main__":
    print("🖥️ Desktop Agent Starting...\n")
    time.sleep(2)
    run_agent(GOAL)