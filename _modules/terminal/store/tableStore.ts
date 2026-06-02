import {create} from "zustand"
import type {HallZone, Table} from "@shared/types/tables"

const normalizeTableNumber = (num: string): string => {
    const trimmed = num.trim();
    const normalized = trimmed.replace(/^0+/, '');
    return normalized === '' ? '0' : normalized;
  };

interface TableState {
    zones: HallZone[]
    activeZoneId: string | null
    selectedTableId: string | null

    setZones: (zones: HallZone[]) => void
    setActiveZone: (zoneId: string) => void
    selectTable: (tableId: string) => void

    createDynamicTable: (zoneId: string, tableNumber: string) => { success: boolean; table?: Table; error?: string };
}


export const useTableStore = create<TableState>((set, get) => ({
    zones: [],
    activeZoneId: null,
    selectedTableId: null,

    setZones: (zones: HallZone[]) => set({
        zones,
        activeZoneId: zones[0]?.id || null
    }),

    setActiveZone: (activeZoneId: string) => set({activeZoneId, selectedTableId: null}),

    selectTable: (selectedTableId: string) => set({ selectedTableId }),

    createDynamicTable: (zoneId: string, tableNumber: string) => {
        const zones = get().zones;
        
        const normalizedInput = normalizeTableNumber(tableNumber);
    
        const isDuplicate = zones.some(zone => 
          zone.tables.some(table => normalizeTableNumber(table.number) === normalizedInput)
        );
    
        if (isDuplicate) {
          return { 
            success: false, 
            error: `Стол №${normalizedInput} уже существует или занят` 
          };
        }
    
        const newTable: Table = {
          id: `dyn_${Date.now()}`,
          number: normalizedInput,
          status: 'busy',
          capacity: 2,
          isDynamic: true,
          currentOrderId: `order_${Date.now()}`
        };
    
        set(state => ({
          zones: state.zones.map(zone => {
            if (zone.id !== zoneId) return zone;
            return {
              ...zone,
              tables: [...zone.tables, newTable]
            };
          })
        }));
    
        return { success: true, table: newTable };
      }
}))

