const vscode = require("vscode");

function activate(context) {
  console.log('"Vibe Cleaner is active.');

  let removeCommentsDisposable = vscode.commands.registerCommand(
    "extension.removeComments",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor!");
        return;
      }

      const document = editor.document;
      const text = document.getText();

      const removalRegex =
        /(\/\*[\s\S]*?\*\/)|(\/\/[^\r\n]*)|(`(?:\\`|[^`])*`)|(\/(?![*+?])(?:\\.|[^/\\\r\n])+?\/[gimuy]*)|("(?:\\"|[^"])*")|('(?:\\'|[^'])*')/g;

      const textWithoutComments = text.replace(
        removalRegex,
        (match, multiLineComment, singleLineComment) => {
          if (multiLineComment || singleLineComment) {
            return "";
          } else {
            return match;
          }
        }
      );

      editor.edit((editBuilder) => {
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(text.length)
        );
        editBuilder.replace(fullRange, textWithoutComments);
      });

      vscode.window.showInformationMessage("🧹 Comments cleaned.");
    }
  );

  // 2. console.log'ları Temizle Komutu
  let removeConsoleLogsDisposable = vscode.commands.registerCommand(
    "extension.removeConsoleLogs",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor!");
        return;
      }

      const document = editor.document;
      const text = document.getText();

      const textWithoutConsoleLogs = text.replace(
        /console\.log\s*\([\s\S]*?\);?/g,
        ""
      );

      editor.edit((editBuilder) => {
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(text.length)
        );
        editBuilder.replace(fullRange, textWithoutConsoleLogs);
      });

      vscode.window.showInformationMessage("🧹 console.logs cleaned");
    }
  );

  context.subscriptions.push(removeCommentsDisposable);
  context.subscriptions.push(removeConsoleLogsDisposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
