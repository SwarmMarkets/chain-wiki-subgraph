export function isIpfs(value: string): boolean {
  let startHashIndex = value.indexOf('Qm')
  if (startHashIndex == -1) {
    return false
  }

  let ipfsPath = value.substring(startHashIndex)
  return ipfsPath.length >= 46
}

export function getIpfsPath(value: string): string {
  return value.substring(value.indexOf('Qm'))
}
