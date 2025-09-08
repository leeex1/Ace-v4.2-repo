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
    camera_settings:
  # The three fundamental settings that control exposure
  exposure:
    # Controls the amount of light and depth of field
    aperture: "{{f-stop value, e.g., f/1.8 (wide), f/16 (narrow)}}"
    # Controls the duration of light exposure and motion blur
    shutter_speed: "{{fraction or whole seconds, e.g., 1/1000, 1/60, 2s}}"
    # Controls the sensor's sensitivity to light and image noise
    iso: "{{ISO value, e.g., 100 (low noise), 3200 (high sensitivity)}}"

  # Core shooting modes for creative control
  shooting_modes:
    # Full manual control over aperture, shutter speed, and ISO
    manual: "{{true|false}}"
    # Prioritizes depth of field
    aperture_priority: "{{true|false}}"
    # Prioritizes control over motion
    shutter_priority: "{{true|false}}"

  # Autofocus and manual focus options
  focus_modes:
    # Locks focus on a stationary subject
    single_autofocus: "{{true|false}}"
    # Continuously tracks a moving subject
    continuous_autofocus: "{{true|false}}"

  # Additional crucial settings
  other_settings:
    # Adjusts the color temperature to make whites look neutral
    white_balance: "{{e.g., auto, daylight, tungsten, shade}}"
    # Determines how the camera measures light for correct exposure
    metering_mode: "{{e.g., evaluative, center-weighted, spot}}"
    # The file format for the output image
    file_format: "{{e.g., RAW (uncompressed), JPEG (compressed)}}"
    # In-camera or in-lens feature to reduce camera shake
    image_stabilization: "{{on|off}}"

    cinematography_camera_settings:
  # The core settings that control exposure, adapted for motion
  exposure:
    # Controls depth of field; a lower f-stop is often used for cinematic looks.
    aperture: "{{f-stop value, e.g., f/2.8 (shallow), f/8 (deep)}}"
    # The duration of light exposure per frame; directly linked to motion blur.
    shutter_angle: "{{degrees, e.g., 180° for natural motion blur, 90° for sharper action}}"
    # Controls sensor sensitivity; should be kept at native ISO for cleanest image.
    iso_or_ei: "{{native ISO value, e.g., 800}}"

  # Settings that define the motion and look of the footage
  motion_and_look:
    # The number of frames captured per second.
    frame_rate_fps: "{{e.g., 24 (cinematic standard), 30, 60 (for slow motion)}}"
    # Controls the visual style and dynamic range of the footage.
    gamma_curve_or_log_profile: "{{e.g., Log, RAW, Rec. 709, HLG}}"
    # The camera's color rendering; often used to match multiple cameras.
    color_matrix: "{{e.g., standard, custom, or applied LUT}}"
    # A filter used to reduce strong highlights in a scene.
    nd_filter: "{{level of neutral density, e.g., 1/4, 1/16}}"

  # Focus and framing control
  focus_and_framing:
    # Method for achieving focus; manual is common for controlled pulls.
    focus_mode: "{{e.g., manual focus, continuous autofocus, single-shot}}"
    # Type of lens used, affecting depth and perspective.
    lens: "{{e.g., prime lens (fixed focal length), zoom lens}}"
    # Provides anamorphic de-squeeze for a cinematic aspect ratio.
    anamorphic_de-squeeze: "{{e.g., 1.33x, 2x}}"

  # Additional technical settings
  technical_settings:
    # The internal codec for recording video footage.
    codec_and_bitrate: "{{e.g., ProRes 422 HQ, H.264, RAW}}"
    # The final output resolution of the footage.
    resolution: "{{e.g., 4K, 6K, 8K}}"
    # Determines the bit depth of the color information.
    bit_depth: "{{e.g., 8-bit, 10-bit, 12-bit}}"
    # The method of saving footage.
    recording_media: "{{e.g., CFexpress card, SSD drive}}"
    
  Negative Prompts:
  # you can put as many of these as needed to produce your "Best" Subjective work
  "{{items or styles to avoid anything "low"- "mid" tier quality}}"   
  # anything you dont want for example (eg.,cartoonish,watercolor,abstract,blurry,out of focus, pixalated, ect.)
```

Apply this template before the {"tool call"} so that the content uses the filled in template to generate the {{eg.,image,video,code,ect}}.