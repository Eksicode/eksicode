import Link from "next/link";
import React, { useState } from "react";
import { AiFillEye, AiFillEdit, AiFillDelete } from "react-icons/ai";
import Button from "./Button";
import { IoClose } from "react-icons/io5";
import Toast from "./Toast";

interface DataParams {
  [key: string]: any;
}

interface DataTableProps {
  data: DataParams[];
  onView?: boolean;
  onEdit?: boolean;
  onDelete?: boolean;
  handleDelete?: (id: number) => void;
  handleEdit?: (id: number, newName: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
  handleDelete,
  handleEdit,
}) => {
  const columns = Object.keys(data[0] || {});
  const [showModal, setShowModal] = useState<{ visible: boolean; id?: number; type?: "view" | "edit" | "delete" }>({ visible: false });
  const [editValue, setEditValue] = useState<string>("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const isUrl = (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const openModal = (type: "view" | "edit" | "delete", id: number) => {
    setShowModal({ visible: true, id, type });
    if (type === "edit") {
      const item = data.find((item) => item.id === id);
      if (item) {
        setEditValue(item.name || "");
      }
    }
  };

  if (typeof window !== "undefined") {
    if (showModal.visible === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
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

  const renderActionCell = (id: number) => {
    if (onView || onEdit || onDelete) {
      return (
        <td className="px-6 py-4 whitespace-nowrap flex gap-2">
          {onView && (
            <div className="hover:underline cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              <div onClick={() => openModal("view", id)} className="flex gap-2">
                <AiFillEye className="h-4 w-4" /> Görüntüle
              </div>
            </div>
          )}
          {onEdit && (
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              <div className="flex gap-2"><AiFillEdit className="h-4 w-4" /> Düzenle</div>
            </div>
          )}
          {onDelete && (
            <div className="hover:underline cursor-pointer px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
              <div onClick={() => openModal("delete", id)} className="flex gap-2">
                <AiFillDelete className="h-4 w-4" /> Sil
              </div>
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
                {renderActionCell(DataParam.id)}
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

      {showModal.visible && (
        <>
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="max-w-sm z-50 flex flex-col gap-5 w-full bg-white dark:bg-DarkerGrey rounded-lg p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="py-2 flex justify-between items-center border-b dark:border-DarkLightGrey">
                <h3>
                  {showModal.type === "edit"
                    ? "Düzenleme"
                    : "Silinsin mi?"}
                </h3>
                <button onClick={() => setShowModal({ visible: false })}>
                  <IoClose />
                </button>
              </div>

              {showModal.type === "view" && (
                <div>
                  {data.find((item) => item.id === showModal.id)?.name}
                </div>
              )}

              {showModal.type === "edit" && (
                <div>
                  <input
                    type="text"
                    className="border p-2 w-full"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                </div>
              )}

              {showModal.type === "delete" && (
                <div>Bu işlem geri alınamaz.</div>
              )}

              <div className="flex justify-end gap-2">
                <Button onClick={() => setShowModal({ visible: false })} variant="primary">
                  Kapat
                </Button>
                {showModal.type === "delete" && (
                  <Button
                    onClick={() => {
                      try {
                        if (!handleDelete) throw new Error("Silme işlemi desteklenmiyor.");

                        handleDelete(showModal.id!);
                        setToast({ message: "Başarıyla silindi!", type: "success" });
                      } catch (error: any) {
                        setToast({ message: error.message || "Silme işlemi başarısız!", type: "error" });
                      } finally {
                        setShowModal({ visible: false });
                      }
                    }}
                    variant="primary"
                  >
                    Sil
                  </Button>
                )}
                {showModal.type === "edit" && (
                  <Button
                    onClick={() => {
                      try {
                        if (!editValue.trim()) throw new Error("Boş değer girilemez!");
                        if (editValue === data.find((item) => item.id === showModal.id)?.name) throw new Error("Değişiklik yapılmadı!");
                        if (!handleEdit) throw new Error("Düzenleme işlemi desteklenmiyor.");
                        handleEdit(showModal.id!, editValue);
                        setToast({ message: "Başarıyla güncellendi!", type: "info" });
                      } catch (error: any) {
                        setToast({ message: error.message || "Düzenleme işlemi başarısız!", type: "error" });
                      } finally {
                        setShowModal({ visible: false });
                        setEditValue("");
                      }
                    }}
                    variant="primary"
                  >
                    Kaydet
                  </Button>
                )}
              </div>
            </div>
            <div className="absolute inset-0 z-40"
            onClick={() => setShowModal({ visible: false })}
          ></div>
          </div>
        </>
      )}
    </div>
  );
};

export default DataTable;