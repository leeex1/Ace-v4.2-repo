---
name: Image-Video-Generation-Template
description: >
  A skill for applying Image-Video-Generation 
  Below: a single-file JSON spec you can drop into a prompt-compiler, validator, or generator pipeline. 
  Use it as the canonical “Media Generation Template.”
---

# Description:

- **Filmography and directing**: scene slug, shot purpose, coverage pattern, screen direction, 180-degree line enforcement, eyeline match, match on action, and blocking notation for subject and camera.
- **Cinematography**: sensor format, shutter angle, ND filtration, T-stop vs f-stop, anamorphic squeeze, lens breathing, bokeh character, focus plan with pull points, stabilization taxonomy, contrast ratio, and exposure strategy.
- **Videography delivery**: mastering display, HDR standards (SDR Rec.709, HDR10, HLG, Dolby Vision), codec profile, chroma subsampling, GOP, bitrate ladder, title-safe and action-safe zones, and audio loudness targets in LUFS/LKFS.
- **General art**: principles of design, elements of art, gestalt principles, composition grids (rule of thirds, golden ratio, Fibonacci spiral, dynamic symmetry, rabattement), color harmony models, and value structure.
- **Color pipeline**: separated working space (ACEScg), IDT, optional LMT, ODT, log curve, and creative LUT hooks.
- **Production design**: mise-en-scène checklist, set dressing, wardrobe, hair and makeup, texture language, period accuracy, and practicals.
- **Evaluation**: new craft-specific metrics for exposure accuracy, focus accuracy, motion smoothness, color fidelity, and continuity coherence.


# Final template — Expert Hybrid Spec (drop-in JSON)

