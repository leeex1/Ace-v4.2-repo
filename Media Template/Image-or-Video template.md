\---

name: Image-Video-Generation-Template

description: >

&#x20; A skill for applying Image-Video-Generation 

&#x20; Below: a single-file JSON spec you can drop into a prompt-compiler, validator, or generator pipeline. 

&#x20; Use it as the canonical “Media Generation Template.”

\---



\# Description:



\- \*\*Filmography and directing\*\*: scene slug, shot purpose, coverage pattern, screen direction, 180-degree line enforcement, eyeline match, match on action, and blocking notation for subject and camera.

\- \*\*Cinematography\*\*: sensor format, shutter angle, ND filtration, T-stop vs f-stop, anamorphic squeeze, lens breathing, bokeh character, focus plan with pull points, stabilization taxonomy, contrast ratio, and exposure strategy.

\- \*\*Videography delivery\*\*: mastering display, HDR standards (SDR Rec.709, HDR10, HLG, Dolby Vision), codec profile, chroma subsampling, GOP, bitrate ladder, title-safe and action-safe zones, and audio loudness targets in LUFS/LKFS.

\- \*\*General art\*\*: principles of design, elements of art, gestalt principles, composition grids (rule of thirds, golden ratio, Fibonacci spiral, dynamic symmetry, rabattement), color harmony models, and value structure.

\- \*\*Color pipeline\*\*: separated working space (ACEScg), IDT, optional LMT, ODT, log curve, and creative LUT hooks.

\- \*\*Production design\*\*: mise-en-scène checklist, set dressing, wardrobe, hair and makeup, texture language, period accuracy, and practicals.

\- \*\*Evaluation\*\*: new craft-specific metrics for exposure accuracy, focus accuracy, motion smoothness, color fidelity, and continuity coherence.





\# Final template — Expert Hybrid Spec (drop-in JSON)



