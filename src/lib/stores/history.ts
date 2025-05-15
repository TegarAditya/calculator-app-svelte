import localforage from 'localforage';

/**
 * HistoryStorage is a class that provides methods to store and retrieve
 * a history collection in local storage using localforage.
 */
class HistoryStorage {
	private static key = 'history';

	/**
	 * Insert a value into the history collection
	 * @param val The value to insert into the history collection
	 */
	public static async insert(val: string): Promise<void> {
		const collection = (await localforage.getItem<string[]>(this.key)) || [];
		collection.push(val);
		await localforage.setItem(this.key, collection);
	}

	/**
	 * Retrieve the history collection
	 * @returns The history collection
	 */
	public static async fetch(): Promise<string[]> {
		const collection = (await localforage.getItem<string[]>(this.key)) || [];
		return collection;
	}

	/**
	 * Clear the history collection
	 */
	public static async clear(): Promise<void> {
		await localforage.removeItem(this.key);
	}
}

export default HistoryStorage;
