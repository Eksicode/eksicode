import React from "react";
import DataTable from "@components/Ui/DataTable";
import Navlink from "@components/Ui/NavLink";
import getData from "@providers/getData";

async function DashboardPages() {
  const pagesData = await getData("pages", true, 10);

  const preparedData = pagesData.data.map((page) => ({
    id: page.id,
    title: page.title
  }));

  return (
    <>
      <div className="flex justify-between w-full items-center mb-5">
        <div>
          <h1 className="mt-2 w-full">Sayfalar</h1>
        </div>
        <div>
          <Navlink href="/dashboard/sayfalar/yeni" variant="primary">
            + Yeni Sayfa
          </Navlink>
        </div>
      </div>
      <DataTable
        data={preparedData}
        onView={true}
        onEdit={true}
        onDelete={true}
      />
    </>
  );
}

export default DashboardPages;
