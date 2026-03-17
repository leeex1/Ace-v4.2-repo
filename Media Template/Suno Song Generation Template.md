# Suno AI Best Practices and Updated Approaches

Current Suno guidance (official docs and community) emphasizes a clear division between *style prompts* and *lyrics with tags*, as well as rich tagging for structure and sound. Key recommendations include:

- **Use distinct style vs. lyrics prompts:** *Style prompts* define the **sound blueprint** (genre, tempo-feel, core instruments, vocal style, mix intent)【26†L1-L4】【25†L193-L202】. *Lyrics prompts* contain the actual words and section markers【25†L120-L124】【25†L226-L234】. For example, style might be *“melancholic indie, 70 bpm, acoustic guitar, soft female vocal, intimate mix”*, while lyrics begin with `[Intro]` or `[Verse 1]` tags【25†L226-L234】【9†L75-L83】. This separation is the “backbone” of effective Suno prompts【25†L120-L124】.  
- **Include specific musical attributes in style:** Good style prompts often list **genre/subgenre, tempo or tempo-feel, core instrumentation, vocal intent, mix direction**, and one emotional axis【26†L1-L4】【25†L193-L202】. E.g. *“electronic dance, 128 bpm, pounding drums, bright female vocal, festival-ready mix, uplifting tone”*【26†L1-L4】【25†L193-L202】. Including a numeric BPM or descriptor (e.g. “midtempo”) is common practice.  
- **Use Suno tags in lyrics for structure and detail:** Insert Suno’s square-bracket tags to control arrangement【22†L44-L53】【25†L135-L143】. At minimum, label major sections: `[Intro]`, `[Verse 1]`, `[Pre-Chorus]`, `[Chorus]`, `[Bridge]`, `[Outro]`, etc. You can add brief cues after a double-colon within tags (e.g. `[Chorus::anthemic, building to climax]`) to influence emotion or intensity【8†L13-L20】. These structural tags should appear early and frequently for best effect【22†L84-L86】【25†L135-L143】.  
- **Restrict style prompt length:** While older guides gave rigid character limits (4000 chars for lyrics, 900 for style), newer advice is simply to keep prompts **concise and modular**【28†L1-L4】【25†L233-239】. If hitting UI limits, shorten the style prompt to its core elements, and keep section tags in lyrics short (one tag per line)【25†L233-239】.  
- **Leverage voice and instrumentation tags:** Use `[Male Vocal]` or `[Female Vocal]` (and vocal style tags like `[Whisper]`, `[AutoTune]`, etc.) in either the style prompt or the lyrics to fix the vocal character【22†L44-L53】【25†L169-177】. Similarly, instrument tags like `[Piano]`, `[808s]`, `[Guitar]` can be placed in lyrics or style to emphasize certain sounds【22†L44-L53】.  
- **Iterative refinement:** Treat generation as a loop. For professional-quality results, expect to *generate → evaluate → refine lyrics/style → regenerate*【14†L119-L127】【25†L226-L234】. (For example, one might keep the same style prompt and tweak one verse lyric each iteration【25†L229-L233】.) This ensures the output meets the creative intent.  

These best practices will guide our updated template design, making it both **Suno-aware** and **workflow-friendly**.

# Updated Template Design: Manifest with Structure and Controls

Below is a **refactored YAML template** for Suno song generation. It preserves the original intent (title, lyrics, style, etc.) but adds structure, constraints, and validation cues. We include:

- **Meta/Intent** section for song theme or goal.  
- **Lyrics** section with placeholders and suggested section tags.  
- **Style** section encouraging descriptive phrases.  
- **Constraints** for any hard requirements (e.g. no copyrighted text).  
- **Iteration/Evaluation** notes to prompt refinement.  

This manifest-style template is designed to be **machine-parseable** or used as a prompt to a language model that compiles it for Suno.

