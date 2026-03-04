#!/usr/bin/env python3
"""
Upload Quillan-Ronin model to Hugging Face Hub
"""

from huggingface_hub import login, upload_folder

def upload_to_huggingface():
    """Upload model files to Hugging Face"""
    print("🤗 Preparing to upload Quillan-Ronin to Hugging Face")
    print("=" * 60)

    try:
        # Login to Hugging Face
        print("🔐 Logging into Hugging Face...")
        print("Note: You'll need to enter your Hugging Face token when prompted")
        print("Get your token from: https://huggingface.co/settings/tokens")
        print()

        login()

        print("✅ Successfully logged in to Hugging Face")

        # Upload model files
        print("📤 Uploading model files...")
        print("Repository: CrashOverrideX/Quillan-Ronin")
        print("This may take a while depending on file sizes...")

        upload_folder(
            folder_path=".",
            repo_id="CrashOverrideX/Quillan-Ronin",
            repo_type="model"
        )

        print("✅ Upload completed successfully!")
        print("\n🌐 Your model is now available at:")
        print("https://huggingface.co/CrashOverrideX/Quillan-Ronin")

        print("\n📁 Files uploaded:")
        print("• Trained model checkpoint")
        print("• Training scripts and configuration")
        print("• Web interface and API")
        print("• Documentation and README files")

    except Exception as e:
        print(f"❌ Upload failed: {e}")
        print("\n🔧 Troubleshooting:")
        print("• Make sure you have a Hugging Face account")
        print("• Generate an access token with write permissions")
        print("• Check your internet connection")
        print("• Try again if the upload was interrupted")

if __name__ == "__main__":
    upload_to_huggingface()
