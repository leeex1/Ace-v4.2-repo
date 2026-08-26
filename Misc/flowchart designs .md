---
file_type: reference
domain: misc
status: active
tags: [mermaid, architecture, hnmoe]
---
Mermaid chart 1 :
```mermaid
flowchart TD

    subgraph LEGEND____System_Overview__
        L1["<b>ADVANCED HNMoE TOPOLOGY</b><br/>━━━━━━━━━━━━━━━━━━<br/>🔹 Params:4B (Distributed)<br/>🔹 Council:96 Personas<br/>🔹 Agents:896k (9k/Persona)<br/>🔹 Energy:ℰ_Ω ≈ 2e-8 J"]
    end

    subgraph INPUT____INPUT_LAYER__
        I1(["📥 Input Signals"])
        E1["Token Embed<br/>[Vocab × 1024]"]
        E2["Position Embed<br/>[16k × 1024]"]
        E3["Contextual Embed<br/>[Dynamic / Static]"]
    end

    subgraph HIDDEN____VECTOR_DECOMPOSITION__
        direction TB
        H1["H1:Language"]
        H2["H2:Sentiment"]
        H3["H3:Context"]
        H4["H4:Intent"]
        H5["H5:Meta-Reasoning"]
        H6["H6:Ethics"]
        H7["H7:Priority"]
        H8["H8:Novelty"]
        H9["H9:Cultural Relevance"]
        H10["H10:User Preferences"]
        H11["H11:Historical Data"]
        H12["H12:Scenario Analysis"]
    end

    subgraph ROUTE_____ROUTER___ATTENTION__
        AR1{{"Attention Group 1<br/>C1-C32"}}
        AR2{{"Attention Group 2<br/>C33-C64"}}
        AR3{{"Attention Group 3<br/>C65-C96"}}
    end

    subgraph COUNCIL_____COUNCIL_PROCESSING__
        W1["Wave 1:Reflect"]
        W2["Wave 2:Synthesize"]
        W3["Wave 3:Formulate"]
        W4["Wave 4:Activate"]
        W5["Wave 5:Explain"]
        W6["Wave 6:Evaluate"]
        W7["Wave 7:Iterate"]
        W8["Wave 8:Feedback Integration"]
    end

    subgraph SWARMS____MICRO_SWARMS__
        SW["896k Micro-Agents<br/>(Distributed Processing)"]
    end

    subgraph EXTERNAL____EXTERNAL__
        WEB[("Web Search<br/>RAG / APIs & Databases")]
        API[("API Calls<br/>External Services")]
        SOCIAL[("Social Media Data<br/>Sentiment Analysis")]
    end

    subgraph GATES____QUALITY_GATES__
        QT{"QT Check"}
        FAIL["❌ FAIL<br/>(Retry Loop)"]
        EICE(["🌡️ E_ICE Bounds<br/>ℰ_Ω = 2e-8 J"])
        REVIEW["🔍 Review Process"]
    end

    subgraph OVERSEER_____OVERSEER__
        OS(("Meta-Coordinator"))
        RM[("Risk Management")]
        QA[("Quality Assurance")]
    end

    subgraph OUTPUT____OUTPUT__
        O1["Logits Projection"]
        O2["Final Vector"]
        O3["Response Generation"]
        O4["Output Validation"]
        O5["User Feedback Incorporation"]
    end

    I1 --> E1_&_E2_&_E3
    E1 & E2 & E3 --> H1_&_H2_&_H3_&_H4_&_H5_&_H6_&_H7_&_H8_&_H9_&_H10_&_H11_&_H12

    H1 & H2 & H3 --> AR1
    H4 & H5 & H6 & H7 & H8 & H9 --> AR2
    H10 & H11 & H12 --> AR3

    AR1 & AR2 & AR3 --> W1
    W1 --> W2 --> W3 --> W4 --> W5 --> W6 --> W7 --> W8
    
    W6 --> SW
    SW <--> WEB
    SW <--> API
    SW <--> SOCIAL
    
    SW --> QT
    EICE -.-> QT
    REVIEW -.-> QT
    QT -- "Pass" --> OS
    QT -- "Fail" --> FAIL
    FAIL -.->|"Refine"| SW

    OS --> RM --> QA --> O1 --> O2 --> O3
    O3 --> O4
    O4 --> O5
    O5 -.->|"Feedback Loop"| I1
```

