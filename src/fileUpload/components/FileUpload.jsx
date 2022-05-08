import React from 'react';
import {Button, Dialog, DialogTitle} from "@mui/material";
import ModalFileUpload from "./ModalFileUpload";

const FileUpload = (props) => {

    const [openModal, setOpenModal] = React.useState(false);
    const handleClickOpenModal = (event, item) => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <>
            <Button onClick={handleClickOpenModal} style={{marginTop: "2rem", marginBottom: "2vh"}}
                    variant="outlined">Nahranie súborov</Button>

            <Dialog fullWidth={true} maxWidth={"sm"} scroll={"paper"} onClose={handleCloseModal}
                    open={openModal}>
                <DialogTitle onClose={handleCloseModal}>
                    Nahranie súborov
                </DialogTitle>
                <ModalFileUpload/>
            </Dialog>
        </>
    );
}

export default FileUpload;
