"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/Ui/Button";
import addData from "@/utils/addData";
import Toast from "@/components/Ui/Toast";
import getData from "@/utils/getData";

// Zod validation schema
const tagSchema = z.object({
  name: z.string().trim().min(1, "Başlık gereklidir"),
});

type TagFormValues = z.infer<typeof tagSchema>;

interface Tag {
  name: string;
  slug?: string;
}

const NewTag: React.FC<{ initialData?: Tag }> = ({ initialData }) => {
  const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const onSubmit = async (values: TagFormValues) => {
    if (!values.name.trim()) {
      setToast({ message: "Başlık boş olamaz!", type: "error" });
      return;
    }

    try {
      const existingTagsResponse = await getData("hashtags");
      const existingTags: Tag[] = existingTagsResponse.data.map((item: any) => ({ name: item.name }));

      const isTagExist = existingTags.some(
        (existingTag: Tag) => existingTag.name.toLowerCase() === values.name.toLowerCase()
      );

      if (isTagExist) {
        setToast({ message: "Bu etiket zaten mevcut.", type: "error" });
        return;
      }

      const newTag = { name: values.name.trim()};
      const response = await addData("hashtags", newTag);

      if (response.success) {
        setToast({ message: "Başarıyla eklendi!", type: "success" });
        reset();
      } else {
        setToast({ message: response.message || "Bir hata oluştu.", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Bir hata oluştu!", type: "error" });
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap">
        <div className="flex basis-1/2 flex-wrap pr-7 gap-1.5">
          <label htmlFor="name" className="text-sm font-medium flex basis-full">
            Başlık:
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            className="rounded-md border border-gray-300 p-2 "
          />
          {errors.name && (
            <div className="text-red-500 text-sm">{errors.name.message}</div>
          )}
          <div className="flex basis-full mt-5">
            <Button variant="primary" type="submit">
              Kaydet
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default NewTag;
