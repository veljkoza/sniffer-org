/* eslint-disable @typescript-eslint/no-namespace */

import { PropsWithChildren, ReactNode } from 'react';
import { DeveloperToolsTypes } from '../DeveloperTools';
import { twMerge } from 'tailwind-merge';

const mapToDeveloperToolsTableData = <T,>(
  data: T[],
  cb: (item: T) => DeveloperToolsTypes.TableData
) => {
  return data.map(cb);
};

namespace DeveloperToolsTableTypes {
  export type Props = DeveloperToolsTypes.Props & {
    onSelected: (request: DeveloperToolsTypes.TableData) => void;
  };
}

const DeveloperToolsTable = ({
  data,
  onSelected,
}: DeveloperToolsTableTypes.Props) => {
  const getRowData = (row: DeveloperToolsTypes.TableData) => ({
    name: row.name,
    status: row.status,
    type: row.type,
    domain: row.domain,
    time: row.duration,
  });

  return (
    <div className="overflow-x-auto bg-developerTools-table-background h-full font-sans font-light text-left">
      <table className="min-w-full bg-white table-fixed">
        <thead className="bg-developerTools-table-headerBg border-developerTools-table-border text-white text-sm">
          <TableRow
            data={{
              name: 'Name',
              status: 'Status',
              type: 'Type',
              domain: 'Domain',
              time: 'Time',
            }}
          />
        </thead>
        <tbody className="text-white text-xs">
          {data.map((row, index) => (
            <TableRow
              data={getRowData(row)}
              onClick={() => onSelected(row)}
              className={twMerge(
                (index + 1) % 2 === 0
                  ? 'bg-developerTools-table-rowEvenBg'
                  : 'bg-developerTools-table-rowOddBg',
                'hover:bg-opacity-80 cursor-pointer',
                row.status >= 400 ? 'text-red-500' : ''
              )}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableRow = <T extends { [k: string]: any }, K extends keyof T>(props: {
  data: T;
  className?: string;
  render?: Record<K, (rowData: T[K]) => ReactNode>;
  onClick?: () => void;
}) => {
  const renderCell = (key: K) => {
    const renderFn = props.render?.[key];
    const cellData = props.data[key];
    console.log({ renderFn });
    if (!renderFn && typeof cellData !== 'object')
      return (
        <TableCell className="border-l w-1/5 border-developerTools-table-border border-r">
          {props.data[key]}
        </TableCell>
      );
    if (renderFn) return renderFn(cellData);
    return <></>;
  };
  const renderRow = () => {
    return Object.keys(props.data).map((key) => renderCell(key as K));
  };
  return (
    <tr className={props.className} onClick={() => props.onClick?.()}>
      {renderRow()}
    </tr>
  );
};

const TableCell = (props: PropsWithChildren & { className?: string }) => {
  const merged = twMerge('px-4 py-2', props.className);
  return <td className={merged}>{props.children}</td>;
};

export {
  DeveloperToolsTable,
  DeveloperToolsTableTypes,
  mapToDeveloperToolsTableData,
};