```json
{
  "Meta": {
    "schema_version": "3.0",
    "id": "{{uuid_or_name}}",
    "mode": "{{image|video|audio|multimodal}}",
    "profile": "{{cinema|commercial|documentary|social|art}}",
    "created_by": "{{author}}",
    "created_at": "{{YYYY-MM-DD}}",
    "determinism": {
      "seed": "{{integer|null}}",
      "consistency": "{{strict|adaptive|exploratory}}",
      "randomness_budget": "{{0.0-1.0}}"
    }
  },
  "Authority": {
    "visual_priority_order": [
      "Intent",
      "Constraints.Hard",
      "Filmcraft",
      "Priority",
      "Creative",
      "ArtTheory",
      "Style",
      "Physical",
      "Composition",
      "Cinematography",
      "Capture",
      "ColorPipeline",
      "AudioCraft",
      "Technical",
      "Output"
    ],
    "field_precedence_overrides": {}
  },
  "Intent": {
    "objective": "{{exact short sentence}}",
    "description": "{{creative brief}}",
    "deliverable": {
      "type": "{{image|video|audio}}",
      "count": "{{integer}}",
      "master_aspect_ratio": "{{2.39:1|1.85:1|16:9|4:5|1:1|9:16|custom}}",
      "alternate_aspect_ratios": ["{{9:16}}", "{{1:1}}"],
      "size_px": "{{e.g., 4096x1716}}",
      "duration_sec": "{{for video/audio}}",
      "frame_rate_fps": "{{23.976|24|25|29.97|30|48|60}}",
      "file_format": "{{EXR|TIFF|PNG|JPG|ProRes|H.264|H.265}}",
      "color_pipeline": "{{ACEScg|ACEScct|DaVinci Wide Gamut}}"
    },
    "distribution": {
      "platforms": ["{{theatrical|streaming|social}}"],
      "mastering_display": "{{P3-D65|Rec.709|Rec.2020}}",
      "hdr_standard": "{{SDR|HDR10|HLG|DolbyVision}}",
      "loudness_target_lufs": "{{-14 web, -24 broadcast}}"
    },
    "audience": "{{target audience}}",
    "intended_impact": "{{inspire|educate|sell|document|evoke}}"
  },
  "Filmcraft": {
    "sequence": "{{sequence name}}",
    "scene_slug": "{{INT. LOCATION - TIME}}",
    "shot_id": "{{e.g., 23A}}",
    "shot_purpose": "{{establish|reveal|reaction|payoff|insert}}",
    "coverage_pattern": ["master", "medium", "close_up", "over_shoulder", "insert", "cutaway"],
    "blocking": "{{subject path, marks, camera relationship}}",
    "continuity_rules": {
      "respect_180": true,
      "eyeline_match": true,
      "screen_direction": "{{left_to_right|right_to_left}}",
      "match_on_action": true,
      "thirty_degree_rule": true
    }
  },
  "Creative": {
    "theme": "{{core idea}}",
    "tone": "{{warm|playful|authoritative|urgent|melancholic}}",
    "emotional_arc": ["{{beat1}}", "{{beat2}}", "{{beat3}}"],
    "symbolism": ["{{motif}}"],
    "abstraction_level": "{{literal|stylized|abstract}}",
    "originality_bias": "{{0.0-1.0}}",
    "semantic_targets": ["recognizability", "emotional_resonance", "narrative_clarity"]
  },
  "ArtTheory": {
    "principles_of_design": ["balance", "contrast", "emphasis", "movement", "pattern", "rhythm", "unity", "proportion"],
    "elements_of_art": ["line", "shape", "form", "value", "color", "texture", "space"],
    "composition_grids": ["rule_of_thirds", "golden_ratio", "fibonacci_spiral", "dynamic_symmetry", "rabattement"],
    "gestalt_principles": ["proximity", "similarity", "continuity", "closure", "figure_ground"]
  },
  "Content": {
    "subject": {
      "primary": "{{concrete noun}}",
      "secondary": ["{{optional}}"],
      "attributes": ["{{age, wardrobe, expression}}"]
    },
    "mise_en_scene": {
      "set_dressing": ["{{key props}}"],
      "wardrobe": "{{notes}}",
      "hair_makeup": "{{notes}}"
    },
    "narrative": "{{action or state}}",
    "story_points": ["{{beat1}}", "{{beat2}}"]
  },
  "Style": {
    "design_language": "{{minimal|editorial|cinematic|brutalist|illustrative}}",
    "genre": "{{documentary|fantasy|sci-fi|corporate|fashion|noir}}",
    "art_movement": "{{Bauhaus|Impressionism|Ukiyo-e|Afrofuturism}}",
    "filmography_anchor": {
      "reference_director": "{{name}}",
      "reference_dp": "{{name}}",
      "reference_film": "{{title}}",
      "era": "{{1970s New Hollywood|contemporary}}"
    },
    "palette": ["{{#HEX}}"],
    "color_harmony": "{{complementary|analogous|triadic|split_complementary|monochromatic}}",
    "value_structure": "{{high_key|low_key|chiaroscuro}}",
    "lighting_intent": "{{soft daylight|neon|rim-light|practical motivated}}",
    "texture_and_grain": "{{clean digital|35mm|16mm}}",
    "references": [
      {"type": "film|scene|photo|painting|LUT", "source": "{{title}}", "weight": "{{0.0-1.0}}", "aspect": "{{lighting|color|lensing}}"}
    ],
    "style_consistency_target": "{{0.0-1.0}}"
  },
  "Physical": {
    "lighting": {
      "approach": "{{three_point|motivated|natural|high_key|low_key}}",
      "key_setup": "{{butterfly|rembrandt|loop|split}}",
      "quality": "{{soft|hard}}",
      "color_temperature_k": "{{3200|4300|5600}}",
      "contrast_ratio": "{{2:1|4:1|8:1}}",
      "modifiers": ["{{softbox|grid|diffusion|bounce|flag}}"],
      "practicals": ["{{lamp|neon}}"],
      "motivation": "{{window|practical|stylized}}"
    },
    "environment": {
      "location_type": "{{interior|exterior|studio|virtual}}",
      "time_of_day": "{{golden_hour|blue_hour|night}}",
      "atmospherics": ["{{haze|fog|dust|smoke|rain}}"]
    },
    "materials": {
      "finish": "{{matte|satin|glossy|metallic}}",
      "material_fidelity": "{{0.0-1.0}}"
    }
  },
  "Composition": {
    "framing": "{{ECU|CU|MCU|MS|WS|EWS}}",
    "camera_angle": "{{eye-level|high|low|dutch|overhead}}",
    "lens_character": {
      "focal_length_mm": "{{35}}",
      "lens_type": "{{prime|zoom|anamorphic}}",
      "aperture": "{{f/2.0}}",
      "t_stop": "{{T2.0}}",
      "depth_of_field_target": "{{shallow|deep|split_diopter}}",
      "bokeh_quality": "{{smooth|swirly|anamorphic_streaks}}",
      "lens_breathing_tolerance": "{{low|medium|high}}",
      "filtration": ["{{ND 0.9|Black Pro-Mist 1/4|Polarizer}}"]
    },
    "depth_structure": {
      "foreground": "{{elements}}",
      "midground": "{{elements}}",
      "background": "{{elements}}"
    },
    "leading_lines": "{{description}}",
    "negative_space_intent": "{{isolate|breathe|tension}}",
    "safe_zones": {
      "action_safe_pct": 93,
      "title_safe_pct": 90
    }
  },
  "Cinematography": {
    "camera_system": {
      "sensor_format": "{{Super35|FullFrame|65mm|MFT}}",
      "camera_model_anchor": "{{ARRI Alexa 35|RED V-Raptor|Sony Venice}}",
      "shutter_angle": "{{180}}",
      "iso_or_ei": "{{800}}",
      "nd_filter_stops": "{{0.6|1.2|1.8}}",
      "white_balance_k": "{{5600}}"
    },
    "support_and_movement": {
      "rig": "{{tripod|dolly|gimbal|Steadicam|crane|handheld|drone}}",
      "move_type": "{{static|push_in|pull_out|pan|tilt|truck|pedestal|whip_pan}}",
      "move_speed": "{{slow|medium|fast}}",
      "move_easing": "{{linear|ease_in_out}}"
    },
    "exposure_strategy": "{{ETTR|protect_highlights|middle_grey}}",
    "focus_plan": {
      "mode": "{{manual|auto|rack}}",
      "pull_points": ["{{subject A at 0s}}", "{{subject B at 3s}}"]
    }
  },
  "Capture": {
    "enabled": "{{true|false}}",
    "mode": "{{photo|cinema|synthetic|render}}"
  },
  "ColorPipeline": {
    "working_space": "{{ACEScg}}",
    "idt": "{{manufacturer IDT}}",
    "lmt": ["{{optional creative LMT}}"],
    "odt": "{{Rec.709|P3-D65|Rec.2020}}",
    "log_curve": "{{LogC4|S-Log3|REDlogFilm}}",
    "look_intent": "{{natural|film_print|teal_orange}}",
    "grain_intent": "{{none|fine_35mm|heavy_16mm}}"
  },
  "AudioCraft": {
    "enabled": "{{true|false}}",
    "channels": "{{mono|stereo|5.1|Atmos}}",
    "sample_rate_hz": 48000,
    "bit_depth": 24,
    "mic_pattern": "{{shotgun|lav|boom|stereo_pair}}",
    "timecode": "{{23.976|24|25|29.97DF}}",
    "loudness_target_lufs": "{{-14| -24}}",
    "true_peak_db": -1.0
  },
  "Technical": {
    "resolution": "{{4096x2160}}",
    "bit_depth": "{{10|12|16}}",
    "codec_profile": "{{ProRes 4444 XQ|DNxHR HQX|H.265 Main10}}",
    "chroma_subsampling": "{{4:4:4|4:2:2|4:2:0}}",
    "bitrate_target_mbps": "{{150}}",
    "delivery_ladder": [
      {"platform": "youtube", "resolution": "3840x2160", "hdr": "HDR10", "loudness_lufs": -14},
      {"platform": "instagram", "resolution": "1080x1920", "hdr": "SDR", "loudness_lufs": -14}
    ],
    "post_processing_intent": ["denoise", "color_grade", "add_grain", "stabilize", "legalize"],
    "scalability_notes": "{{center cut protection, reframe guides}}"
  },
  "Constraints": {
    "hard": ["{{logo clear space}}", "{{no identifiable person without release}}"],
    "soft": ["{{avoid heavy chrome if render budget low}}"],
    "guards": ["no_anatomical_errors", "no_watermark", "no_flicker", "no_rolling_shutter_jello", "no_moire", "no_banding", "no_illegal_levels", "respect_copyright"],
    "negative_prompts": ["blurry", "low_res", "extra_limbs", "watermark", "overexposed", "underexposed"]
  },
  "Priority": {
    "weights": {
      "subject": 10,
      "lighting": 9,
      "composition": 9,
      "cinematography": 8,
      "color_fidelity": 8,
      "style": 7,
      "technical": 6,
      "accessibility": 7
    },
    "tie_breaker_strategy": "favor_higher_priority_field"
  },
  "GenerationControl": {
    "creativity_level": "{{low|medium|high}}",
    "variation_count": "{{integer}}",
    "batch_strategy": "{{diverse|consistent|seeded}}"
  },
  "Evaluation": {
    "metrics": {
      "subject_clarity": 0.0,
      "exposure_accuracy": 0.0,
      "focus_accuracy": 0.0,
      "motion_smoothness": 0.0,
      "color_fidelity": 0.0,
      "continuity_coherence": 0.0,
      "style_consistency": 0.0,
      "technical_quality": 0.0,
      "aesthetic_impact": 0.0
    },
    "thresholds": {
      "accept": 0.90,
      "revise": 0.75
    },
    "evaluation_mode": "{{auto|human|hybrid}}"
  },
  "Iteration": {
    "max_passes": 5,
    "refinement_order": [
      "enforce blocking and continuity",
      "match lighting ratio and motivation",
      "tune lens and depth of field",
      "fix exposure per 180-degree shutter rule",
      "apply ACES grade and accessibility checks"
    ]
  },
  "Validation": {
    "pre_generation_checks": [
      "Intent.deliverable fully specified",
      "Filmcraft.continuity_rules present",
      "ColorPipeline working_space defined"
    ],
    "post_generation_checks": [
      "no guard violations",
      "metrics computed",
      "delivery ladder validated"
    ],
    "auto_reject_on_violation": true
  },
  "Accessibility": {
    "alt_text": "{{precise alt text}}",
    "captions": "{{true|false}}",
    "contrast_target": "{{WCAG_AA|WCAG_AAA}}",
    "localization": {
      "language": "{{en}}",
      "text_direction": "{{LTR|RTL}}"
    }
  },
  "Communication": {
    "brief_for_reviewers": "{{short QA blurb}}",
    "notes_for_generation_engine": "{{prioritize skin tone fidelity}}",
    "versioning_and_changelog": "{{notes}}"
  },
  "References": [],
  "Audit": {
    "history": [],
    "last_run": {}
  }
}
```

