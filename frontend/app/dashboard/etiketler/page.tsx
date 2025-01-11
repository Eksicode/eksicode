import React from "react";
// import getTags from "@providers/getTags";
import DataTable from "@components/Ui/DataTable";
import Navlink from "@components/Ui/NavLink";

interface Tags {
  name: string;
  icon: string;
  description: string;
}

async function Tags() {

  // const tagsData = await getTags("");

  // const preparedData = tagsData.map((tag) => ({
  //   name: tag.name,
  // }));

  return (
    <>
      <div className="flex justify-between w-full">
        <h1 className="mt-2">Etiketler</h1>
        <Navlink href="/dashboard/etiketler/yeni" variant="primary">
          + Yeni Etiket
        </Navlink>
      </div>
      {/* <DataTable
        data={preparedData}
        onView={true}
        onEdit={true}
        onDelete={true}
      /> */}

    </>
  );
}

export default Tags;
