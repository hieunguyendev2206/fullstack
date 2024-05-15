import React from "react";
import Modal from "react-modal";

function ModalCpn({isOpen, children}) {
    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
        },
    };
    return (
        <div>
            <Modal isOpen={isOpen} style={customStyles} contentLabel="Example Modal">
                {children}
            </Modal>
        </div>
    );
}

export default ModalCpn;