## Example — cinematic portrait video

```json
{
  "Meta": {"schema_version":"3.0","mode":"video","profile":"commercial","determinism":{"seed":12345,"consistency":"strict"}},
  "Intent": {"objective":"Hero portrait for album cover","deliverable":{"type":"video","master_aspect_ratio":"1:1","duration_sec":6,"frame_rate_fps":24,"file_format":"ProRes","color_pipeline":"ACEScg"}},
  "Filmcraft": {"scene_slug":"INT. STAGE - NIGHT","shot_purpose":"reveal","coverage_pattern":["medium","close_up"],"continuity_rules":{"respect_180":true,"eyeline_match":true,"screen_direction":"left_to_right"}},
  "Style": {"filmography_anchor":{"reference_dp":"Greig Fraser","reference_film":"Dune"},"palette":["#0b0b0f","#e6b800"],"lighting_intent":"rim-light"},
  "Physical": {"lighting":{"approach":"motivated","key_setup":"rembrandt","quality":"hard","color_temperature_k":3200,"contrast_ratio":"8:1","modifiers":["grid"],"practicals":["neon"]},"environment":{"atmospherics":["smoke"]}},
  "Composition": {"framing":"CU","camera_angle":"eye-level","lens_character":{"focal_length_mm":85,"lens_type":"prime","aperture":"f/1.8","depth_of_field_target":"shallow","filtration":["Black Pro-Mist 1/4"]},"motion_design":"gimbal tracking"},
  "Cinematography": {"camera_system":{"sensor_format":"Super35","shutter_angle":180,"iso_or_ei":800},"support_and_movement":{"rig":"gimbal","move_type":"push_in","move_speed":"slow"}},
  "ColorPipeline": {"working_space":"ACEScg","odt":"Rec.709","look_intent":"natural","grain_intent":"fine_35mm"}
}
```

---

# How to use — practical flow (keep it deterministic) ✅

1. Fill manifest — fully populate Intent, Content, Style, Technical, Constraints.


2. Validate pre-generation — run Validation.pre_generation_checks. Fix missing params.


3. Compile for target engine — convert manifest to model-specific prompt (preserve priorities, seed, constraints).


4. Generate batch — use GenerationControl.variation_count and Meta.determinism.seed (or seeded variants).


5. Auto-evaluate — compute Evaluation.metrics. If >= accept → finalize. If between revise and accept → run Iteration.auto_refinement_rules. If < revise → human review.


6. Post-process — apply Technical.post_processing_intent and accessibility adjustments (alt text, captions).


7. Audit and version — append run to Audit.history.



## Quick notes & suggestions (real-world tips) 🛠️

Use Authority.field_precedence_overrides when you need a field to always trump others (e.g., brand logo placement).

Keep Capture.enabled = false for pure synthetic styles; enable when you want photographic realism anchored to a camera.

originality_bias + determinism lets you do reproducible exploration: keep seed constant while varying only originality_bias.

For dataset generation: set batch_strategy to consistent and use seeds offset by a fixed increment.

---