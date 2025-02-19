
// import getRoles from "@providers/getRoles";
import DataTable from "@/components/Ui/DataTable";
import Navlink from "@/components/Ui/NavLink";


async function Roles() {
  // const RolesData = await getRoles("total", "no-store");

  // const preparedData = RolesData.map((role) => ({
  //   name: role.name,
  //   description: role.description,
  // }));


  return (
    <>
      <h1 className="mt-2">Roller</h1>
      <Navlink href="/dashboard/roller/yeni" variant="primary">
        + Yeni Rol
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

export default Roles;
