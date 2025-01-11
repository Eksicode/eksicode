import React from "react";
// import getMenus from "@providers/getMenus";
import DataTable from "@components/Ui/DataTable";
import Navlink from "@components/Ui/NavLink";

async function Menus() {
  // const MenusData = await getMenus("total", "no-store");

  // const preparedData = MenusData.map((menu) => ({
  //   name: menu.name,
  //   main: menu.main,
  //   icon: menu.icon,
  // }));

  return (
    <>
      <h1 className="mt-2">Menüler</h1>
      <Navlink href="/dashboard/menuler/yeni" variant="primary">
        + Yeni Menü
      </Navlink>

      {/* <DataTable
        data={preparedData}
        onView={true}
        onEdit={true}
        onDelete={true}
      /> */}
    </>
  );
}

export default Menus;
