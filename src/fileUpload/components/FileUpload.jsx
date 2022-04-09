import React, {useState} from 'react';
import axios from "axios";
import {useOktaAuth} from "@okta/okta-react";
import LinearProgress from '@material-ui/core/LinearProgress';
import {Box, Typography, Button, ListItem, withStyles} from '@material-ui/core';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 15,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: "#EEEEEE",
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress);

const FileUpload = (props) => {

    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [fileInfos, setFileInfos] = useState([]);

    const {authState, oktaAuth} = useOktaAuth();

    const upload = (file) => {
        let formData = new FormData();
        formData.append("file", file);
        return axios.post("https://tp2-ai.fei.stuba.sk:8080/integ/eaUpload/uploadSingle", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${authState.accessToken.accessToken}`
            }
        }).then((res) => {
            console.log(res);
            setIsError(false);
            setMessage("Nahrávanie úspešné.")
        }).catch((e) => {
            setIsError(true);
            setMessage("Nahrávanie zlyhalo.")
            console.log(e.data.message)
        });
    }

    const selectFile = (event) => {
        setSelectedFiles(event.target.files[0]);
    }

    return (
        <div className="mg20">
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
                {selectedFiles && selectedFiles.length > 0 ? selectedFiles[0].name : null}
            </div>
            <Button
                className="btn-upload"
                color="primary"
                variant="contained"
                component="span"
                disabled={!selectedFiles}
                onClick={() => {
                    upload(selectedFiles)
                }}>
                Upload
            </Button>
            <Typography variant="subtitle2" className={`upload-message ${isError ? "error" : ""}`}>
                {message}
            </Typography>
            <Typography variant="h6" className="list-header">
                List of Files
            </Typography>
            <ul className="list-group">
                {fileInfos &&
                    fileInfos.map((file, index) => (
                        <ListItem
                            divider
                            key={index}>
                            <a href={file.url}>{file.name}</a>
                        </ListItem>
                    ))}
            </ul>
        </div>
    );
}

export default FileUpload;
