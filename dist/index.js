"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(src_exports);
var import_node_child_process2 = require("child_process");
var import_vscode = require("vscode");

// src/utils.ts
var import_node_child_process = require("child_process");
async function checkGitRepoUpdate(uri) {
  try {
    const result = await new Promise((resolve) => {
      (0, import_node_child_process.exec)(`git -C ${uri.path} fetch origin && git -C ${uri.path} status -uno`, (error, stdout, stderr) => {
        if (error)
          resolve(false);
        if (stderr)
          resolve(false);
        const r = !(stdout.includes("Your branch is up to date") || stdout.includes("\u4E00\u81F4"));
        resolve(r);
      });
    });
    return !!result;
  } catch (error) {
    return false;
  }
}

// src/index.ts
async function activate(context) {
  const workspaceFolders = import_vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0)
    return;
  const uri = workspaceFolders[0].uri;
  const isNeedPull = await checkGitRepoUpdate(uri);
  const isNeedPullText = "ClickUpdate";
  const statusBar = import_vscode.window.createStatusBarItem(import_vscode.StatusBarAlignment.Left, 0);
  statusBar.command = "gitPull";
  statusBar.text = isNeedPullText;
  isNeedPull ? statusBar.show() : statusBar.hide();
  const disposable = import_vscode.commands.registerCommand("gitPull", async () => {
    if (!isNeedPull)
      return;
    import_vscode.window.showInformationMessage("start git pull");
    (0, import_node_child_process2.exec)(`git -C ${uri.path} pull`, (error, _stdout, stderr) => {
      if (error || stderr) {
        import_vscode.window.showErrorMessage("git pull error");
        return;
      }
      import_vscode.window.showInformationMessage("git pull success");
      statusBar.hide();
    });
  });
  context.subscriptions.push(disposable);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
