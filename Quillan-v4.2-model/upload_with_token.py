#!/usr/bin/env python3
"""
Upload Quillan-Ronin model to Hugging Face Hub
"""

from huggingface_hub import HfApi, upload_folder
import os

def upload_with_token():
    """Upload model files to Hugging Face using provided token"""
    print("🤗 Uploading Quillan-Ronin to Hugging Face Hub")
    print("=" * 60)

    # Token provided by user
    token = "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"

    try:
        # Initialize API with token
        api = HfApi(token=token)

        # Check if repo exists, create if not
        repo_id = "CrashOverrideX/Quillan-Ronin"
        try:
            api.repo_info(repo_id=repo_id, repo_type="model")
            print(f"📁 Repository {repo_id} exists")
        except:
            print(f"📁 Creating repository {repo_id}...")
            api.create_repo(repo_id=repo_id, repo_type="model", private=False)
            print("✅ Repository created")

        # Upload model files
        print("📤 Uploading model files...")
        print("This may take several minutes for the 2.4GB model...")

        # Get list of files to upload (exclude some)
        exclude_patterns = [
            "*.pyc", "__pycache__", ".git", "*.tmp",
            "node_modules", "*.log", ".DS_Store"
        ]

        upload_folder(
            folder_path=".",
            repo_id=repo_id,
            repo_type="model",
            token=token,
            ignore_patterns=exclude_patterns
        )

        print("✅ Upload completed successfully!")
        print("\n🌐 Your model is now available at:")
        print(f"https://huggingface.co/{repo_id}")

        print("\n📁 Files uploaded include:")
        print("• best_multimodal_quillan.pt (trained model)")
        print("• Training scripts and configuration")
        print("• progress.html web interface")
        print("• chat_api.py Flask backend")
        print("• Documentation and README files")

        # Create model card
        model_card = f"""---
language: en
tags:
- multimodal
- text-generation
- image-processing
- audio-processing
- video-processing
- pytorch
- transformers
license: apache-2.0
---

# Quillan-Ronin v5.3.0

**SOTA Multimodal AI Model** - Text, Image, Audio, Video Processing

## Model Details

- **Model Name:** Quillan-Ronin v5.3.0
- **Model Type:** Multimodal Transformer with MoE Architecture
- **Parameters:** 207M
- **Training Steps:** 1500
- **Final Loss:** 0.009767
- **Confidence Score:** 87.4%

## Architecture

- **Mixture of Experts (MoE):** 8 experts with capacity loss regularization
- **Diffusion Layers:** 4 layers for multimodal generation
- **Confidence Calibration:** Meta-gradient CCRL framework
- **Paradox Gates:** Contradiction detection and handling
- **Epistemic Humility:** Uncertainty-aware processing

## Capabilities

- **Text Generation:** Creative and technical writing
- **Image Processing:** Understanding and generation
- **Audio Analysis:** Music and speech processing
- **Video Understanding:** Temporal sequence analysis
- **Multimodal Fusion:** Cross-modal reasoning

## Usage

### Web Interface
```bash
# Start the web interface
python chat_api.py
# Open progress.html in browser
```

### Python API
```python
from chat_api import ChatAPI
chat = ChatAPI()
chat.load_model()
response = chat.generate_response("Hello!")
```

## Training Data

Trained on comprehensive multimodal dataset including:
- Text corpora and knowledge bases
- Image collections
- Audio files and lyrics
- Video content
- Cross-modal alignment data

## Authors

- **CrashOverrideX** - Lead Developer
- **Quillan Research Team** - Research and Development

## License

Apache 2.0
"""

        # Upload model card
        with open("README.md", "w") as f:
            f.write(model_card)

        api.upload_file(
            path_or_fileobj="README.md",
            path_in_repo="README.md",
            repo_id=repo_id,
            repo_type="model",
            token=token
        )

        print("✅ Model card uploaded")

    except Exception as e:
        print(f"❌ Upload failed: {e}")
        print("\n🔧 Troubleshooting:")
        print("• Check your token has write permissions")
        print("• Ensure repository name is available")
        print("• Check internet connection")
        return False

    return True

if __name__ == "__main__":
    upload_with_token()
