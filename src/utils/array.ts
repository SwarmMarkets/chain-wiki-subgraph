export function push<T>(arr: T[], item: T): T[] {
  arr.push(item)
  return arr
}

export function remove<T>(arr: T[], item: T): T[] {
  let index = arr.indexOf(item)
  if (index !== -1) {
    arr.splice(index, 1)
  }
  return arr
}
