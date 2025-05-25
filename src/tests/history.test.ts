import { describe, it, expect, beforeEach, vi, afterAll } from 'vitest';
import localforage from 'localforage';
import HistoryStorage from '$lib/stores/history';

vi.mock('localforage', () => ({
	default: {
		getItem: vi.fn(),
		setItem: vi.fn(),
		removeItem: vi.fn()
	}
}));

describe('HistoryStorage (instance)', () => {
	const key = 'history_test';
	let history: HistoryStorage;

	beforeEach(() => {
		vi.clearAllMocks();
		history = new HistoryStorage(key);
	});

	it('should insert a value into an empty history', async () => {
		(localforage.getItem as any).mockResolvedValueOnce(null);

		await history.insert('test1');

		expect(localforage.getItem).toHaveBeenCalledWith(key);
		expect(localforage.setItem).toHaveBeenCalledWith(key, ['test1']);
	});

	it('should insert a value into existing history', async () => {
		(localforage.getItem as any).mockResolvedValueOnce(['old']);

		await history.insert('new');

		expect(localforage.getItem).toHaveBeenCalledWith(key);
		expect(localforage.setItem).toHaveBeenCalledWith(key, ['old', 'new']);
	});

	it('should fetch the history', async () => {
		const data = ['a', 'b'];
		(localforage.getItem as any).mockResolvedValueOnce(data);

		const result = await history.fetch();

		expect(localforage.getItem).toHaveBeenCalledWith(key);
		expect(result).toEqual(data);
	});

	it('should return empty array if no history exists', async () => {
		(localforage.getItem as any).mockResolvedValueOnce(null);

		const result = await history.fetch();

		expect(result).toEqual([]);
	});

	it('should remove a value at a valid index', async () => {
		(localforage.getItem as any).mockResolvedValueOnce(['a', 'b', 'c']);

		await history.remove(1);

		expect(localforage.setItem).toHaveBeenCalledWith(key, ['a', 'c']);
	});

	it('should not remove a value at an invalid index', async () => {
		(localforage.getItem as any).mockResolvedValueOnce(['a', 'b']);

		await history.remove(5);

		expect(localforage.setItem).not.toHaveBeenCalled();
	});

	it('should clear the history', async () => {
		await history.clear();

		expect(localforage.removeItem).toHaveBeenCalledWith(key);
	});
});
