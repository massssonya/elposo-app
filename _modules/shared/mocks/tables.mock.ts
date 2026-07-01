import { HallZone, TableStatus } from '@shared/types/tables';

export const MOCK_ZONES: HallZone[] = [
    {
      id: 'zone_main',
      name: 'Основной зал',
      isFlexibleHall: false,
      tables: [
        { id: 't1', number: '1', status: TableStatus.FREE, capacity: 2, isDynamic: false, x: 2, y: 70, width: 8, height: 14, shape: 'circle' },
        { id: 't2', number: '2', status: TableStatus.FREE, capacity: 2, isDynamic: false, x: 2, y: 50, width: 8, height: 14, shape: 'circle' },
        { id: 't3', number: '3', status: TableStatus.FREE, capacity: 2, isDynamic: false, x: 2, y: 30, width: 8, height: 14, shape: 'circle' },
        { id: 't4', number: '4', status: TableStatus.FREE, capacity: 2, isDynamic: false, x: 2, y: 10, width: 8, height: 14, shape: 'circle' },
        { id: 't5', number: '5', status: TableStatus.FREE, capacity: 2, isDynamic: false, x: 16, y: 4, width: 8, height: 14, shape: 'rectangle' },
        { id: 't6', number: '6', status: TableStatus.FREE, capacity: 2, isDynamic: false, x: 30, y: 4, width: 8, height: 14, shape: 'rectangle' },
        { id: 't7', number: '7', status: TableStatus.FREE, capacity: 2, isDynamic: false, x: 44, y: 4, width: 8, height: 14, shape: 'rectangle' },
        { id: 't8', number: '8', status: TableStatus.FREE, capacity: 2, isDynamic: false, x: 60, y: 4, width: 16, height: 14, shape: 'rectangle' },
        { id: 't9', number: '9', status: TableStatus.FREE, capacity: 2, isDynamic: false, x: 82, y: 4, width: 16, height: 14, shape: 'rectangle' },
        { id: 't10', number: '10', status: TableStatus.FREE, capacity: 4, isDynamic: false, x: 20, y: 30, width: 15, height: 30, shape: 'rectangle' },
        { id: 't11', number: '11', status: TableStatus.FREE, capacity: 4, isDynamic: false, x: 40, y: 40, width: 15, height: 30, shape: 'rectangle' },
        { id: 't12', number: '12', status: TableStatus.FREE, capacity: 10, isDynamic: false, x: 70, y: 30, width: 20, height: 60, shape: 'circle' },
        { id: 't13', number: '13', status: TableStatus.FREE, capacity: 2, isDynamic: false, x: 16, y: 85, width: 8, height: 14, shape: 'circle' },
        { id: 't14', number: '14', status: TableStatus.FREE, capacity: 2, isDynamic: false, x: 26, y: 85, width: 8, height: 14, shape: 'circle' },
        { id: 't15', number: '15', status: TableStatus.FREE, capacity: 2, isDynamic: false, x: 36, y: 85, width: 8, height: 14, shape: 'circle' },
      ]
    },
    {
      id: 'zone_fast',
      name: 'Быстрая выдача',
      isFlexibleHall: true,
      tables: []
    }
  ];