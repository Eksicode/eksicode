import React from "react";
import DataTable from "@components/Ui/DataTable";
import getPages from "@providers/getPages";

async function DashboardPages() {
  const pagesData = await getPages("");

  const preparedData = pagesData.map((page) => ({
    title: page.title,
    page_category: page.page_category,
  }));

  return (
    <>
      <h1 className="mt-2 w-full">Sayfalar</h1>
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