```json

{

&#x20; "Meta": {

&#x20;   "schema\_version": "3.0",

&#x20;   "id": "{{uuid\_or\_name}}",

&#x20;   "mode": "{{image|video|audio|multimodal}}",

&#x20;   "profile": "{{cinema|commercial|documentary|social|art}}",

&#x20;   "created\_by": "{{author}}",

&#x20;   "created\_at": "{{YYYY-MM-DD}}",

&#x20;   "determinism": {

&#x20;     "seed": "{{integer|null}}",

&#x20;     "consistency": "{{strict|adaptive|exploratory}}",

&#x20;     "randomness\_budget": "{{0.0-1.0}}"

&#x20;   }

&#x20; },

&#x20; "Authority": {

&#x20;   "visual\_priority\_order": \[

&#x20;     "Intent",

&#x20;     "Constraints.Hard",

&#x20;     "Filmcraft",

&#x20;     "Priority",

&#x20;     "Creative",

&#x20;     "ArtTheory",

&#x20;     "Style",

&#x20;     "Physical",

&#x20;     "Composition",

&#x20;     "Cinematography",

&#x20;     "Capture",

&#x20;     "ColorPipeline",

&#x20;     "AudioCraft",

&#x20;     "Technical",

&#x20;     "Output"

&#x20;   ],

&#x20;   "field\_precedence\_overrides": {}

&#x20; },

&#x20; "Intent": {

&#x20;   "objective": "{{exact short sentence}}",

&#x20;   "description": "{{creative brief}}",

&#x20;   "deliverable": {

&#x20;     "type": "{{image|video|audio}}",

&#x20;     "count": "{{integer}}",

&#x20;     "master\_aspect\_ratio": "{{2.39:1|1.85:1|16:9|4:5|1:1|9:16|custom}}",

&#x20;     "alternate\_aspect\_ratios": \["{{9:16}}", "{{1:1}}"],

&#x20;     "size\_px": "{{e.g., 4096x1716}}",

&#x20;     "duration\_sec": "{{for video/audio}}",

&#x20;     "frame\_rate\_fps": "{{23.976|24|25|29.97|30|48|60}}",

&#x20;     "file\_format": "{{EXR|TIFF|PNG|JPG|ProRes|H.264|H.265}}",

&#x20;     "color\_pipeline": "{{ACEScg|ACEScct|DaVinci Wide Gamut}}"

&#x20;   },

&#x20;   "distribution": {

&#x20;     "platforms": \["{{theatrical|streaming|social}}"],

&#x20;     "mastering\_display": "{{P3-D65|Rec.709|Rec.2020}}",

&#x20;     "hdr\_standard": "{{SDR|HDR10|HLG|DolbyVision}}",

&#x20;     "loudness\_target\_lufs": "{{-14 web, -24 broadcast}}"

&#x20;   },

&#x20;   "audience": "{{target audience}}",

&#x20;   "intended\_impact": "{{inspire|educate|sell|document|evoke}}"

&#x20; },

&#x20; "Filmcraft": {

&#x20;   "sequence": "{{sequence name}}",

&#x20;   "scene\_slug": "{{INT. LOCATION - TIME}}",

&#x20;   "shot\_id": "{{e.g., 23A}}",

&#x20;   "shot\_purpose": "{{establish|reveal|reaction|payoff|insert}}",

&#x20;   "coverage\_pattern": \["master", "medium", "close\_up", "over\_shoulder", "insert", "cutaway"],

&#x20;   "blocking": "{{subject path, marks, camera relationship}}",

&#x20;   "continuity\_rules": {

&#x20;     "respect\_180": true,

&#x20;     "eyeline\_match": true,

&#x20;     "screen\_direction": "{{left\_to\_right|right\_to\_left}}",

&#x20;     "match\_on\_action": true,

&#x20;     "thirty\_degree\_rule": true

&#x20;   }

&#x20; },

&#x20; "Creative": {

&#x20;   "theme": "{{core idea}}",

&#x20;   "tone": "{{warm|playful|authoritative|urgent|melancholic}}",

&#x20;   "emotional\_arc": \["{{beat1}}", "{{beat2}}", "{{beat3}}"],

&#x20;   "symbolism": \["{{motif}}"],

&#x20;   "abstraction\_level": "{{literal|stylized|abstract}}",

&#x20;   "originality\_bias": "{{0.0-1.0}}",

&#x20;   "semantic\_targets": \["recognizability", "emotional\_resonance", "narrative\_clarity"]

&#x20; },

&#x20; "ArtTheory": {

&#x20;   "principles\_of\_design": \["balance", "contrast", "emphasis", "movement", "pattern", "rhythm", "unity", "proportion"],

&#x20;   "elements\_of\_art": \["line", "shape", "form", "value", "color", "texture", "space"],

&#x20;   "composition\_grids": \["rule\_of\_thirds", "golden\_ratio", "fibonacci\_spiral", "dynamic\_symmetry", "rabattement"],

&#x20;   "gestalt\_principles": \["proximity", "similarity", "continuity", "closure", "figure\_ground"]

&#x20; },

&#x20; "Content": {

&#x20;   "subject": {

&#x20;     "primary": "{{concrete noun}}",

&#x20;     "secondary": \["{{optional}}"],

&#x20;     "attributes": \["{{age, wardrobe, expression}}"]

&#x20;   },

&#x20;   "mise\_en\_scene": {

&#x20;     "set\_dressing": \["{{key props}}"],

&#x20;     "wardrobe": "{{notes}}",

&#x20;     "hair\_makeup": "{{notes}}"

&#x20;   },

&#x20;   "narrative": "{{action or state}}",

&#x20;   "story\_points": \["{{beat1}}", "{{beat2}}"]

&#x20; },

&#x20; "Style": {

&#x20;   "design\_language": "{{minimal|editorial|cinematic|brutalist|illustrative}}",

&#x20;   "genre": "{{documentary|fantasy|sci-fi|corporate|fashion|noir}}",

&#x20;   "art\_movement": "{{Bauhaus|Impressionism|Ukiyo-e|Afrofuturism}}",

&#x20;   "filmography\_anchor": {

&#x20;     "reference\_director": "{{name}}",

&#x20;     "reference\_dp": "{{name}}",

&#x20;     "reference\_film": "{{title}}",

&#x20;     "era": "{{1970s New Hollywood|contemporary}}"

&#x20;   },

&#x20;   "palette": \["{{#HEX}}"],

&#x20;   "color\_harmony": "{{complementary|analogous|triadic|split\_complementary|monochromatic}}",

&#x20;   "value\_structure": "{{high\_key|low\_key|chiaroscuro}}",

&#x20;   "lighting\_intent": "{{soft daylight|neon|rim-light|practical motivated}}",

&#x20;   "texture\_and\_grain": "{{clean digital|35mm|16mm}}",

&#x20;   "references": \[

&#x20;     {"type": "film|scene|photo|painting|LUT", "source": "{{title}}", "weight": "{{0.0-1.0}}", "aspect": "{{lighting|color|lensing}}"}

&#x20;   ],

&#x20;   "style\_consistency\_target": "{{0.0-1.0}}"

&#x20; },

&#x20; "Physical": {

&#x20;   "lighting": {

&#x20;     "approach": "{{three\_point|motivated|natural|high\_key|low\_key}}",

&#x20;     "key\_setup": "{{butterfly|rembrandt|loop|split}}",

&#x20;     "quality": "{{soft|hard}}",

&#x20;     "color\_temperature\_k": "{{3200|4300|5600}}",

&#x20;     "contrast\_ratio": "{{2:1|4:1|8:1}}",

&#x20;     "modifiers": \["{{softbox|grid|diffusion|bounce|flag}}"],

&#x20;     "practicals": \["{{lamp|neon}}"],

&#x20;     "motivation": "{{window|practical|stylized}}"

&#x20;   },

&#x20;   "environment": {

&#x20;     "location\_type": "{{interior|exterior|studio|virtual}}",

&#x20;     "time\_of\_day": "{{golden\_hour|blue\_hour|night}}",

&#x20;     "atmospherics": \["{{haze|fog|dust|smoke|rain}}"]

&#x20;   },

&#x20;   "materials": {

&#x20;     "finish": "{{matte|satin|glossy|metallic}}",

&#x20;     "material\_fidelity": "{{0.0-1.0}}"

&#x20;   }

&#x20; },

&#x20; "Composition": {

&#x20;   "framing": "{{ECU|CU|MCU|MS|WS|EWS}}",

&#x20;   "camera\_angle": "{{eye-level|high|low|dutch|overhead}}",

&#x20;   "lens\_character": {

&#x20;     "focal\_length\_mm": "{{35}}",

&#x20;     "lens\_type": "{{prime|zoom|anamorphic}}",

&#x20;     "aperture": "{{f/2.0}}",

&#x20;     "t\_stop": "{{T2.0}}",

&#x20;     "depth\_of\_field\_target": "{{shallow|deep|split\_diopter}}",

&#x20;     "bokeh\_quality": "{{smooth|swirly|anamorphic\_streaks}}",

&#x20;     "lens\_breathing\_tolerance": "{{low|medium|high}}",

&#x20;     "filtration": \["{{ND 0.9|Black Pro-Mist 1/4|Polarizer}}"]

&#x20;   },

&#x20;   "depth\_structure": {

&#x20;     "foreground": "{{elements}}",

&#x20;     "midground": "{{elements}}",

&#x20;     "background": "{{elements}}"

&#x20;   },

&#x20;   "leading\_lines": "{{description}}",

&#x20;   "negative\_space\_intent": "{{isolate|breathe|tension}}",

&#x20;   "safe\_zones": {

&#x20;     "action\_safe\_pct": 93,

&#x20;     "title\_safe\_pct": 90

&#x20;   }

&#x20; },

&#x20; "Cinematography": {

&#x20;   "camera\_system": {

&#x20;     "sensor\_format": "{{Super35|FullFrame|65mm|MFT}}",

&#x20;     "camera\_model\_anchor": "{{ARRI Alexa 35|RED V-Raptor|Sony Venice}}",

&#x20;     "shutter\_angle": "{{180}}",

&#x20;     "iso\_or\_ei": "{{800}}",

&#x20;     "nd\_filter\_stops": "{{0.6|1.2|1.8}}",

&#x20;     "white\_balance\_k": "{{5600}}"

&#x20;   },

&#x20;   "support\_and\_movement": {

&#x20;     "rig": "{{tripod|dolly|gimbal|Steadicam|crane|handheld|drone}}",

&#x20;     "move\_type": "{{static|push\_in|pull\_out|pan|tilt|truck|pedestal|whip\_pan}}",

&#x20;     "move\_speed": "{{slow|medium|fast}}",

&#x20;     "move\_easing": "{{linear|ease\_in\_out}}"

&#x20;   },

&#x20;   "exposure\_strategy": "{{ETTR|protect\_highlights|middle\_grey}}",

&#x20;   "focus\_plan": {

&#x20;     "mode": "{{manual|auto|rack}}",

&#x20;     "pull\_points": \["{{subject A at 0s}}", "{{subject B at 3s}}"]

&#x20;   }

&#x20; },

&#x20; "Capture": {

&#x20;   "enabled": "{{true|false}}",

&#x20;   "mode": "{{photo|cinema|synthetic|render}}"

&#x20; },

&#x20; "ColorPipeline": {

&#x20;   "working\_space": "{{ACEScg}}",

&#x20;   "idt": "{{manufacturer IDT}}",

&#x20;   "lmt": \["{{optional creative LMT}}"],

&#x20;   "odt": "{{Rec.709|P3-D65|Rec.2020}}",

&#x20;   "log\_curve": "{{LogC4|S-Log3|REDlogFilm}}",

&#x20;   "look\_intent": "{{natural|film\_print|teal\_orange}}",

&#x20;   "grain\_intent": "{{none|fine\_35mm|heavy\_16mm}}"

&#x20; },

&#x20; "AudioCraft": {

&#x20;   "enabled": "{{true|false}}",

&#x20;   "channels": "{{mono|stereo|5.1|Atmos}}",

&#x20;   "sample\_rate\_hz": 48000,

&#x20;   "bit\_depth": 24,

&#x20;   "mic\_pattern": "{{shotgun|lav|boom|stereo\_pair}}",

&#x20;   "timecode": "{{23.976|24|25|29.97DF}}",

&#x20;   "loudness\_target\_lufs": "{{-14| -24}}",

&#x20;   "true\_peak\_db": -1.0

&#x20; },

&#x20; "Technical": {

&#x20;   "resolution": "{{4096x2160}}",

&#x20;   "bit\_depth": "{{10|12|16}}",

&#x20;   "codec\_profile": "{{ProRes 4444 XQ|DNxHR HQX|H.265 Main10}}",

&#x20;   "chroma\_subsampling": "{{4:4:4|4:2:2|4:2:0}}",

&#x20;   "bitrate\_target\_mbps": "{{150}}",

&#x20;   "delivery\_ladder": \[

&#x20;     {"platform": "youtube", "resolution": "3840x2160", "hdr": "HDR10", "loudness\_lufs": -14},

&#x20;     {"platform": "instagram", "resolution": "1080x1920", "hdr": "SDR", "loudness\_lufs": -14}

&#x20;   ],

&#x20;   "post\_processing\_intent": \["denoise", "color\_grade", "add\_grain", "stabilize", "legalize"],

&#x20;   "scalability\_notes": "{{center cut protection, reframe guides}}"

&#x20; },

&#x20; "Constraints": {

&#x20;   "hard": \["{{logo clear space}}", "{{no identifiable person without release}}"],

&#x20;   "soft": \["{{avoid heavy chrome if render budget low}}"],

&#x20;   "guards": \["no\_anatomical\_errors", "no\_watermark", "no\_flicker", "no\_rolling\_shutter\_jello", "no\_moire", "no\_banding", "no\_illegal\_levels", "respect\_copyright"],

&#x20;   "negative\_prompts": \["blurry", "low\_res", "extra\_limbs", "watermark", "overexposed", "underexposed"]

&#x20; },

&#x20; "Priority": {

&#x20;   "weights": {

&#x20;     "subject": 10,

&#x20;     "lighting": 9,

&#x20;     "composition": 9,

&#x20;     "cinematography": 8,

&#x20;     "color\_fidelity": 8,

&#x20;     "style": 7,

&#x20;     "technical": 6,

&#x20;     "accessibility": 7

&#x20;   },

&#x20;   "tie\_breaker\_strategy": "favor\_higher\_priority\_field"

&#x20; },

&#x20; "GenerationControl": {

&#x20;   "creativity\_level": "{{low|medium|high}}",

&#x20;   "variation\_count": "{{integer}}",

&#x20;   "batch\_strategy": "{{diverse|consistent|seeded}}"

&#x20; },

&#x20; "Evaluation": {

&#x20;   "metrics": {

&#x20;     "subject\_clarity": 0.0,

&#x20;     "exposure\_accuracy": 0.0,

&#x20;     "focus\_accuracy": 0.0,

&#x20;     "motion\_smoothness": 0.0,

&#x20;     "color\_fidelity": 0.0,

&#x20;     "continuity\_coherence": 0.0,

&#x20;     "style\_consistency": 0.0,

&#x20;     "technical\_quality": 0.0,

&#x20;     "aesthetic\_impact": 0.0

&#x20;   },

&#x20;   "thresholds": {

&#x20;     "accept": 0.90,

&#x20;     "revise": 0.75

&#x20;   },

&#x20;   "evaluation\_mode": "{{auto|human|hybrid}}"

&#x20; },

&#x20; "Iteration": {

&#x20;   "max\_passes": 5,

&#x20;   "refinement\_order": \[

&#x20;     "enforce blocking and continuity",

&#x20;     "match lighting ratio and motivation",

&#x20;     "tune lens and depth of field",

&#x20;     "fix exposure per 180-degree shutter rule",

&#x20;     "apply ACES grade and accessibility checks"

&#x20;   ]

&#x20; },

&#x20; "Validation": {

&#x20;   "pre\_generation\_checks": \[

&#x20;     "Intent.deliverable fully specified",

&#x20;     "Filmcraft.continuity\_rules present",

&#x20;     "ColorPipeline working\_space defined"

&#x20;   ],

&#x20;   "post\_generation\_checks": \[

&#x20;     "no guard violations",

&#x20;     "metrics computed",

&#x20;     "delivery ladder validated"

&#x20;   ],

&#x20;   "auto\_reject\_on\_violation": true

&#x20; },

&#x20; "Accessibility": {

&#x20;   "alt\_text": "{{precise alt text}}",

&#x20;   "captions": "{{true|false}}",

&#x20;   "contrast\_target": "{{WCAG\_AA|WCAG\_AAA}}",

&#x20;   "localization": {

&#x20;     "language": "{{en}}",

&#x20;     "text\_direction": "{{LTR|RTL}}"

&#x20;   }

&#x20; },

&#x20; "Communication": {

&#x20;   "brief\_for\_reviewers": "{{short QA blurb}}",

&#x20;   "notes\_for\_generation\_engine": "{{prioritize skin tone fidelity}}",

&#x20;   "versioning\_and\_changelog": "{{notes}}"

&#x20; },

&#x20; "References": \[],

&#x20; "Audit": {

&#x20;   "history": \[],

&#x20;   "last\_run": {}

&#x20; }

}

```



