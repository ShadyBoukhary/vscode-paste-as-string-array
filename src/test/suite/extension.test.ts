/* eslint-disable @typescript-eslint/naming-convention */
import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
// import * as myExtension from '../../extension';
import * as extension from "../../extension";
import * as path from "path";

suite("Extension Test Suite", async () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Paste", async () => {
    let testStrings = {
      "--arg1": `"--arg1"`,
      "--arg1 --arg2 --arg3": `"--arg1","--arg2","--arg3"`,
      "--arg1 1 --arg2 2 --arg3 3": `"--arg1","1","--arg2","2","--arg3","3"`,
    };
    for (let [key, value] of Object.entries(testStrings)) {
      let filepath = path.join(__dirname, '../../../resources/test.txt');
      const newFile = vscode.Uri.file(filepath);
      await vscode.commands.executeCommand("vscode.open", newFile);
      await vscode.commands.executeCommand("editor.action.selectAll", new vscode.Position(0, 0));

      await vscode.env.clipboard.writeText(key);
      let editor = vscode.window.activeTextEditor!;
      await vscode.commands.executeCommand("paste-as-string-array.pasteAsStringArray", vscode.window.activeTextEditor!, null);
      await new Promise(f => setTimeout(f, 100));

      await vscode.commands.executeCommand("editor.action.selectAll", new vscode.Position(0, 0));
      let selection = editor.document.getText(editor.selection);
      // console.log(`Selection: ${selection}`);
      // console.log(`Last replaced: ${extension.getLastReplaced()}`);
      assert.strictEqual(selection, value);
    }
  });
});

// --arg 1 --arg2 2 --arg3 3
