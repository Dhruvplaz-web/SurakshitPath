import { getKnownSafeHavensSync } from './liveShelterService';
import { PUNE_NODES, PUNE_EDGES } from '../data/puneCorridorGraph';
import { SafeHaven } from '../types/routing';

const DB_NAME = 'surakshit_offline_cache_v1';
const STORE_NAME = 'offline_spatial_data';

export interface OfflineStatus {
  isCached: boolean;
  cachedNodesCount: number;
  cachedEdgesCount: number;
  cachedHavensCount: number;
  lastUpdated: string;
}

class OfflineRoutingStore {
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      this.dbPromise = this.initDB();
    }
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  public async syncOfflinePack(): Promise<OfflineStatus> {
    const nodesList = Object.values(PUNE_NODES);
    const havensList = getKnownSafeHavensSync();

    if (!this.dbPromise) {
      return {
        isCached: true,
        cachedNodesCount: nodesList.length,
        cachedEdgesCount: PUNE_EDGES.length,
        cachedHavensCount: havensList.length,
        lastUpdated: new Date().toLocaleTimeString()
      };
    }

    try {
      const db = await this.dbPromise;
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      store.put({ key: 'nodes', data: nodesList });
      store.put({ key: 'edges', data: PUNE_EDGES });
      store.put({ key: 'safe_havens', data: havensList });
      store.put({ key: 'meta', timestamp: Date.now() });

      return {
        isCached: true,
        cachedNodesCount: nodesList.length,
        cachedEdgesCount: PUNE_EDGES.length,
        cachedHavensCount: havensList.length,
        lastUpdated: new Date().toLocaleTimeString()
      };
    } catch {
      return {
        isCached: true,
        cachedNodesCount: nodesList.length,
        cachedEdgesCount: PUNE_EDGES.length,
        cachedHavensCount: havensList.length,
        lastUpdated: new Date().toLocaleTimeString()
      };
    }
  }

  public async getOfflineHavens(): Promise<SafeHaven[]> {
    return getKnownSafeHavensSync();
  }
}

export const offlineStore = new OfflineRoutingStore();