```yaml
# Song generation manifest for Suno AI (updated)
Meta:
  template_name: "Suno Song Generation 2026"
  version: "2.0"
  created_at: "{{YYYY-MM-DD}}"
  mode: "{{image|video|audio|multimodal}}"  # optional if needed

Intent:
  theme: "{{Core theme or message of the song (e.g., 'overcoming loss')}}" 
  mood: "{{Overall mood or tone (e.g., 'nostalgic', 'urgent')}}"
  # Optional: any narrative or lyrical focus
  narrative: "{{Short description of story or perspective (optional)}}"

Song:
  title: "{{Song Title}}"
  lyrics: |
    [Intro::{{brief mood or instrumentation cue}}]
    {{Insert intro lyrics here (up to ~4000 chars total)}}
    
    [Verse 1::{{brief cue (e.g., theme hint)}}]
    {{Insert verse 1 lyrics here}}
    
    [Pre-Chorus::{{cue (optional)}}]
    {{Insert pre-chorus lyrics (optional)}}
    
    [Chorus::{{brief hook or feeling}}]
    {{Insert chorus lyrics here}}
    
    [Verse 2::{{cue}}]
    {{Insert verse 2 lyrics here}}
    
    [Chorus::{{same hook cue as before}}]
    {{Insert repeated chorus lyrics (or same as above)}}
    
    [Bridge::{{contrasting mood or key change}}]
    {{Insert bridge lyrics here}}
    
    [Final Chorus::{{climax or release note}}]
    {{Insert final chorus lyrics here}}
    
    [Outro::{{closing vibe (e.g., fade-out, emotional)}}
    {{Insert outro lyrics (or leave blank if none)}}
style: "{{comma-separated style descriptors (genre, tempo/BPM, instruments, vocal style, mood)}}"
description: "{{A 1-2 sentence overview of the song’s style and theme}}"
reasoning: "{{Brief explanation of why this style and structure suits the theme}}"

Constraints:
  hard:
    - "{{Any non-negotiable requirement, e.g., 'No profanity'}}"
    - "{{e.g., 'Do not mention brand names or trademarks'}}"
  soft:
    - "{{Any suggestions to avoid, e.g., 'Avoid overly simplistic rhymes'}}"
  # Example Suno-specific guides (optional)
  tags:
    placement: "Put main tags (sections, mood) in the first 20-30 words【22†L84-L86】"
    section_format: "Use [Section] tags exactly (no extra text) to control structure【22†L44-L53】"

Iteration:
  max_rounds: 3
  strategies:
    - "Keep style prompt fixed; tweak lyrics line-by-line【25†L229-L233】"
    - "Ensure section tags produce full structure; add missing tags if needed【25†L135-L143】"
    - "Adjust style descriptors based on tone feedback"
Validation:
  checks:
    - "All required fields (title, lyrics, style, description, reasoning) are non-empty"
    - "Lyrics contain at least one section tag (e.g. [Verse], [Chorus])"
    - "Style prompt is not empty and contains genre or mood"
    - "Length of lyrics <= 4000 characters"
  schema: "Use the provided JSON Schema below to enforce structure."

```

**Notes on this design:** 
- We keep the rich lyric structure (Intro, Verse, Chorus, etc.) but use Suno’s preferred bracket format for tags【22†L44-L53】. 
- The `style` field is now a **comma-separated list of phrases** (genre, BPM, instrumentation, vocal style, mood) instead of single adjectives, following Suno’s style prompt guidelines【26†L1-L4】【25†L193-202】. 
- We added `Constraints` and `Iteration` sections. This guides any automated or manual review: for example, *hard constraints* (no profanity or copyrighted content) and *iteration strategies* (e.g. how to revise). 
- `Validation.checks` suggests using automated checks (via a JSON Schema) to catch missing fields or oversights.

# Usage Examples and Validation

To illustrate how this template works in practice:

