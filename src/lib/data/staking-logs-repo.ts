// Generic class for handling localStorage operations
export class StakingLogsRepo {
  constructor(private storageKey: string) {}

  saveItems(items: StakingLog[]): void {
    try {
      const serializedItems = JSON.stringify(items);
      localStorage.setItem(this.storageKey, serializedItems);
    } catch (error) {
      console.error('Error saving items to localStorage:', error);
    }
  }

  loadItems(): StakingLog[] {
    try {
      const serializedItems = localStorage.getItem(this.storageKey);
      if (serializedItems === null) {
        return [];
      }
      return JSON.parse(serializedItems) as StakingLog[];
    } catch (error) {
      console.error('Error loading items from localStorage:', error);
      return [];
    }
  }

  addItem(item: StakingLog): void {
    const items = this.loadItems();
    items.push(item);
    this.saveItems(items);
  }

  getItems(): StakingLog[] {
    return this.loadItems();
  }
}

export let stakingLogsRepo = new StakingLogsRepo('staking-logs');

export type StakingLog = {
  fromEpoch: number;
  numberOfEpochs: number;
};
