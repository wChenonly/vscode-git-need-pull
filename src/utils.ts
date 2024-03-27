import { exec } from 'node:child_process'
import type { Uri } from 'vscode'

export async function checkGitRepoUpdate(uri: Uri) {
  try {
    const result = await new Promise((resolve) => {
      exec(`git -C ${uri.path} fetch origin && git -C ${uri.path} status -uno`, (error, stdout, stderr) => {
        if (error)
          resolve(false)
        if (stderr)
          resolve(false)
        const r = !(stdout.includes('Your branch is up to date') || stdout.includes('一致'))
        resolve(r)
      })
    })
    return !!result
  }
  catch (error) {
    return false
  }
}
