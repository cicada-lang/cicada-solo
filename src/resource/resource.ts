export abstract class Resource<T, Key extends string | number | symbol> {
  abstract create(data: T): Promise<Key>
  abstract create_many(array: Array<T>): Promise<Array<Key>>

  abstract get(key: Key): Promise<T | undefined>
  abstract get_or_fail(key: Key): Promise<T>

  abstract keys(): Promise<Array<Key>>
  abstract all(): Promise<Record<Key, T>>

  abstract find(query: Partial<T>): Promise<Record<Key, T>>
  abstract find_first(query: Partial<T>): Promise<[Key, T] | undefined>
  abstract find_first_or_fail(query: Partial<T>): Promise<[Key, T]>

  abstract has(key: Key): Promise<boolean>
  // NOTE The returnd boolean of `put` and `patch`:
  // - true  -- update -- already `has`
  // - false -- insert
  abstract put(key: Key, data: T): Promise<boolean>
  abstract patch(key: Key, data: Partial<T>): Promise<boolean>

  abstract delete(key: Key): Promise<boolean>
}
