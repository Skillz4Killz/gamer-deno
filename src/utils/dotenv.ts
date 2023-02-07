import dotenv from 'dotenv'

export function parseEnvFile() {
  const config = dotenv.config({ path: "./src/.env" })
  const parsed: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(config)) {
    if (!isNaN(Number(value))) {
      parsed[key] = Number.MAX_SAFE_INTEGER >= Number(value) ? Number(value) : BigInt(value as string)
      continue
    }

    if (typeof value === 'string') {
      if (value.toUpperCase() === 'TRUE') {
        parsed[key] = true
        continue
      }

      if (value.toUpperCase() === 'FALSE') {
        parsed[key] = false
        continue
      }
    }

    parsed[key] = value
  }

  return parsed
}

export function typeSave(value: unknown, type: 'string', name?: string): string
export function typeSave(value: unknown, type: 'number', name?: string): number
export function typeSave(value: unknown, type: 'bigint', name?: string): bigint
export function typeSave(value: unknown, type: 'boolean', name?: string): boolean
export function typeSave(value: unknown, type: 'symbol', name?: string): symbol
export function typeSave(value: unknown, type: 'undefined', name?: string): undefined
export function typeSave(value: unknown, type: 'object', name?: string): Object
export function typeSave(value: unknown, type: 'function', name?: string): Function
export function typeSave(
  value: unknown,
  type: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function',
  name?: string,
): string | number | bigint | boolean | symbol | undefined | Object | Function {
  if (type === 'number') value = Number(value)
  if (type === 'bigint') value = BigInt(value as any)
  if (type === 'boolean') value = Boolean(value)

  if (typeof value !== type) {
    throw new Error(
      name
        ? `The type for ${name} is invalid it should be ${type} but a ${typeof value} type has been found`
        : `Invalid type provided it should be ${type} but a ${typeof value} type has been found`,
    )
  }

  // @ts-ignore it has the right return type
  return value
}