- **Filling in the template:** For example, if your song is a **cinematic rock ballad**, you might set  
  - `theme: "mourning loss with hopeful resolution"`  
  - `mood: "somber, uplifting"`  
  - In `Song.lyrics`, use tags like `[Intro::solo piano, atmospheric]`, `[Verse 1::quiet, reflective]`, `[Chorus::powerful, anthemic]`, etc., with actual lyrics underneath each.  
  - In `style`, you might write: *“rock ballad, 70 bpm, piano and strings, male vocals, cinematic, emotional”* to encapsulate genre, tempo, instruments, and emotion.  

- **Iterating for quality:** After generating an initial draft with these fields, review the output. Check that each tag corresponds to the intended section (add `[Pre-Chorus]` or `[Post-Chorus]` if needed) and that the style descriptors match the sound. If the vocals or instrumentation are off, tweak the relevant descriptors or add tags (e.g. `[Female Vocal]`) and regenerate. As Suno’s guides suggest, **reuse the style prompt across iterations and vary only the lyrics** to isolate changes【25†L229-L233】.  

- **Validation checks:** Use the JSON Schema below to automatically verify the final output. For instance, ensure `title`, `lyrics`, `style`, `description`, and `reasoning` are all present and the `lyrics` string is not empty. A schema can catch missing or mislabeled sections before using the song. You might also run a script to count characters or scan for any prohibited words.  

# JSON Schema for Template Validation

This JSON Schema can be used to validate the filled template (after converting YAML to JSON) and enforce required fields and formats:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Suno Song Template Schema",
  "type": "object",
  "properties": {
    "Meta": { "type": "object" },
    "Intent": {
      "type": "object",
      "properties": {
        "theme": { "type": "string" },
        "mood": { "type": "string" },
        "narrative": { "type": "string" }
      },
      "required": ["theme","mood"]
    },
    "Song": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "lyrics": { "type": "string", "maxLength": 4000 }
      },
      "required": ["title","lyrics"]
    },
    "style": { "type": "string" },
    "description": { "type": "string" },
    "reasoning": { "type": "string" },
    "Constraints": { "type": "object" },
    "Iteration": { "type": "object" },
    "Validation": { "type": "object" }
  },
  "required": ["Intent","Song","style","description","reasoning"],
  "additionalProperties": false
}
```

This schema enforces that all the critical sections are present and that `lyrics` does not exceed Suno’s ~4000-char limit. (You can expand the schema with patterns or enums if you want to strictly enforce tag formats.)

# Quick Guide to Using the Updated Template

- **Use Suno tags in lyrics:** Always bracket your sections like `[Intro]`, `[Verse 1]`, `[Chorus]`, etc., with *optional brief cues* after a double-colon (e.g. `[Chorus::anthemic, soaring]`). These tags dramatically improve structure control【22†L44-L53】【25†L135-L143】. Place your most important tags near the beginning of the lyrics prompt【22†L84-L86】.  
- **Focus style on sound, lyrics on words:** In the `style` field, list genre, tempo/BPM, key instruments, vocal style, and mood as comma-separated phrases【26†L1-L4】【25†L193-202】. Don’t repeat this descriptive info in the lyrics section – keep lyrics purely lyrical.  
- **Keep prompts concise:** While there’s no strict character rule, shorter is often better【25†L233-239】. Aim for a clear, punchy style prompt (~100 words max) and use only essential lyrics tags. Avoid long prose in any field.  
- **Iterate methodically:** Generate music, evaluate, and refine. Common strategy: *freeze the style prompt and edit one part of the lyrics at a time*, such as rewriting a verse or chorus, then regenerate【25†L229-L233】. This helps diagnose what adjustments improve the output.  
- **Validate and revise:** Before finalizing, run through the JSON schema to catch missing parts (title, lyrics, style, etc.). Ensure the lyrics read like a cohesive song and the style prompt matches the desired sound.  
- **Explain your choices:** The `description` and `reasoning` fields prompt you to articulate why the song is structured that way. This reflection helps maintain alignment: e.g. *“We chose an anthemic chorus and minor-key verses to match the theme of hope amid despair.”* 
