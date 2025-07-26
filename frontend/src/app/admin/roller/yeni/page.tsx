import NewRole from "@/components/Admin/NewRole";


const NewRoleForm = () => {
    return (
        <>
            <div className="flex justify-between flex-nowrap basis-full text-xl text-bold mb-4">
                <h1 className="mt-2">Yeni Rol Ekle</h1>
            </div>

            <NewRole />
        </>
    );
};

export default NewRoleForm;