import React from "react";

interface DataParams {
  [key: string]: any;
}

interface DataTableProps {
  data: DataParams[];
}
const DataTable: React.FC<{ data: DataTableProps[] }> = ({ data }) => {
  const columns = Object.keys(data[0] || {});

  const prepareDataForDisplay = (postData: Post) => ({
    ...postData,
    status: postData.status ? "Published" : "Draft",
    view: true, // Assuming view is always true
    edit: false, // Assuming edit is always false (can be adjusted based on logic)
  });

  const preparedData = data.map(prepareDataForDisplay);

  return (
    <div className="basis-full overflow-x-auto w-full bg-white ">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            {columns?.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data?.map((DataParam, index) => (
              <tr key={index} className="bg-white border-b  hover:bg-gray-50">
                {columns?.map((column) => (
                  <td key={column} className="px-6 py-4">
                    {DataParam[column]}
                    {DataParam.view !== true && (
                      <a href={`/delete/${DataParam.id}`}>Görüntüle</a>
                    )}
                    {DataParam.edit !== true && (
                      <a href={`/delete/${DataParam.id}`}>Düzenle</a>
                    )}
                    {DataParam.delete !== true && (
                      <a href={`/delete/${DataParam.id}`}>Sil</a>
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
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
