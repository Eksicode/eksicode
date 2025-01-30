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

  const renderActions = () => {
    if (onView || onEdit || onDelete) {
      return (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
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
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex gap-2"><AiFillEye className="h-4 w-4" /> Görüntüle</div>
            </div>
          )}
          {onEdit && (
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex gap-2"><AiFillEdit className="h-4 w-4" />Düzenle</div>
            </div>
          )}
          {onDelete && (
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex gap-2"><AiFillDelete className="h-4 w-4" /> Sil</div>
            </div>
          )}
        </td>
      );
    }
    return null;
  };

  return (
    <div className="basis-full overflow-x-auto w-full">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs dark:text-white ">
          <tr>
            {columns?.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
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
              <tr key={index} className="bg-white dark:bg-DarkerGrey border-b hover:bg-gray-50 dark:hover:bg-DarkLightGrey">
                {columns?.map((column) => (
                  <td key={column} className="px-6 py-4 whitespace-nowrap">
                    {DataParam[column]}
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
