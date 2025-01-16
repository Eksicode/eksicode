import NewTag from "@/components/Dashboard/NewTag";

function NewTagForm() {
    return (
        <>
            <div className="flex justify-between flex-nowrap basis-full text-xl text-bold mb-4">
                <h1 className="mt-2">Yeni Etiket Ekle</h1>
            </div>
            <NewTag />
        </>
    );

};

export default NewTagForm;