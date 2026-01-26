// Generic class for handling localStorage operations
export class ParticipateLogsRepo {
  constructor(private storageKey: string) {}

  saveItems(items: ParticipationLog[]): void {
    try {
      const serializedItems = JSON.stringify(items);
      localStorage.setItem(this.storageKey, serializedItems);
    } catch (error) {
      console.error('Error saving items to localStorage:', error);
    }
  }

  loadItems(): ParticipationLog[] {
    try {
      const serializedItems = localStorage.getItem(this.storageKey);
      if (serializedItems === null) {
        return [];
      }
      return JSON.parse(serializedItems) as ParticipationLog[];
    } catch (error) {
      console.error('Error loading items from localStorage:', error);
      return [];
    }
  }

  addItem(item: ParticipationLog): void {
    const items = this.loadItems();
    items.push(item);
    this.saveItems(items);
  }

  getItems(): ParticipationLog[] {
    return this.loadItems();
  }
}

export let participationLogsRepo = new ParticipateLogsRepo('participation-logs');

export type ParticipationLog = {
  fromEpoch: number;
  numberOfEpochs: number;
};
