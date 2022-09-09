import * as vscode from "vscode";

import { TextEditor, TextEditorEdit } from "vscode";

var lastReplaced = "";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerTextEditorCommand("paste-as-string-array.pasteAsStringArray", pasteAsStringArray);
  context.subscriptions.push(disposable);
}

export async function pasteAsStringArray(editor: TextEditor, edit?: TextEditorEdit) {
  // vscode.window.showInformationMessage("Hello World from Paste as String Array!");
  // console.log("Hello from pasteAsStringArray");
  let clipboardContent = await vscode.env.clipboard.readText();
  let str: string = JSON.stringify(
    clipboardContent
      .trim()
      .split(" ")
      .map((value) => value.toString())
  ).slice(1, -1);

  editor.selections.forEach((selection, _) => {
    editor.edit((editBuilder) => {
      editBuilder.replace(selection, str);
      lastReplaced = str;
    });
  });
}

export function getLastReplaced(): string {
  return lastReplaced;
}

// this method is called when your extension is deactivated
export function deactivate() {}
