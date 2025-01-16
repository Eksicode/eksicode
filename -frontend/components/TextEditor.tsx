import React, { useEffect, useRef } from "react";

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
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadQuill = async () => {
        // Dynamically import Quill
        const Quill = (await import("quill")).default;

        // Configure Quill toolbar options
        const toolbarOptions = [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ["clean"],
        ];

        // Initialize Quill
        if (editorRef.current && !quillRef.current) {
          quillRef.current = new Quill(editorRef.current, {
            modules: {
              toolbar: toolbarOptions,
            },
            placeholder: placeholder,
            theme: "snow",
          });

          // Set initial content
          // quillRef.current.root.innerHTML = value;

          // Handle content changes
          // quillRef.current.on('text-change', () => {
          //   const content = quillRef.current.root.innerHTML;
          //   onChange(content);
          // });
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
