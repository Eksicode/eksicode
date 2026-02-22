import React, { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextEditor = ({
  value,
  onChange,
  placeholder = "Start writing...",
}: TextEditorProps) => {
  const { token } = useAuth();
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadQuill = async () => {
        // Dynamically import Quill
        const Quill = (await import("quill")).default;

        // Configure Quill toolbar options
        const toolbarOptions = [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['clean'],
          ['link', 'image', 'video']
        ];

        const imageHandler = () => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.click();

          input.onchange = async () => {
            const file = input.files ? input.files[0] : null;
            if (file && token) {
              try {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/media/upload`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  body: formData,
                });

                const result = await response.json();

                if (response.ok && result.success && result.data?.url) {
                  const range = quillRef.current.getSelection() || { index: quillRef.current.getLength() };
                  quillRef.current.insertEmbed(range.index, "image", result.data.url);
                } else {
                  console.error("Image upload failed:", result.message);
                }
              } catch (error) {
                console.error("Image upload error", error);
              }
            }
          };
        };

        // Initialize Quill
        if (editorRef.current && !quillRef.current) {
          quillRef.current = new Quill(editorRef.current, {
            modules: {
              toolbar: toolbarOptions,
            },
            placeholder: placeholder,
            theme: "snow",
          });

          // Override the default image handler
          quillRef.current.getModule("toolbar").addHandler("image", imageHandler);

          // Set initial content if provided and editor is empty
          if (value && quillRef.current.getText().trim().length === 0) {
            // quillRef.current.root.innerHTML = value; // innerHTML might be dangerous if not sanitized, but value should be safe or we trust it for now. 
            // Better to use clipboard or dangerouslyPasteHTML
            quillRef.current.clipboard.dangerouslyPasteHTML(value);
          }

          // Handle content changes
          quillRef.current.on('text-change', () => {
            const content = quillRef.current.root.innerHTML;
            onChange(content);
          });
        }
      };

      loadQuill();
    }

    // Cleanup
    // return () => {
    //   if (quillRef.current) {
    //     quillRef.current.off("text-change");
    //   }
    // };
  }, []);

  return (
    <div className="min-h-[200px]">
      <div ref={editorRef} className="h-full" />
    </div>
  );
};

export default TextEditor;
