# GitHub Actions for Code Manager

This document explains how to use the GitHub Actions workflow set up for automatically building the Code Manager app.

## Available Workflow

**Android Build** - Builds a fully installable Android APK file whenever changes are pushed to the main branch

## How to Use

### Prerequisites

1. Push your code to GitHub by following these steps:
   ```
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/Code-Manager.git
   git push -u origin main
   ```

2. For a fully signed and installable APK, make sure your GitHub repository has the following secrets set up for release builds:
   - `ANDROID_KEYSTORE_BASE64`: Your keystore file encoded as base64 (you can convert your existing keystore file with `base64 -w 0 release-key.keystore > keystore-base64.txt`)
   - `ANDROID_KEYSTORE_PASSWORD`: The password for your keystore ("kumelachew")
   - `ANDROID_KEY_ALIAS`: The alias of your key (typically "release-key-alias")
   - `ANDROID_KEY_PASSWORD`: The password for your key (typically the same as your keystore password)
   
   Note: Even without these secrets, the workflow will still build an unsigned APK that can be installed on debug-enabled devices.

### Viewing and Installing Builds

1. After pushing code to GitHub, go to your repository on GitHub.com
2. Click on the "Actions" tab to see your workflow runs
3. Click on a workflow run to see details
4. Under the "Artifacts" section, you can download the built APK file
5. Transfer this APK to your Android device and install it directly
   - You may need to enable "Install from Unknown Sources" in your device settings
   - The APK is a complete, installable package - no additional steps required

### Customizing the Workflow

You can customize the workflow by editing the YAML file in the `.github/workflows/` directory:

- `android-build.yml` - For Android build settings

## Automated Release Process

To set up automated releases:

1. Tag your commits with version numbers:
   ```
   git tag -a v1.0.0 -m "Version 1.0.0"
   git push origin v1.0.0
   ```

2. Create a new workflow file called `release.yml` with content that triggers on tags and creates GitHub releases

## Troubleshooting

If your builds fail, check the following:

1. Make sure all dependencies are correctly specified in your package.json
2. Check that your Android build.gradle files are correctly configured
3. Review the build logs in the GitHub Actions tab for specific errors

For more help, refer to the [GitHub Actions documentation](https://docs.github.com/en/actions).
