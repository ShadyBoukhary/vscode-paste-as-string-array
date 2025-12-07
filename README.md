# Advanced Paste as String Array

![CI](https://github.com/koraybilgi/vscode-paste-as-string-array/actions/workflows/ci.yaml/badge.svg)

**Paste anything — instantly format it as a string array.**
This VS Code extension converts whatever you've copied into a clean, ready-to-use **string array**, complete with your chosen delimiter and quote style.

Perfect for developers who frequently transfer data from spreadsheets, logs, or file systems into code.

---

## ✨ What It Does

Copy text from virtually any source:

* Excel or Google Sheets
* Multi-line strings
* Single-line inputs
* Terminal output
* OS folder contents
* File lists, URLs, logs, etc.

Then paste it as a neatly formatted string array, for example:

```
'First', 'Second', 'Third', 'And The Last Item'
```

No more manual find/replace — just paste and code.

### Supported Options

* **Quote style:** single `' '` or double `" "`
* **Separator:** whitespace, newline, or custom
* **Prompt before pasting:** use default settings or choose options each time.

---

## 🚀 Usage

### 1- Context Menu

Right-click inside the editor and select:
`Paste As` > `String Array`

### 2- Command Palette

Run:
`Paste as String Array`

### 3- Editor Title Button

A dedicated poop ( <img src="./images/poop.png" alt="Poop Icon" style="width:20px; vertical-align: sub"/> ) button appears in the editor title for quick access.


---
## ⚙️ Settings

You can customize output preferences in `settings.json`:

```jsonc
{
  // Default quote style: ["double", "single"]
  "paste-as-string-array.defaultQuote": "single",
  // Default separator: ["whitespace", "newline", "special"]
  "paste-as-string-array.defaultSeparator": "newline",
  // Works only if defaultSeparator is "special"
  "paste-as-string-array.defaultSpecialSeparator": ",",
  // Show quote style options when pasting
  "paste-as-string-array.promptForQuote": true,
  // Show separator options when pasting
  "paste-as-string-array.promptForSeparator": true
}
```

---
## 🧪 CI & Reliability

This extension is continuously validated with GitHub Actions to ensure consistent behavior across platforms.

![CI](https://github.com/koraybilgi/vscode-paste-as-string-array/actions/workflows/ci.yaml/badge.svg)

---

### Derived From

This extension is originally based on **ShadyBoukhary**’s [vscode-paste-as-string-array](https://github.com/ShadyBoukhary/vscode-paste-as-string-array) and has been enhanced with additional features and improvements.
