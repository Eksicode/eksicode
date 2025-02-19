"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/Ui/Button";
import addData from "@/utils/addData";
import Toast from "@/components/Ui/Toast";
import getData from "@/utils/getData";

interface Tag {
  name: string;
  slug?: string;
}

const NewTag: React.FC<{ initialData?: Tag }> = ({ initialData }) => {
  const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Başlık gereklidir"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
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
          resetForm();
        } else {
          setToast({ message: response.message || "Bir hata oluştu.", type: "error" });
        }
      } catch (error) {
        setToast({ message: "Bir hata oluştu!", type: "error" });
      }
    },
  });

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <form onSubmit={formik.handleSubmit} className="flex flex-wrap">
        <div className="flex basis-1/2 flex-wrap pr-7 gap-1.5">
          <label htmlFor="name" className="text-sm font-medium flex basis-full">
            Başlık:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="rounded-md border border-gray-300 p-2 "
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          ) : null}
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
