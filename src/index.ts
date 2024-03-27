import { exec } from 'node:child_process'
import {
  type ExtensionContext,
  StatusBarAlignment,
  commands,
  window,
  workspace,
} from 'vscode'
import { checkGitRepoUpdate } from './utils'

export async function activate(context: ExtensionContext) {
  const workspaceFolders = workspace.workspaceFolders
  if (!workspaceFolders || workspaceFolders.length === 0)
    return

  const isNeedPull = await checkGitRepoUpdate(workspaceFolders[0].uri)
  const isNeedPullText = 'ClickUpdate'

  const statusBar = window.createStatusBarItem(StatusBarAlignment.Left, 0)
  statusBar.command = 'gitPull'
  statusBar.text = isNeedPullText

  isNeedPull ? statusBar.show() : statusBar.hide()

  const disposable = commands.registerCommand('gitPull', async () => {
    if (!isNeedPull)
      return
    window.showInformationMessage('start git pull')
    exec(
      `git -C ${workspaceFolders[0].uri.path} pull`,
      (error, _stdout, stderr) => {
        if (error || stderr) {
          window.showErrorMessage('git pull error')
          return
        }

        window.showInformationMessage('git pull success')
        statusBar.hide()
      },
    )
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
