import localforage from 'localforage';

/**
 * HistoryStorage is a class that provides methods to store and retrieve
 * a history collection in local storage using localforage.
 */
class HistoryStorage {
	private key: string;

	/**
	 * HistoryStorage constructor.
	 * @param key The key to use for the history collection in local storage.
	 */
	constructor(key: string = 'history') {
		this.key = key;
	}

	/**
	 * Insert a value into the history collection
	 * @param val The value to insert into the history collection
	 */
	public async insert(val: string): Promise<void> {
		const collection = (await localforage.getItem<string[]>(this.key)) || [];
		collection.push(val);
		await localforage.setItem(this.key, collection);
	}

	/**
	 * Retrieve the history collection
	 * @returns The history collection
	 */
	public async fetch(): Promise<string[]> {
		const collection = (await localforage.getItem<string[]>(this.key)) || [];
		return collection;
	}

	/**
	 * Remove a value from the history collection
	 * @param index The index of the value to remove from the history collection
	 */
	public async remove(index: number): Promise<void> {
		const collection = (await localforage.getItem<string[]>(this.key)) || [];
		if (index > -1 && index < collection.length) {
			collection.splice(index, 1);
			await localforage.setItem(this.key, collection);
		}
	}

	/**
	 * Clears the history collection
	 */
	public async clear(): Promise<void> {
		await localforage.removeItem(this.key);
	}

	/**
	 * A default instance that uses the 'history' key.
	 */
	static default = new HistoryStorage();
}

export default HistoryStorage;
