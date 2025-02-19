"use client";
import React, { useEffect } from "react";
import getData from "@/utils/getData";
import DataTable from "@/components/Ui/DataTable";
import Navlink from "@/components/Ui/NavLink";
import deleteData from "@/utils/deleteData";
import updateData from "@/utils/updateData";

interface Tags {
  id: number;
  name: string;
}

const Tags = () => {
  const [data, setData] = React.useState<Tags[]>([]);

  useEffect(() => {
    getData("hashtags").then((res) => {
      const tagsData: Tags[] = res.data.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
      setData(tagsData);
    });
  }, []);


  const handleDelete = (id: number) => {
    deleteData("hashtags", id).then((res) => {
      if (res && res.success) {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
      }
    });
  };

  const handleEdit = async (id: number, newName: string) => {
  try {
    const res = await updateData("hashtags", id, { name: newName });
    if (res) {
      const updatedData = data.map((item) =>
        item.id === id ? { ...item, name: newName } : item
      );
      console.log("updatedData", updatedData);
      setData(updatedData);
    }
  } catch (error) {
    console.error("Update error:", error);
  }
};

return (
  <>
    <div className="flex justify-between w-full">
      <h1 className="mt-2">Etiketler</h1>
      <Navlink href="/dashboard/etiketler/yeni" variant="primary">
        + Yeni Etiket
      </Navlink>
    </div>
    <DataTable
      data={data}
      onView={false}
      onEdit={true}
      onDelete={true}
      handleDelete={handleDelete}
      handleEdit={(id, newName) => handleEdit(id, newName)}
    />

  </>
);
}

export default Tags;
