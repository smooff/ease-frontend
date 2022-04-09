import React from 'react';
import {Button, Dialog, DialogTitle} from "@mui/material";
import FileUpload from "./FileUpload";

const ModalFileUpload = (props) => {

    const [openModal, setOpenModal] = React.useState(false);
    const handleClickOpenModal = (event, item) => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
    <>
        <Button onClick={handleClickOpenModal} style={{marginTop: "5vh", marginBottom:"2vh"}}
                variant="outlined">Nahranie súborov</Button>

        <Dialog fullWidth={true} maxWidth={"sm"} scroll={"paper"} onClose={handleCloseModal}
                open={openModal}>
            <DialogTitle onClose={handleCloseModal}>
                Nahranie súborov
            </DialogTitle>
            <FileUpload/>
        </Dialog>
    </>
    );
}

export default ModalFileUpload;
