# VSCode Git Commit Message Generator Extension

This VSCode extension helps you generate commit messages based on your Git changes. It uses OpenAI to rephrase the changes into concise, human-readable commit messages.

## Features

- Automatically summarize Git changes.

- Generate commit messages following the Conventional Commits style.

- Display the generated commit message in a new document for review.

## Requirements

1. An OpenAI API key.

## Installation

1. Install the extension from the VSCode marketplace.

2. Set up your OpenAI API key in the extension settings.

## Usage

- Open a workspace in VSCode.

- Make some changes in your Git repository.

- Run the command "What did i change" from the command palette (Ctrl+Shift+P).

- Review the generated commit message displayed in a new document.

## Extension Settings

To use this extension, you need to configure the OpenAI API key:

1. Go to File > Preferences > Settings (or Code > Preferences > Settings on macOS).

2. Search for wdic.

3. Enter your OpenAI API key in the OpenAI API Key field.

## Example

**Here's an example of how the extension works:**

- You make changes in your Git repository.

- You run the "Summarize Git Changes" command.

- The extension summarizes the changes and generates a commit message like:

```vbnet
feat: add new Card component to render card header
```
