'use client';

import React, { useState, useCallback } from 'react';

import { HallZone, Table } from '@shared/types/tables';
import { FlexLayout } from '@shared/components/Layout/FlexLayout'
import { GridLayout } from '@shared/components/Layout/GridLayout'
import { Numpad } from '@shared/components/Numpad';
import { useNumpadState } from '@shared/components/Numpad/useNumpadState';
import { Message } from '@shared/components/Message';

import styles from './DynamicZoneCanvas.module.css';

interface DynamicZoneCanvasProps {
  zone: HallZone;
  onTableClick: (table: Table) => void;
  onCreateDynamicOrder: (
    zoneId: string, 
    tableNumber: string
  ) => { success: boolean; error?: string };
}

const LIMIT_DYN_INPUT = 3;

export const DynamicZoneCanvas = React.memo(({
  zone,
  onTableClick,
  onCreateDynamicOrder,
}: DynamicZoneCanvasProps) => {
  const { 
    value: tableNumber, 
    error: localError, 
    resetAll, 
    resetValue, 
    setManualError, 
    numpadProps 
  } = useNumpadState({
    maxLength: LIMIT_DYN_INPUT,
  });

  const handleSubmit = () => {
    if (!tableNumber) return;
    
    const result = onCreateDynamicOrder(zone.id, tableNumber);
    
    if (result.success) {
      resetAll();
    } else {
      setManualError(result.error || 'Ошибка создания стола');
      resetValue();
    }
  };

  return (
    <div className={styles.canvas}>
      <FlexLayout 
        direction="row" 
        gap="lg" 
        align="stretch" 
        className={styles.dynamicLayout}
      >
        <FlexLayout 
          direction="col" 
          gap="sm" 
          className={styles.dynamicControl}
        >
          <FlexLayout 
            align="center"
            justify="center" 
            className={styles.dynamicDisplay}
          >
            {tableNumber || 'Номер столика'}
          </FlexLayout>
          
          <Message text={localError} variant='error' />   
          
          <Numpad 
            {...numpadProps}
            disabled={tableNumber.length === LIMIT_DYN_INPUT} 
          />
          
          <button
            disabled={!tableNumber}
            onClick={handleSubmit}
            className={styles.dynamicSubmitButton}
          >
            Открыть заказ
          </button>
        </FlexLayout>

        <TableList tables={zone.tables} onTableClick={onTableClick} />
      </FlexLayout>
    </div>
  );
});

interface TableListProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
}

const TableList = React.memo(({ tables, onTableClick }: TableListProps) => {
  return (
    <GridLayout 
      cols="auto" 
      minWidth="110px" 
      gap="sm"
      className={styles.dynamicList}
    >
      {tables.map((table) => (
        <FlexLayout 
          key={table.id} 
          direction="col"
          align="center"
          justify="center"
          className={styles.dynamicCard} 
          onClick={() => onTableClick(table)}
        >
          <span>Стол</span>
          <span className="text-2xl mt-1">№{table.number}</span>
        </FlexLayout>
      ))}
    </GridLayout>
  );
});

TableList.displayName = 'TableList';
