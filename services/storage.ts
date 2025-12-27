
import Dexie, { type Table } from 'dexie';
import { MedicalEncounter } from '../types';

/**
 * PHASE 4: THE SHIELD (Persistence Layer)
 * Handles local-only IndexedDB storage for clinical encounters using Dexie.
 */

class RanvierVault extends Dexie {
  encounters!: Table<MedicalEncounter>;

  constructor() {
    super('RanvierVault');
    // v1: Define schema
    // Cast 'this' to any to bypass TS error on version() method in strict mode
    (this as any).version(1).stores({
      encounters: 'id, timestamp, status' // Primary key 'id', indexes on timestamp and status
    });
  }
}

export const db = new RanvierVault();

export const saveEncounter = async (encounter: MedicalEncounter): Promise<void> => {
  await db.encounters.put(encounter);
};

export const getAllEncounters = async (): Promise<MedicalEncounter[]> => {
  return await db.encounters.toArray();
};

export const deleteEncounter = async (id: string): Promise<void> => {
  await db.encounters.delete(id);
};
