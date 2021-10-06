export class StoreError extends Error {
  message: string

  constructor(message: string) {
    super(message)
    this.message = message
  }
}

export abstract class Store<T, Key extends string | number | symbol = string> {
  create(value: T): Promise<Key> {
    throw new StoreError(
      [
        `The method is not implemented: create`,
        `  class name: ${this.constructor.name}`,
      ].join("\n")
    )
  }

  createMany(array: Array<T>): Promise<Array<Key>> {
    throw new StoreError(
      [
        `The method is not implemented: createMany`,
        `  class name: ${this.constructor.name}`,
      ].join("\n")
    )
  }

  abstract get(key: Key): Promise<T | undefined>

  async getOrFail(key: Key): Promise<T> {
    const value = await this.get(key)
    if (value === undefined) {
      throw new StoreError(
        [
          `I can not get value`,
          `  class name: ${this.constructor.name}`,
          `  key: ${key}`,
        ].join("\n")
      )
    } else {
      return value
    }
  }

  all(): Promise<Record<string, T>> {
    throw new StoreError(
      [
        `The method is not implemented: all`,
        `  class name: ${this.constructor.name}`,
      ].join("\n")
    )
  }

  async keys(): Promise<Array<string>> {
    return Object.keys(await this.all())
  }

  find(query: Partial<T>): Promise<Record<string, T>> {
    throw new StoreError(
      [
        `The method is not implemented: find`,
        `  class name: ${this.constructor.name}`,
      ].join("\n")
    )
  }

  async findFirst(query: Partial<T>): Promise<[string, T] | undefined> {
    const results = await this.find(query)
    const entries = Object.entries<T>(results)
    return entries[0]
  }

  async findFirstOrFail(query: Partial<T>): Promise<[string, T]> {
    const value = await this.findFirst(query)
    if (value === undefined) {
      throw new StoreError(
        [
          `I can not find first value`,
          `  class name: ${this.constructor.name}`,
          `  query: ${JSON.stringify(query)}`,
        ].join("\n")
      )
    } else {
      return value
    }
  }

  async has(key: Key): Promise<boolean> {
    const value = await this.get(key)
    if (value === undefined) {
      return false
    } else {
      return true
    }
  }

  async set(key: Key, value: T): Promise<boolean> {
    return this.update(key, value)
  }

  update(key: Key, value: Partial<T>): Promise<boolean> {
    throw new StoreError(
      [
        `The method is not implemented: patch`,
        `  class name: ${this.constructor.name}`,
      ].join("\n")
    )
  }

  delete(key: Key): Promise<boolean> {
    throw new StoreError(
      [
        `The method is not implemented: delete`,
        `  class name: ${this.constructor.name}`,
      ].join("\n")
    )
  }
}
