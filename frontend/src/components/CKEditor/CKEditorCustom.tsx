import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Subscript,
    Superscript,
    RemoveFormat,
    Highlight,
    Alignment,
    FindAndReplace,
    List,
    Image,
    ImageToolbar,
    ImageStyle,
    ImageCaption,
    ImageTextAlternative,
    ImageUpload,
    ImageResize,
    Table,
    TableToolbar,
    FontFamily,
    FontSize,
    FontColor,
    FontBackgroundColor,
    Link,
    type EditorConfig
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import './styles.css';
import { uploadFiles } from "@/services/file.service";

class CustomUploadAdapter {
    private loader: any;

    constructor(loader: any) {
        this.loader = loader;
    }

    upload(): Promise<{ default: string }> {
        return this.loader.file.then(
            (file: File) =>
                new Promise((resolve, reject) => {
                    uploadFiles([file]).then((result) => {
                        if (result && result.length > 0) {
                            resolve({ default: result[0].url });
                        } else reject(new Error("Không nhận được URL ảnh sau khi upload."));

                    }).catch((error) => {
                        reject(error instanceof Error ? error : new Error("Lỗi tải lên hình ảnh."));
                    });
                }));
    }

    abort(): void {
    }
}

function CustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
        return new CustomUploadAdapter(loader);
    };
}

interface TextEditorsProps {
    value?: string;
    placeholder?: string;
    imageUploadTypes?: string[];
    className?: string;
    onChange?: (value: string) => void;
}

export default function CKEditorCustom(
    {
        value,
        placeholder,
        imageUploadTypes,
        className,
        onChange
    }: TextEditorsProps) {

    const editorConfiguration: EditorConfig = {
        licenseKey: "GPL",
        placeholder: placeholder,
        plugins: [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Subscript,
            Superscript,
            RemoveFormat,
            Highlight,
            Alignment,
            FindAndReplace,
            List,
            Image,
            ImageToolbar,
            ImageStyle,
            ImageCaption,
            ImageTextAlternative,
            ImageUpload,
            ImageResize,
            Table,
            TableToolbar,
            FontFamily,
            FontSize,
            FontColor,
            FontBackgroundColor,
            Link
        ],
        extraPlugins: [CustomUploadAdapterPlugin],
        language: 'vi',
        fontSize: {
            options: [10, 12, 14, 16, 18, 20, 24, 30, 36, 48]
        },
        fontFamily: {
            options: [
                'default',
                'Arial, Helvetica, sans-serif',
                'Courier New, Courier, monospace',
                'Georgia, serif',
                'Lucida Sans Unicode, Lucida Grande, sans-serif',
                'Tahoma, Geneva, sans-serif',
                'Times New Roman, Times, serif',
                'Trebuchet MS, Helvetica, sans-serif',
                'Verdana, Geneva, sans-serif'
            ],
            supportAllValues: true,
        },
        toolbar: {
            items: [
                'undo', 'redo', '|',
                'heading', '|',
                'fontFamily', 'fontSize', 'fontColor', 'highlight', '|',
                'alignment:left', 'alignment:center', 'alignment:right', 'alignment:justify', '|',
                'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '|',
                'findAndReplace', '|',
                'numberedList', 'bulletedList', '|',
                'insertTable', 'uploadImage', 'link'
            ]
        },
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                openInNewTab: {
                    mode: 'manual',
                    label: 'Mở trong tab mới',
                    attributes: {
                        target: '_blank',
                        rel: 'noopener noreferrer'
                    }
                },
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Tải về (download)',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        image: {
            upload: imageUploadTypes ? { types: imageUploadTypes } : undefined,
            resizeOptions: [
                {
                    name: 'resizeImage:original',
                    value: null,
                    icon: 'original'
                },
                {
                    name: 'resizeImage:25',
                    value: '25',
                    icon: 'small'
                },
                {
                    name: 'resizeImage:50',
                    value: '50',
                    icon: 'medium'
                },
                {
                    name: 'resizeImage:75',
                    value: '75',
                    icon: 'large'
                }
            ],
            toolbar: [
                'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', '|',
                'resizeImage', '|',
                'toggleImageCaption', 'imageTextAlternative'
            ]
        },
        table: {
            contentToolbar: [
                'tableRow',
                'tableColumn',
                'mergeTableCells'
            ]
        },
    }

    return (
        <div className={`${className} ck-editor-custom-wrapper`}>
            <CKEditor
                editor={ClassicEditor}
                config={editorConfiguration}
                data={value}
                onChange={(_, editor) => {
                    const data = editor.getData();
                    onChange?.(data);
                }}
            />
        </div>
    )
}