import * as vscode from "vscode";
import simpleGit, { SimpleGit } from "simple-git";
import OpenAI from "openai";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "wdic.summarizeGitChanges",
    async () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;

      if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace is open.");
        return;
      }

      const configuration = vscode.workspace.getConfiguration("wdic");
      const openaiApiKey = configuration.get<string>("openaiApiKey");

      if (!openaiApiKey) {
        vscode.window.showErrorMessage(
          "OpenAI API key is not set. Please set it in the extension settings."
        );
        return;
      }

      const openai = new OpenAI({ apiKey: openaiApiKey });

      const workspaceRoot = workspaceFolders[0].uri.fsPath;
      const git: SimpleGit = simpleGit(workspaceRoot);

      try {
        const statusSummary = await git.status();
        const changes = await Promise.all(
          statusSummary.files.map(async (file) => {
            const diff = await git.diff([file.path]);
            const rephrasedDescription = await rephraseChangeDescription(
              openai,
              diff
            );

            return rephrasedDescription;
          })
        );

        const changeText = changes.join("\n");

        if (changeText.length === 0) {
          vscode.window.showInformationMessage(
            "No changes detected in the Git repository."
          );
          return;
        }

        vscode.workspace
          .openTextDocument({ content: changeText, language: "plaintext" })
          .then((doc) => {
            vscode.window.showTextDocument(doc, { preview: false });
          });
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to summarize Git changes: " + (error as any).message
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

async function rephraseChangeDescription(
  openai: OpenAI,
  diff: string
): Promise<string> {
  const prompt = `As a developer finishing his work and about to make a new commit message, write a short, simple, and clear commit message in human-readable English. The message should:
            1. Describe the changes made.
            2. Follow the Conventional Commits style.
            3. Be concise and not exceed 120 characters.
            4.Use only alphabetic characters.
            Here's an example of a commit message:
            feat: add new Card component to render card header
            ${diff}`;
  try {
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 150,
      temperature: 0.7,
    });
    return response.choices[0].text.trim() || diff;
  } catch (error) {
    vscode.window.showErrorMessage(
      "Failed to rephrase description: " + (error as any).message
    );
    return diff;
  }
}
