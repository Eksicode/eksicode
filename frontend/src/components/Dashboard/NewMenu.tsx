"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/Ui/Button";
import Modal from "@/components/Ui/Modal";


interface Menu {
    name: string;
    slug: string;
    main: string;
    icon: string;
}

interface Main {
    id?: number;
    name?: string;
    slug?: string;
    main_id?: number;
}

const NewMenu: React.FC<{ initialData?: Menu }> = ({ initialData }) => {
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [main, setMain] = useState([] as Main[]);
    //const [categories, setCategories] = useState<any[]>([]) ;
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

    const [menu, setMenu] = useState<Menu>(
        initialData || {
            name: "",
            slug: "",
            main: "",
            icon: "",
        }
    );

    const openAddCategoryModal = () => {
        setIsAddCategoryModalOpen(true);
    };

    const closeAddCategoryModal = () => {
        setIsAddCategoryModalOpen(false);
    };

  

    const createSlug = (name: string) => {
        const turkishCharacters: { [key: string]: string } = {
            ç: "c",
            ğ: "g",
            ı: "i",
            ö: "o",
            ş: "s",
            ü: "u",
            Ç: "C",
            Ğ: "G",
            İ: "I",
            Ö: "O",
            Ş: "S",
            Ü: "U",
        };

        return name
            .toLowerCase()
            .replace(/[çğıöşü]/g, (match) => turkishCharacters[match])
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
    };

    useEffect(() => {
        const newSlug = menu.name.trim() ? createSlug(menu.name) : "";
        setMenu((prevPage) => ({ ...prevPage, slug: newSlug }));
    }, [menu.name]);

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        setMenu((prevPage) => ({ ...prevPage, main: value }));
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setMenu((prevPage) => ({ ...prevPage, [name]: value }));
    };

    const handleClick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const tokenResponse = await fetch('/api');
            const data = await tokenResponse.json();

            const token = data.token;
            if (!token) {
                console.error('Token is not available.');
                return;
            }
            const formData = new FormData();
            formData.append("name", menu.name);
            formData.append("slug", menu.slug);
            formData.append("main", menu.main);
            formData.append("icon", menu.icon);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus`, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log("Form submission successful!");
            } else {
                console.error("Form submission failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error during form submission:", error);
        }
    };


    const getMainMenu = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/menus`
            );
            if (response.ok) {
                const fetchedMainMenus = await response.json();
                setMain(fetchedMainMenus.data);
            } else {
                console.error("Failed to fetch categories:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        getMainMenu();
    }, []);

    return (
        <div>
            <form onSubmit={handleClick} className="flex flex-wrap w-full">
                <div className="flex basis-1/2 flex-wrap pr-7 gap-1.5">
                    <label htmlFor="name" className="text-sm font-medium flex basis-full">
                        Başlık:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={menu.name}
                        onChange={handleChange}
                        className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 basis-full"
                    />
                    <label htmlFor="slug" className="text-sm font-medium w-full">
                        Slug:
                    </label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={menu.slug}
                        onChange={handleChange}
                        className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                    />


                    <label htmlFor="main" className="text-sm font-medium w-full">
                        Kategori:
                    </label>
                    <select
                        id="main"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        value={menu.main}
                        onChange={(e) => handleSelect(e.target.value)}
                    >
                        <option value="">Seçiniz</option>
                        {main?.map((mainMenu: any) => (
                            <option key={mainMenu.id} value={mainMenu.id}>
                                {mainMenu.name}
                            </option>
                        ))}
                    </select>
                    <Button onClick={openAddCategoryModal} variant="primary">
                        Yeni Kategori Ekle
                    </Button>
                </div>

                <div className="flex basis-1/2 flex-col h-fit">
                    <label htmlFor="Icon" className="text-sm font-medium w-full mb-[5px]">
                        Icon:
                    </label>
                    <input
                        type="text"
                        id="Icon"
                        name="icon"
                        value={menu.icon}
                        onChange={handleChange}
                        className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 basis-full"
                    />

                </div>
                <div className="flex justify-end basis-full mt-10">
                    <Button onClick={() => { }} variant="primary" type="submit" clasName="">
                        Kaydet
                    </Button>
                </div>
            </form>
            <Modal
                isOpen={isAddCategoryModalOpen}
                onClose={closeAddCategoryModal}
                title="Yeni Kategori Ekle"
                buttonText="Ekle"
                redUrl="/dashboard/menuler/yeni"
            >
            </Modal>
        </div>

    );
};

export default NewMenu;
