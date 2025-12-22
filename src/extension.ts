import * as vscode from "vscode";

import { TextEditor, TextEditorEdit } from "vscode";

var lastReplaced = "";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerTextEditorCommand("advanced-paste-as-string-array.pasteAsStringArray", pasteAsStringArray);
  context.subscriptions.push(disposable);
  // register short menu command so menu label can differ from palette title
  let disposableShort = vscode.commands.registerTextEditorCommand("advanced-paste-as-string-array.pasteAsStringArray.short", pasteAsStringArray);
  context.subscriptions.push(disposableShort);
}

export async function pasteAsStringArray(editor: TextEditor, _edit?: TextEditorEdit) {
  let clipboardContent = await vscode.env.clipboard.readText();

  // read extension configuration
  const config = vscode.workspace.getConfiguration('paste-as-string-array');
  const promptForSeparator = config.get<boolean>('promptForSeparator', true);
  const defaultSeparator = config.get<string>('defaultSeparator', 'newline');
  const defaultSpecialSeparator = config.get<string>('defaultSpecialSeparator', ',');

  // Determine separator choice (ask user if configured to prompt)
  let separatorChoice: 'newline' | 'whitespace' |'special' = 'newline';
  let specialSeparatorValue = defaultSpecialSeparator;
  if (promptForSeparator) {
    const sepPick = await vscode.window.showQuickPick([
      { label: 'New line', detail: 'Split on new lines', value: 'newline' },
      { label: 'Whitespace', detail: 'Split on any whitespace', value: 'whitespace' },
      { label: 'Special character', detail: 'Provide a custom separator', value: 'special' }
    ].map(i => ({ label: i.label, description: i.detail, value: (i as any).value } as any)), {
      placeHolder: 'Choose separator for copied text'
    });

    if (!sepPick) {
      // user cancelled the separator pick -> cancel the whole operation
      return;
    } else {
      separatorChoice = sepPick.value === 'newline' ? 'newline' : sepPick.value === 'special' ? 'special' : 'whitespace';
      if (separatorChoice === 'special') {
        const input = await vscode.window.showInputBox({
          prompt: 'Enter the special separator string (e.g. "," or ";")',
          value: defaultSpecialSeparator
        });
        if (input === undefined) {
          // user cancelled the special-separator input -> cancel the whole operation
          return;
        } else {
          specialSeparatorValue = input;
        }
      }
    }
  } else {
    separatorChoice = (defaultSeparator === 'newline' ? 'newline' : defaultSeparator === 'special' ? 'special' : 'whitespace');
    specialSeparatorValue = defaultSpecialSeparator;
  }

  // Split clipboard content according to chosen separator
  let items: string[] = [];
  if (separatorChoice === 'newline') {
    // split on CRLF (\r\n), LF (\n) or CR (\r) sequences
    items = clipboardContent
      .split(/\r\n|[\r\n]+/)
      .map(s => s.trim())
      .filter(s => s !== '');
  } else if (separatorChoice === 'whitespace') {
    items = clipboardContent
      .trim()
      .split(/\s+/)
      .filter((value) => value !== "")
      .map((value) => value.toString());
  } else {
    // special separator - split by the exact string, then trim
    const sep = specialSeparatorValue;
    if (sep === '') {
      items = [clipboardContent.trim()].filter(s => s !== '');
    } else {
      items = clipboardContent
        .split(sep)
        .map(s => s.trim())
        .filter(s => s !== '');
    }
  }

  const promptForQuote = config.get<boolean>('promptForQuote', true);
  const defaultQuote = config.get<string>('defaultQuote', 'single');

  let chosen: 'single' | 'double' = 'single';

  if (promptForQuote) {
    const pick = await vscode.window.showQuickPick([
      { label: "Single quotes (')", detail: 'Use single quotes', value: 'single' },
      { label: 'Double quotes (\")', detail: 'Use double quotes', value: 'double' }
    ].map(i => ({ label: i.label, description: i.detail, value: (i as any).value } as any)), {
      placeHolder: 'Choose quote style for pasted strings'
    });

    if (!pick) {
      // user cancelled the quote pick -> cancel the whole operation
      return;
    } else {
      chosen = pick.value === 'single' ? 'single' : 'double';
    }
  } else {
    chosen = (defaultQuote === 'single') ? 'single' : 'double';
  }

  // Prompt for paste format: single-line or multi-line
  const promptForFormat = config.get<boolean>('promptForFormat', true);
  const defaultFormat = config.get<string>('defaultFormat', 'single');
  let formatChoice: 'single' | 'multi' = 'single';
  if (promptForFormat) {
    const fmtPick = await vscode.window.showQuickPick([
      { label: 'Single-line', detail: 'Paste all items on one line', value: 'single' },
      { label: 'Multi-line', detail: 'Paste each item on its own line', value: 'multi' }
    ].map(i => ({ label: i.label, description: i.detail, value: (i as any).value } as any)), {
      placeHolder: 'Choose paste format'
    });

    if (!fmtPick) {
      // user cancelled -> cancel the whole operation
      return;
    } else {
      formatChoice = fmtPick.value === 'single' ? 'single' : 'multi';
    }
  } else {
    formatChoice = (defaultFormat === 'single') ? 'single' : 'multi';
  }

  let str: string;
  const joiner = formatChoice === 'multi' ? ',\n' : ', ';
  if (chosen === 'double') {
    // build each item with JSON.stringify so escapes are correct, then join
    str = items.map((s) => JSON.stringify(s)).join(joiner);
  } else {
    // build single-quoted representation: convert each item from JSON escaping
    str = items
      .map((s) => {
        const jsEscaped = JSON.stringify(s); // "..."
        let inner = jsEscaped.slice(1, -1);
        // unescape escaped double quotes so they appear raw inside single-quoted string
        inner = inner.replace(/\\"/g, '"');
        // escape single quotes for single-quoted output
        inner = inner.replace(/'/g, "\\'");
        return "'" + inner + "'";
      })
      .join(joiner);
  }

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
