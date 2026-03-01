export const JODIT_CONFIG: any = {
  readonly: false,
  height: 450,
  width: "auto",
  toolbarSticky: false,
  theme: "default",
  statusbar: false,

  askBeforePasteHTML: true,
  askBeforePasteFromWord: true,
  defaultActionOnPaste: "insert_as_html",

  // Image Upload Handling
  uploader: {
    insertImageAsBase64URI: true,
  },

  buttons: [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "ul",
    "ol",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "image",
    "table",
    "link",
    "|",
    "align",
    "undo",
    "redo",
    "|",
    "hr",
    "eraser",
    "fullsize",
    "source",
  ],

  // Image popup configuration
  popup: {
    image: [
      "image",
      "|",
      "alignleft",
      "aligncenter",
      "alignright",
      "|",
      "image-properties",
      "delete",
    ],
  },

  // Extras
  showXPathInStatusbar: false,

  // Text style options
  style: {
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
  },
};
