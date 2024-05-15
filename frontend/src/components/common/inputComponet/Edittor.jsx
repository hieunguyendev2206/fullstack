import React, {memo} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Edittor = (props) => {
    const modules = {
        toolbar: {
            container: [
                [{header: [1, 2, 3, 4, 5, 6, false]}],
                [{size: ["small", false, "large", "huge"]}],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{list: "ordered"}, {list: "bullet"}],
                ["link", "image", "video"],
                ["clean"],
            ],
        },
    };

    return (
        <ReactQuill theme="snow" value={props?.value} onChange={props?.setValue}/>
    );
};

export default memo(Edittor);
