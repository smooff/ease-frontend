import React, {useState} from 'react';
import axios from "axios";
import {useOktaAuth} from "@okta/okta-react";
import {Button, makeStyles, Typography} from '@material-ui/core';
import Divider from "@mui/material/Divider";

const FileUpload = (props) => {

    const useStyles = makeStyles({
        allComponents: {
            textAlign: "center",
        },
        uploadBtn: {
            marginTop: "1rem",
        },
        firstDivider: {
            marginBottom: "1rem"
        },
        secondDivider: {
            marginBottom: "1rem",
            marginTop: "1rem"
        },
        uploadedFilesDiv: {
            marginBottom: "1rem"
        },
        uploadSucc: {
            color: "green"
        }
    });
    const classes = useStyles();

    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const {authState, oktaAuth} = useOktaAuth();

    const upload = (file) => {
        setMessage("")
        setUploadedFiles([])
        let formData = new FormData();
        formData.append("file", file);
        return axios.post("https://tp2-ai.fei.stuba.sk:8080/integ/eaUpload/uploadSingle", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${authState.accessToken.accessToken}`
            }
        }).then((res) => {
            setIsError(false);
            setMessage("Nahranie úspešné.")
            setUploadedFiles([file])
        }).catch((e) => {
            setIsError(true);
            setMessage("Nahranie zlyhalo.")
            setUploadedFiles([])
        });
    }

    const selectFile = (event) => {
        setSelectedFiles(event.target.files[0]);
    }

    return (
        <div className={classes.allComponents}>
            <div className={classes.firstDivider}>
                <Divider/>
            </div>

            <label>
                <input
                    id="btn-upload"
                    name="btn-upload"
                    style={{display: 'none'}}
                    type="file"
                    onChange={selectFile}/>
                <Button
                    variant="outlined"
                    component="span"
                >
                    Vybrať súbory
                </Button>
            </label>
            <div className="file-name">
                {selectedFiles !== undefined ?
                    <div>
                        <Typography variant="h6">
                            Zoznam súborov
                        </Typography>
                        {selectedFiles.name}
                    </div>
                    : null}
            </div>
            <Button
                className={classes.uploadBtn}
                color="primary"
                variant="contained"
                component="span"
                disabled={!selectedFiles}
                onClick={() => {
                    upload(selectedFiles)
                }}>
                Nahrať
            </Button>

         <div className={classes.secondDivider}><Divider/></div>

            {isError ?
                <Typography variant="h6" color={"secondary"}>
                    {message}
                </Typography> :
                <Typography variant="h6" className={classes.uploadSucc}>
                    {message}
                </Typography>
            }

            <div className={classes.uploadedFilesDiv}>
                {uploadedFiles.length > 0 ? " Nahrané súbory: " : ""}
                {uploadedFiles &&
                    uploadedFiles.map((file) => (
                        file.name
                    ))}
            </div>
        </div>
    );
}

export default FileUpload;
