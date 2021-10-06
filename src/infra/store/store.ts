export abstract class Store<T, Key extends string | number | symbol = string> {
  create(data: T): Promise<Key> {
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
    const data = await this.get(key)
    if (data === undefined) {
      throw new StoreError(
        [
          `I can not get data`,
          `  class name: ${this.constructor.name}`,
          `  key: ${key}`,
        ].join("\n")
      )
    } else {
      return data
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
    const data = await this.findFirst(query)
    if (data === undefined) {
      throw new StoreError(
        [
          `I can not find first data`,
          `  class name: ${this.constructor.name}`,
          `  query: ${JSON.stringify(query)}`,
        ].join("\n")
      )
    } else {
      return data
    }
  }

  async has(key: Key): Promise<boolean> {
    const data = await this.get(key)
    if (data === undefined) {
      return false
    } else {
      return true
    }
  }

  // NOTE The returnd boolean of `set` and `patch`:
  // - true  -- update -- already `has`
  // - false -- insert

  async set(key: Key, data: T): Promise<boolean> {
    return this.update(key, data)
  }

  update(key: Key, data: Partial<T>): Promise<boolean> {
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

export class StoreError extends Error {
  message: string

  constructor(message: string) {
    super(message)
    this.message = message
  }
}
