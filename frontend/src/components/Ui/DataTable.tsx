import Link from "next/link";
import React from "react";
import { AiFillEye, AiFillEdit, AiFillDelete } from "react-icons/ai";

interface DataParams {
  [key: string]: any;
}

interface DataTableProps {
  data: DataParams[];
  onView?: boolean;
  onEdit?: boolean;
  onDelete?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = Object.keys(data[0] || {});

  const isUrl = (value: string): boolean => {
    try {
      new URL(value);
      return true
    } catch {
      return false
    }
  }

  const renderActions = () => {
    if (onView || onEdit || onDelete) {
      return (
        <th className="px-6 py-3 text-left text-xs font-medium bg-white text-gray-500 dark:text-white dark:bg-DarkerGrey tracking-wider">
          Actions
        </th>
      );
    }
    return null;
  };

  const renderActionCell = () => {
    if (onView || onEdit || onDelete) {
      return (
        <td className="px-6 py-4 whitespace-nowrap flex gap-2">
          {onView && (
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              <div className="flex gap-2"><AiFillEye className="h-4 w-4" /> Görüntüle</div>
            </div>
          )}
          {onEdit && (
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              <div className="flex gap-2"><AiFillEdit className="h-4 w-4" />Düzenle</div>
            </div>
          )}
          {onDelete && (
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              <div className="flex gap-2"><AiFillDelete className="h-4 w-4" /> Sil</div>
            </div>
          )}
        </td>
      );
    }
    return null;
  };

  return (
    <div className="overflow-x-auto mx-0 lg:mx-2 flex w-[250px] hover:bg-gray-50 dark:hover:bg-DarkLightGrey dark:border-DarkLightGrey mt-2 rounded-lg lg:w-full">
      <table className="text-sm w-full text-left rtl:text-right text-gray-500 bg-white dark:bg-DarkerGrey">
        <thead className="text-xs dark:text-white">
          <tr>
            {columns?.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white tracking-wider"
              >
                {column}
              </th>
            ))}
            {renderActions()}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data?.map((DataParam, index) => (
              <tr key={index} className="bg-white dark:text-white dark:bg-DarkerGrey border-b hover:bg-gray-50 dark:hover:bg-DarkLightGrey">
                {columns?.map((column) => (
                  <td key={column} className={` ${isUrl(DataParam[column]) === true ? "hover:underline underline-offset-1" : "underline-none"} px-6 py-4 text-wrap whitespace-nowrap`}>
                    {isUrl(DataParam[column]) ? <Link href={DataParam[column]}>{DataParam[column]}</Link> : DataParam[column]}
                  </td>
                ))}
                {renderActionCell()}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-4">
                Veri bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
