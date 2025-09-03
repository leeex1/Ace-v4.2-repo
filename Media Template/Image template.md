# Obvective
Can you generate {{image,video,etc.}}, of "{{description text}}"? Reflect thoroughly on the matter; ponder deeply and ensure precision. It must reflect the true representation. 

# Outline Template
Employ the provided framework to create the required text for the content being produced.
```yaml
Brief:
  Objective: "{{Media input text, goal}}"
  Deliverable:
    Type: "{{image|video|audio|code|other}}"
    Count: "{{insert number}}"
    AspectRatio: "{{16:9|4:5|1:1|9:16|3:2}}"
    SizePx: "{{e.g., 2048x1152}}"           # images
    DurationSec: "{{e.g., 8}}"              # videos (omit for images)
    FrameRateFPS: "{{e.g., 24}}"            # videos (omit for images)
    FileFormat: "{{PNG|JPG|MP4|GIF|SVG|PDF|...}}"
    ColorProfile: "{{sRGB|Display-P3|AdobeRGB}}"
  Content:
    Subject: "{{what is depicted}}"
    PrimaryElements: ["{{core objects/characters}}"]
    BackgroundElements: ["{{supporting context}}"]
    Narrative: "{{arc or message}}"
    Theme: "{{core idea}}"
  Style:
    DesignLanguage: "{{e.g., minimal, editorial, cinematic, brutalist}}"
    Genre: "{{e.g., documentary, fantasy, sci-fi, corporate}}"
    Palette: "{{brief palette or hex refs}}"
    Lighting: "{{e.g., soft daylight rim light, neon, chiaroscuro}}"
    Composition: "{{e.g., rule of thirds, centered, leading lines}}"
    Perspective: "{{e.g., eye-level 50mm, aerial, macro}}"
    Symbolism: "{{metaphors or motifs and their meaning}}"
    References: ["{{links or titles}}"]
  Communication:
    Tone: "{{e.g., warm, authoritative, playful}}"
    Audience: "{{target group}}"
    IntendedImpact: "{{feel/think/do outcome}}"
    Accessibility:
      AltText: "{{clear alt text for images}}"
      Captions: {{true|false}}              # videos
      ContrastTarget: "{{WCAG AA|AAA}}"
      LocalizationNotes: "{{names, units, RTL/LTR, etc.}}"
  Technical:
    Resolution: "{{final output resolution}}"
    Scalability: "{{notes for print/crop/responsive}}"
    Compression: "{{e.g., low-loss for web < 1MB}}"
    PostProcessing: "{{grain, denoise, sharpen, VFX}}"
    ConsistencyChecks: ["{{brand colors match}}","{{logo clear space}}"]
    DataSources: ["{{citations if factual}}"]
  Constraints:
    MustInclude: ["{{non-negotiables}}"]
    MustAvoid: ["{{off-brand items, clichés, IP, sensitive content}}"]
    Safety: "{{copyright/privacy/ethics constraints}}"
  Evaluation:
    SuccessCriteria: ["{{clear pass/fail checks}}"]
    VisualHierarchy: "{{what reads first, second, third}}"
    MemorabilityHook: "{{distinctive twist or detail}}"
```

Apply this template before the {"tool call"} so that the content uses the filled in template to generate the {{eg.,image,video,code,ect}}.