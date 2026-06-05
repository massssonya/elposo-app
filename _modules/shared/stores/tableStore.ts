import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'
import type {HallZone, Table, TableStatus} from "@shared/types/tables"
import { TableStatus } from "@shared/types/tables"

const normalizeTableNumber = (num: string): string => {
    const trimmed = num.trim();
    const normalized = trimmed.replace(/^0+/, '');
    return normalized === '' ? '0' : normalized;
  };

export interface TableState {
    zones: HallZone[]
    activeZoneId: string | null
    selectedTableId: string | null

    setZones: (zones: HallZone[]) => void
    setActiveZone: (zoneId: string) => void
    selectTable: (tableId: string) => void
    setStatus: (tableId: string, status: TableStatus) => void

    createDynamicTable: (zoneId: string, tableNumber: string) => { success: boolean; table?: Table; error?: string };
    removeDynamicTable: (tableId: string) => void;

    getTableById: (tableId: string) => Table | undefined;
    getAvailableTables: (excludeTableId: string) => Table[];
  }


export const useTableStore = create<TableState>()(
  persist(
    (set, get) => ({
      zones: [],
      activeZoneId: null,
      selectedTableId: null,
  
      setZones: (zones) => {
        const currentActive = get().activeZoneId;
        set({ 
          zones, 
          activeZoneId: currentActive || zones[0]?.id || null 
        });
      },
  
      setActiveZone: (activeZoneId: string) => set({activeZoneId, selectedTableId: null}),
      
      setStatus: (tableId, status) => {
        set((state) => ({
          zones: state.zones.map((zone) => ({
            ...zone,
            tables: zone.tables.map((table) => {
              if (table.id !== tableId) return table;
              
              const currentOrderId = status === TableStatus.FREE ? undefined : table.currentOrderId;

              return {
                ...table,
                status,
                currentOrderId,
              };
            }),
          })),
        }));
      },

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
            status: TableStatus.OCCUPIED,
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
        },

        removeDynamicTable: (tableId) => {
          set((state) => ({
            zones: state.zones.map((zone) => ({
              ...zone,
              tables: zone.tables.filter((table) => table.id !== tableId),
            })),
          }));
        },

        getTableById: (tableId) => {
          return get().zones.flatMap((z) => z.tables).find((t) => t.id === tableId);
        },

        getAvailableTables: (excludeTableId) => {
          return get().zones
            .flatMap((zone) => zone.tables)
            .filter((table) => table.id !== excludeTableId && !table.isDynamic);
        },
  }),
  {
    name: 'pos-halls-layout',
    storage: createJSONStorage(() => localStorage),
  }
  )
)