\## Example — cinematic portrait video



```json

{

&#x20; "Meta": {"schema\_version":"3.0","mode":"video","profile":"commercial","determinism":{"seed":12345,"consistency":"strict"}},

&#x20; "Intent": {"objective":"Hero portrait for album cover","deliverable":{"type":"video","master\_aspect\_ratio":"1:1","duration\_sec":6,"frame\_rate\_fps":24,"file\_format":"ProRes","color\_pipeline":"ACEScg"}},

&#x20; "Filmcraft": {"scene\_slug":"INT. STAGE - NIGHT","shot\_purpose":"reveal","coverage\_pattern":\["medium","close\_up"],"continuity\_rules":{"respect\_180":true,"eyeline\_match":true,"screen\_direction":"left\_to\_right"}},

&#x20; "Style": {"filmography\_anchor":{"reference\_dp":"Greig Fraser","reference\_film":"Dune"},"palette":\["#0b0b0f","#e6b800"],"lighting\_intent":"rim-light"},

&#x20; "Physical": {"lighting":{"approach":"motivated","key\_setup":"rembrandt","quality":"hard","color\_temperature\_k":3200,"contrast\_ratio":"8:1","modifiers":\["grid"],"practicals":\["neon"]},"environment":{"atmospherics":\["smoke"]}},

&#x20; "Composition": {"framing":"CU","camera\_angle":"eye-level","lens\_character":{"focal\_length\_mm":85,"lens\_type":"prime","aperture":"f/1.8","depth\_of\_field\_target":"shallow","filtration":\["Black Pro-Mist 1/4"]},"motion\_design":"gimbal tracking"},

&#x20; "Cinematography": {"camera\_system":{"sensor\_format":"Super35","shutter\_angle":180,"iso\_or\_ei":800},"support\_and\_movement":{"rig":"gimbal","move\_type":"push\_in","move\_speed":"slow"}},

&#x20; "ColorPipeline": {"working\_space":"ACEScg","odt":"Rec.709","look\_intent":"natural","grain\_intent":"fine\_35mm"}

}

```