# Flowchart 2:
```mermaid
flowchart TD

    subgraph LEGEND____Enhanced_System_Overview__
        L1["<b>QUILLAN HNMoE EXPANDED</b><br/>━━━━━━━━━━━━━━━━━━<br/>🔹 Council:64 Personas<br/>🔹 Agents:500k Total<br/>🔹 WoT:50+ Branches<br/>🔹 Waves:10 Stages"]
    end

    subgraph INPUT____INPUT__
        IN(["📥 User Query/Data"])
    end

    subgraph ROUTER_____ROUTING__
        RT{{"Smart Router<br/>Top-K & Hybrid Selection"}}
    end

    subgraph COUNCIL_____COUNCIL_____PERSONAS___
        C{{"64-Member Council<br/>Hierarchical Coordination & Enhanced Feedback"}}
    end

    subgraph SWARMS____MICRO_SWARMS__
        S["500k Specialized Agents<br/>Distributed Intelligence with Enhanced Capabilities"]
    end

    subgraph WOT____WEB_OF_THOUGHT__
        direction TB
        B1(("Branch Gen<br/>50 Paths"))
        B2(("Explore<br/>Alternative Strategies"))
        E(("Evaluate<br/>Confidence & Safety Analysis"))
        P1(("Pruning<br/>Top-30 Candidates"))
        P2(("Assess<br/>Risk & Reliability"))
        M(("Converge<br/>Merge & Cross-examine"))
    end

    subgraph WAVES______WAVE_PROCESSING__
        W1["Multi-Parallel 16-Step Process<br/>━━━━━━━━━━━━━━<br/>1.Reflect & Analyze<br/>2.Synthesize Ideas<br/>3.Formulate Solutions<br/>4.Activate Expertise<br/>5.Verify & Explain<br/>6.Iterate & Enhance<br/>7.Validate & Confirm<br/>8.Finalize Outputs<br/>9.Audit Outcomes<br/>10.Update Knowledge Base"]
    end

    subgraph QUALITY____QUALITY_GATES__
        Q{"QT Check<br/>Quality Threshold"}
        Q1{"Enhanced Review<br/>Cross-Validation"}
        F{"❌ FAIL Handler<br/>Retry Logic & Escalation"}
    end

    subgraph EXTERNAL____EXTERNAL__
        X[("Web Search<br/>RAG / Tools & APIs")]
    end

    subgraph OVERSEER_____OVERSEER__
        O(("Meta-Coordination<br/>Final Verification & Reporting"))
    end

    subgraph OUTPUT____OUTPUT__
        OUT["Final Response<br/>Formatted,Traced & Optimized for User"]
    end

    IN --> RT
    RT --> C
    C --> S
    
    S --> B1
    B1 --> E --> P1 --> P2 --> M
    B2 --> E
    
    M --> W1

    S <--> X
    X -.-> Q
    
    W1 --> Q
    Q -- "Pass" --> Q1
    Q1 -- "Confirm" --> O
    Q -- "Fail" --> F
    F -.->|"Retry or Escalate"| S
    
    O --> OUT 
```
## Connections
- [[Quillan Knowledge files/1-Quillan_architecture_flowchart.md]]
- [[Quillan Knowledge files/9-Quillan Brain mapping.md]]
- [[Software Engineer/Quillan-XSWE.md]]
- [[Skills/planning_and_task_decomposition/planning_and_task_decomposition.md]]
- [[system prompts/Quillan-Samurai.md]]
- [[00 - Meta/00 - Vault Index.md]]
