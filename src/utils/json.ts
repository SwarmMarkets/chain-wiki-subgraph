import {
  JSONValue,
  JSONValueKind,
  log,
  TypedMap,
} from '@graphprotocol/graph-ts'

export namespace jsonUtils {
  export function parseString(value: JSONValue | null): string | null {
    if (value !== null) {
      if (value.kind === JSONValueKind.STRING) {
        return value.toString()
      }

      log.warning(
        'jsonUtils(parseString): You are trying to parse value as string, but kind of value is {}',
        [value.kind.toString()],
      )
    }

    return null
  }

  export function parseObject(
    value: JSONValue,
  ): TypedMap<string, JSONValue> | null {
    if (value !== null) {
      if (value.kind === JSONValueKind.OBJECT) {
        return value.toObject()
      }

      log.warning(
        'jsonUtils(parseObject): You are trying to parse value as object, but kind of value is {}',
        [value.kind.toString()],
      )
    }
    return null
  }
}
