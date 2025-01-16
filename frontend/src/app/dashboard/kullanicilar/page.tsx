import React from "react";
import DataTable from "@/components/Ui/DataTable";
import Navlink from "@/components/Ui/NavLink";
import getData from "@/utils/getData";

async function Users() {
  const usersData = await getData("users", true, 10);

  const preparedData = usersData.data.map((user) => ({
    id: user.id,
    username: user.username
  }));

  return (
    <>
      <div className="flex justify-between w-full items-center mb-5">
        <div>
          <h1 className="mt-2 w-full">Kullanıcılar</h1>
        </div>
        <div>
          <Navlink href="/dashboard/kullanicilar/yeni" variant="primary">
            + Yeni Kullanıcı
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

export default Users;