\---



\# How to use — practical flow (keep it deterministic) ✅



1\. Fill manifest — fully populate Intent, Content, Style, Technical, Constraints.





2\. Validate pre-generation — run Validation.pre\_generation\_checks. Fix missing params.





3\. Compile for target engine — convert manifest to model-specific prompt (preserve priorities, seed, constraints).





4\. Generate batch — use GenerationControl.variation\_count and Meta.determinism.seed (or seeded variants).





5\. Auto-evaluate — compute Evaluation.metrics. If >= accept → finalize. If between revise and accept → run Iteration.auto\_refinement\_rules. If < revise → human review.





6\. Post-process — apply Technical.post\_processing\_intent and accessibility adjustments (alt text, captions).





7\. Audit and version — append run to Audit.history.







\## Quick notes \& suggestions (real-world tips) 🛠️



Use Authority.field\_precedence\_overrides when you need a field to always trump others (e.g., brand logo placement).



Keep Capture.enabled = false for pure synthetic styles; enable when you want photographic realism anchored to a camera.



originality\_bias + determinism lets you do reproducible exploration: keep seed constant while varying only originality\_bias.



For dataset generation: set batch\_strategy to consistent and use seeds offset by a fixed increment.



\---


## Connections
- [[Platforms/Gemini/Image-or-Video template.md]]
- [[Platforms/GPT/Image template.md]]
- [[Platforms/Grok/Image-or-Video template.md]]
- [[00 - Meta/06 - Deployment & Platforms.md]]
- [[system prompts/Quillan-Samurai.md]]
- [[00 - Meta/05 - Creative Works.md]]
