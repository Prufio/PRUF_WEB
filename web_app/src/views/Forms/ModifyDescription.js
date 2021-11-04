import React from "react";
import "../../assets/css/custom.css";
import { isMobile, isAndroid } from "react-device-detect";
import swalReact from "@sweetalert/with-react";
import base64 from "base64-arraybuffer";
import validator from "validator";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Jdenticon from "react-jdenticon";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import TextField from "@material-ui/core/TextField";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Accordion from "@material-ui/core/Accordion";
import {
  AddPhotoAlternateOutlined,
  DeleteForever,
  Settings,
  KeyboardArrowLeft,
  NoteAddOutlined,
  Share,
  Check,
  ExpandMoreOutlined,
  FiberManualRecordTwoTone,
} from "@material-ui/icons";
import Icon from "@material-ui/core/Icon";
import FormControl from "@material-ui/core/FormControl";
import CardFooter from "components/Card/CardFooter.js";
import placeholder from "../../assets/img/placeholder.jpg";
import { RWebShare } from "react-web-share";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import formStyles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import engravingStyles from "../../assets/css/custom";
import Danger from "components/Typography/Danger";
import { updateDefaultClause } from "typescript";

const useStyles = makeStyles(styles);
const useFormStyles = makeStyles(formStyles);
const useEngravingStyles = makeStyles(engravingStyles);

export default function ModifyDescription(props) {
  if (!window.sentPacket) window.sentPacket = {};

  const [asset, setAsset] = React.useState(JSON.parse(JSON.stringify(window.sentPacket)));
  console.log(window.sentPacket);

  const [id] = React.useState(window.sentPacket.id);

  const [transactionActive, setTransactionActive] = React.useState(false);
  const [ipfsActive, setIpfsActive] = React.useState(false);
  const [advancedInput, setAdvancedInput] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showHelp, setShowHelp] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [txStatus, setTxStatus] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [help, setHelp] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [hasMounted, setHasMounted] = React.useState(false);

  // eslint-disable-next-line no-unused-vars
  const [txHash, setTxHash] = React.useState("");
  // const [customJSON, setCustomJSON] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState("");
  const [selectedKey, setSelectedKey] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = React.useState("");
  const [assetURL, setAssetURL] = React.useState("");
  const [URLTitle, setURLTitle] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [loginURL, setloginURL] = React.useState("");
  const [loginURLState, setloginURLState] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [loginURLTitle, setloginURLTitle] = React.useState("");
  const [loginURLTitleState, setloginURLTitleState] = React.useState("");
  const [newMutableStorage, setNewMutableStorage] = React.useState();
  // const [downloadName, setDownloadName] = React.useState("");
  // const [downloadLink, setDownloadLink] = React.useState("");
  const [copyText, setCopyText] = React.useState(false);

  // const [additionalImages, setAdditionalImages] = React.useState([]);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const link = document.createElement("div");
  const image = "photo",
    // eslint-disable-next-line no-unused-vars
    text = "text",
    url = "urls";
  const maxImageSize = 1000;
  const resizeImg = require("resize-img");
  // const fs = require('fs');

  const classes = useStyles();
  const formClasses = useFormStyles();
  const engravingClasses = useEngravingStyles();

  React.useEffect(() => {
    // eslint-disable-next-line react/prop-types
    if (props.ps) {
      // eslint-disable-next-line react/prop-types
      props.ps.element.scrollTop = 0;
      //console.log("Scrolled to ", props.ps.element.scrollTop)
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }

    //console.log(asset)

    if (asset === undefined || asset === null || asset === {}) {
      console.log("No asset found. Rerouting...");
      window.location.href = "/#/user/home";
      window.location.reload();
    } else if (asset.statusNum && !hasMounted && asset !== undefined) {
      if (
        asset.statusNum === "50" ||
        asset.statusNum === "56" ||
        asset.statusNum === "70"
      ) {
        swalReact({
          title: "Asset not in correct status!",
          text: "This asset is not in a modifiable status, please set asset into a non-escrow status before attempting to modify.",
          icon: "warning",
          button: "Close",
        }).then(() => {
          window.backIndex = asset.dBIndex;
          window.location.href = asset.lastRef;
        });
      }

      // else if (asset.nodeData.storageProvider === "2") {
      //   swalReact({
      //     title: "Not yet supported.",
      //     text:
      //       "We do not support mutable data modification on arweave yet. This feature is coming in the next release.",
      //     icon: "warning",
      //     button: "Close",
      //   }).then(() => {
      //     window.backIndex = asset.dBIndex;
      //     window.location.href = asset.lastRef;
      //   });
      // }

      // setSelectedImage(
      //   asset.photo.displayImage || Object.values(asset.photo)[0] || ""
      // );
      setSelectedImage(asset.displayImage);
      setHasMounted(true);
    }
  }, []);

  const handleChanges = (key, value) => {
    let obj = JSON.parse(JSON.stringify(asset));
    console.log(obj.mutableStorage)
    if (obj.mutableStorage === "") obj.mutableStorage = {}
    if (value === "delete") {
      delete obj.mutableStorage[key];
    } else {
      obj.mutableStorage[key] = value;
    }

    setAsset(obj);
  };

  const getRandomInt = () => {
    return Math.floor(Math.random() * Math.floor(99999));
  };

  const generateNewKey = (obj) => {
    let key =
      "PRAT_Image_" + String(Object.values(obj.photo).length + getRandomInt());

    if (obj.photo[key]) {
      return generateNewKey(obj);
    } else {
      return key;
    }
  };

  const removeElement = (type, rem) => {
    let tempObj = JSON.parse(JSON.stringify(newMutableStorage));
    delete tempObj[type][rem];
    //console.log(tempObj)
    if (type === image) {
      delete tempObj.photoUrls[rem];
      //console.log(rem)
      //console.log(tempObj)
      if (rem === "displayImage" && Object.values(tempObj.photo)[0]) {
        setSelectedImage(Object.values(tempObj.photo)[0]);
        setSelectedKey(Object.keys(tempObj.photo)[0]);
      } else if (rem !== "displayImage" && tempObj.photo.displayImage) {
        setSelectedImage(tempObj.photo.displayImage);
        setSelectedKey("displayImage");
      } else if (rem !== "displayImage" && Object.values(tempObj.photo)[0]) {
        setSelectedImage(Object.values(tempObj.photo)[0]);
        setSelectedKey(Object.keys(tempObj.photo)[0]);
      } else {
        setSelectedImage("");
        setSelectedKey("");
      }
    }
    setNewMutableStorage(tempObj);
    return forceUpdate();
  };

  const setDisplayImage = (img, key) => {
    // console.log("Deleting: ", key);
    // let tempObj = JSON.parse(JSON.stringify(newMutableStorage));
    // if (key === "displayImage") {
    //   return console.log("Nothing was done. Already set.");
    // }
    // let newKey = generateNewKey(tempObj);
    // if (tempObj.photo.displayImage) {
    //   tempObj.photo[newKey] = tempObj.photo.displayImage;
    //   tempObj.photoUrls[newKey] = tempObj.photoUrls.displayImage;
    // }
    // tempObj.photo.displayImage = img;
    // tempObj.photoUrls.displayImage = tempObj.photoUrls[key];
    // delete tempObj.photo[key];
    // delete tempObj.photoUrls[key];
    // //console.log(tempObj);
    // setNewMutableStorage(tempObj);
    // setSelectedImage(tempObj.photo.displayImage);
    // setSelectedKey("displayImage");
    // return forceUpdate();
  };

  // const resetChanges = () => {
  //   setNewMutableStorage(asset);
  //   return forceUpdate();
  // };

  const submitChanges = async () => {

    let tempObj = await JSON.parse(JSON.stringify(asset.mutableStorage));
    let payload = await JSON.stringify(tempObj, null, 5);
    let fileSize = await Buffer.byteLength(payload, "utf8");

    if (asset.nodeData.storageProvider === "1") {
      if (fileSize > 10000000) {
        return swalReact({
          title:
            "Document size exceeds 10 MB demo limit! (" +
            String(fileSize) +
            "Bytes)",
          icon: "warning",
          button: "Close",
        });
      }

      setIpfsActive(true);
      postToIpfs(payload);
    } else if (asset.nodeData.storageProvider === "2") {
      postToArweave(payload);
    }
  };

  const postToIpfs = async (data) => {
    window.ipfs.add(data).then((hash) => {
      if (!hash) {
        console.log("Something went wrong. Unable to upload to ipfs");
        setIpfsActive(false);
      } else {
        console.log("uploaded at hash: ", hash.cid.string);
        props.prufClient.utils.ipfsToB32(hash.cid.string).then((hash) => {
          setIpfsActive(false);
          updateAssetMS([
            hash,
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          ]);
        });
      }
    });
  };

  const postToArweave = async (data) => {
    let dataTransaction = await props.arweaveClient.createTransaction({
      data: data,
    });

    console.log(
      "pre-tags",
      dataTransaction.tags,
      "Size:",
      Buffer.from(JSON.stringify(dataTransaction.tags)).length
    );

    if (data) {
      dataTransaction.addTag(
        "Primary-Content",
        `https://arweave.net/${dataTransaction.id}`
      );
      const vals = Object.values(data);
      const keys = Object.keys(data);

      keys.forEach((key) => dataTransaction.addTag(tag, String(vals[i])));
    }

    console.log(
      "post-tags",
      dataTransaction.tags,
      "Size:",
      Buffer.from(JSON.stringify(dataTransaction.tags)).length
    );

    console.log(dataTransaction);

    // eslint-disable-next-line react/prop-types
    await props.arweaveClient.transactions.sign(dataTransaction);
    // eslint-disable-next-line react/prop-types
    const statusBeforePost = await props.arweaveClient.transactions.getStatus(
      dataTransaction.id
    );
    console.log(statusBeforePost); // this will return 404

    mineTx(dataTransaction).then(async () => {
      // eslint-disable-next-line react/prop-types

      setIpfsActive(false);
      props.prufClient.utils
        .arweaveTxToB32(dataTransaction.id)
        .then((hashes) => {
          updateAssetMS(hashes);
        });
    });
  };

  const mineTx = async (tx) => {
    let uploader = await props.arweaveClient.transactions.getUploader(tx);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(
        `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
      );
    }
  };

  const editElement = (key) => {
    if (!key) key = `Mutable Element #${Object.values(asset.mutableStorage).length + 1}`
    let value = ""
    swalReact({
      buttons : {
        back: {
          text: "⬅️ Go Back",
          value: "confirm",
          className: "delegationButtonBack",
        },
        confirm: {
          text: "Submit ✅",
          value: "confirm",
          className: "delegationButtonBack",
        }
      },
      content: 
      <Card className="delegationCard">
          <CustomInput
            labelText={`Title (Optional)`}
            id="model"
            formControlProps={{
              onChange: e=>key = e.target.value,
              fullWidth: true,
            }}
            inputProps={{
              disabled: false,
            }}
          />
          <CustomInput
            labelText={`Content`}
            id="model"
            formControlProps={{
              fullWidth: true,
              onChange: e=>value = e.target.value,
            }}
            inputProps={{
              disabled: false,
            }}
          />
        </Card>
    }).then(val=>{
      if(val === "confirm") handleChanges(key, value)
    })
  };

  const updateAssetMS = (hashes) => {
    setHelp(false);
    if (!hash || !id) {
      return;
    }
    // eslint-disable-next-line react/prop-types
    const pageKey = thousandHashesOf(props.addr, props.winKey); //thousandHashesOf(props.addr, props.winKey)

    console.log("id", id);
    // eslint-disable-next-line react/prop-types
    console.log("addr: ", props.addr);
    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);
    props.prufClient.do.asset
      .modifyMutableStorage(id, hashes[0], hashes[1])
      // eslint-disable-next-line react/prop-types
      .send({ from: props.addr })
      .on("error", function (_error) {
        setTransactionActive(false);
        setTxStatus(false);
        setTxHash(Object.values(_error)[0].transactionHash);
        tempTxHash = Object.values(_error)[0].transactionHash;
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        setError(Object.values(_error)[0]);
        if (tempTxHash !== undefined) {
          swalReact({
            title: "Something went wrong!",
            content: link,
            icon: "warning",
            button: "Close",
          });
        }
        if (tempTxHash === undefined) {
          swalReact({
            title: "Something went wrong!",
            icon: "warning",
            button: "Close",
          });
        }
      })
      .on("receipt", (receipt) => {
        setTransactionActive(false);
        setTxStatus(receipt.status);
        tempTxHash = receipt.transactionHash;
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        setTxHash(receipt.transactionHash);
        swalReact({
          title: "Information Successfully Updated!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(() => {
          //refreshBalances()
          window.newDescObj = JSON.parse(JSON.stringify(newMutableStorage));
          window.backIndex = asset.dBIndex;
          window.location.href = asset.lastRef;
          window.replaceAssetData = {
            key: pageKey,
            newMutableStorage: newMutableStorage,
            assetAction: "mod",
          };
          window.replaceAssetData.refreshBals = true;
          window.dispatchEvent(props.refresh);
        });
      });
  };

  const displaymutableStorage = () => {
    let component = [
      <span>
        <Button onClick={() => editElement()}>
          <NoteAddOutlined size="40px" />
        </Button>
      </span>,
    ];
    if (asset.mutableStorage === "") return component;

    let keys = Object.keys(asset.mutableStorage);

    keys.forEach((key) => {
      component.unshift(
        <Accordion key={`AccordionStack${key}`}>
          {/* <h4>{key}</h4> */}
          <AccordionSummary
            expandIcon={<ExpandMoreOutlined />}
            aria-label="Expand"
            aria-controls="additional-actions1-content"
            id={`additional-actions1-header-${key}`}
          >
            <h4>{key}</h4>
            {/* <FormControlLabel
              aria-label="Acknowledge"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onFocus={(event) => {
                event.stopPropagation();
              }}
              // control={
              //   <Checkbox
              //     disabled={!(prufBalance > props.min)}
              //     onClick={() =>
              //       (isTierChecked[`chk${props.pos}`] =
              //         !isTierChecked[`chk${props.pos}`])
              //     }
              //     classes={{
              //       checked: classes.checked,
              //       root: classes.checkRoot,
              //     }}
              //   />
              // }
              label={`${key} ${asset.mutableStorage[key].substring(0, 28)}...`}
            /> */}
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <div className="delegationTips">
                <FiberManualRecordTwoTone className="delegationPin" />
                <h5 className="delegationTipsContent">
                  {asset.mutableStorage[key]}
                </h5>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      );
    });

    return component;
  };

  const thousandHashesOf = (varToHash) => {
    if (!window.web3) return (window.location.href = "/#/user/home");
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  };

  // const addImage = async (prefix, buffer, fileName, iteration) => {
  //   if (!buffer) return;
  //   if (!iteration) {
  //     iteration = 1;
  //   }
  //   console.log(fileName);

  //   let tempObj = JSON.parse(JSON.stringify(newMutableStorage));
  //   if (tempObj.photo[fileName]) {
  //     //console.log("Already exists, adding copy")
  //     let tempFN = fileName;
  //     tempFN += "_(" + iteration + ")";
  //     if (tempObj.photo[tempFN]) {
  //       return addImage(buffer, fileName, iteration + 1);
  //     } else {
  //       fileName = tempFN;
  //     }
  //   }

  //   let tempBuffer = buffer;

  //   var i = new Image();

  //   i.onload = function () {
  //     console.log(i.height, i.width);
  //     if (i.height > maxImageSize || i.width > maxImageSize) {
  //       let newH, newW, ar;
  //       if (i.width > i.height) {
  //         ar = i.height / i.width;
  //         newW = maxImageSize;
  //         newH = ar * newW;
  //       } else {
  //         ar = i.width / i.height;
  //         newH = maxImageSize;
  //         newW = ar * newH;
  //       }
  //       console.log("Resizing image... ");
  //       resizeImg(tempBuffer, {
  //         height: newH,
  //         width: newW,
  //         format: "jpg",
  //       }).then((e) => {
  //         console.log("Resized to ", newH, "x", newW);
  //         tempObj.photo[fileName] = prefix + base64.encode(e);

  //         window.ipfs.add(prefix + base64.encode(e)).then((hash) => {
  //           if (!hash) {
  //             //console.error(err)
  //             return setIsUploading(false);
  //           } else {
  //             let url = `https://ipfs.io/ipfs/${hash.cid}`;
  //             console.log(`Url --> ${url}`);
  //             tempObj.photoUrls[fileName] = url;
  //             setNewMutableStorage(tempObj);
  //             if (selectedImage === "") {
  //               setSelectedImage(tempObj.photo[fileName]);
  //               setSelectedKey(fileName);
  //             }
  //             setIsUploading(false);
  //             return forceUpdate();
  //           }
  //         });
  //       });
  //     } else {
  //       resizeImg(tempBuffer, {
  //         height: i.height,
  //         width: i.width,
  //         format: "jpg",
  //       }).then((e) => {
  //         console.log("Converted to .JPG");
  //         tempObj.photo[fileName] = prefix + base64.encode(e);

  //         window.ipfs.add(prefix + base64.encode(e)).then((hash) => {
  //           if (!hash) {
  //             //console.error(err)
  //             return setIsUploading(false);
  //           } else {
  //             let url = `https://ipfs.io/ipfs/${hash.cid}`;
  //             console.log(`Url --> ${url}`);
  //             tempObj.photoUrls[fileName] = url;
  //             setNewMutableStorage(tempObj);
  //             if (selectedImage === "") {
  //               setSelectedImage(tempObj.photo[fileName]);
  //               setSelectedKey(fileName);
  //             }
  //             setIsUploading(false);
  //             return forceUpdate();
  //           }
  //         });
  //       });
  //     }
  //   };

  //   i.src = prefix + base64.encode(tempBuffer);
  // };

  const copyTextSnippet = (temp) => {
    navigator.clipboard.writeText(temp);
    if (isMobile && !isAndroid) {
      swalReact("Asset ID Copied to Clipboard!");
    } else if (!isMobile) {
      setCopyText(true);
      setTimeout(() => {
        setCopyText(false);
      }, 1000);
    }
  };

  // const useCustomJSON = (e) => {
  //   if (!e.target.files[0]) return;
  //   let newObj;
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const str = reader.result;
  //     try {
  //       newObj = JSON.parse(str);
  //     } catch (file) {
  //       return console.log("Error converting file to JSON.", file);
  //     }

  //     if (newObj) {
  //       newObj.photoUrls = newMutableStorage.photoUrls;
  //       console.log(newObj);
  //       if (newObj.name && newObj.text && newObj.photo && newObj.urls) {
  //         console.log("Setting new JSON config into state");
  //         setNewMutableStorage(newObj);
  //         forceUpdate();
  //       } else {
  //         return console.log("Does not contain the requisite keys");
  //       }
  //       // forceUpdate()
  //       // return e.target.value = null;
  //     }
  //   };
  //   //const photo = document.getElementById("photo");
  //   reader.readAsText(e.target.files[0]); // Read Provided File
  // };

  // const createBackupJSON = () => {
  //   let filename;
  //   if (newMutableStorage.name !== "") {
  //     filename = newMutableStorage.name.replace(/ /g, "_") + "_Backup.json";
  //   } else {
  //     filename = "unnamed_asset_backup.json";
  //   }

  //   let tempObj = JSON.parse(JSON.stringify(newMutableStorage));
  //   tempObj.photo = tempObj.photoUrls;
  //   delete tempObj.photoUrls;

  //   const data = new Blob([JSON.stringify(tempObj, null, 5)], {
  //     type: "application/json",
  //   });
  //   const fileURL = URL.createObjectURL(data);
  //   const anchorTag = document.createElement("a");
  //   anchorTag.href = fileURL;
  //   anchorTag.target = "_blank";
  //   anchorTag.className = "imageInput";
  //   anchorTag.download = filename;
  //   document.body.appendChild(anchorTag);
  //   anchorTag.click();
  //   document.body.removeChild(anchorTag);
  // };

  // const settings = () => {
  //   swalReact("What would you like to do with this image?", {
  //     buttons: {
  //       delete: {
  //         text: "Delete",
  //         value: "delete",
  //       },
  //       profile: {
  //         text: "Set Default",
  //         value: "default",
  //       },
  //       back: {
  //         text: "Cancel",
  //         value: "back",
  //       },
  //     },
  //   }).then((value) => {
  //     switch (value) {
  //       case "delete":
  //         if (
  //           newMutableStorage.photo.displayImage === undefined &&
  //           Object.values(newMutableStorage.photo).length === 0
  //         ) {
  //           return swalReact("Cannot delete asset identicon.");
  //         }
  //         swalReact("Are you sure you want to delete this image?", {
  //           buttons: {
  //             yes: {
  //               text: "Delete",
  //               value: "yes",
  //             },
  //             no: {
  //               text: "Cancel",
  //               value: "no",
  //             },
  //           },
  //         }).then((value) => {
  //           switch (value) {
  //             case "yes":
  //               removeElement(image, selectedKey);
  //               swalReact("Image Deleted!");
  //               break;

  //             case "no":
  //               swalReact("Image not Deleted");
  //               break;

  //             default:
  //               return;
  //           }
  //         });
  //         break;

  //       case "default":
  //         if (
  //           newMutableStorage.photo.displayImage === undefined &&
  //           Object.values(newMutableStorage.photo).length === 0
  //         ) {
  //           return swalReact("Cannot set asset identicon as default image.");
  //         }
  //         setDisplayImage(selectedImage, selectedKey);
  //         swalReact("Default image set!");
  //         break;

  //       case "back":
  //         break;

  //       default:
  //         return;
  //     }
  //   });
  // };

  // const deleteURL = (key) => {
  //   swalReact("Delete this URL?", {
  //     buttons: {
  //       delete: {
  //         text: "delete",
  //         value: "delete",
  //       },
  //       back: {
  //         text: "Cancel",
  //         value: "back",
  //       },
  //     },
  //   }).then((value) => {
  //     switch (value) {
  //       case "delete":
  //         swalReact("Are you sure you want to delete this URL?", {
  //           buttons: {
  //             yes: {
  //               text: "Delete",
  //               value: "yes",
  //             },
  //             no: {
  //               text: "No",
  //               value: "no",
  //             },
  //           },
  //         }).then((value) => {
  //           switch (value) {
  //             case "yes":
  //               removeElement(url, key);
  //               break;

  //             case "no":
  //               break;

  //             default:
  //               return;
  //           }
  //         });
  //         break;

  //       case "back":
  //         break;

  //       default:
  //         return;
  //     }
  //   });
  // };

  // const generateUrls = (obj) => {
  //   if (!obj.urls) {
  //     return;
  //   } else if (Object.values(obj.urls).length === 0) {
  //     return;
  //   }
  //   let urls = Object.values(obj.urls),
  //     keys = Object.keys(obj.urls),
  //     component = [
  //       <div key="UrlHeader">
  //         <h4 className="bold_h4"> Attatched Links</h4>
  //         <hr className="bold_hr" />
  //       </div>,
  //     ];
  //   for (let i = 0; i < urls.length; i++) {
  //     component.push(
  //       <div className="inlineDelete" key={"url" + i}>
  //         <div
  //           className="deleteURL"
  //           onClick={() => {
  //             deleteURL(keys[i]);
  //           }}
  //         >
  //           <Danger>
  //             <DeleteForever />
  //           </Danger>
  //         </div>
  //         <h4 className={classes.cardTitle}>
  //           {" "}
  //           {keys[i]}:{" "}
  //           <a href={urls[i]} rel="noopener noreferrer" target="_blank">
  //             {urls[i]}
  //           </a>
  //         </h4>
  //         <hr />
  //       </div>
  //     );
  //   }
  //   return component;
  // };

  // const generateThumbs = (obj) => {
  //   return []
  //   console.log(obj);
  //   let component = [],
  //     photos = Object.values(obj.photo),
  //     keys = Object.keys(obj.photo);
  //   //console.log("photos", photos)

  //   if (photos.length === 0 && !isUploading) {
  //     return (
  //       <div className="assetImageSelectorButton">
  //         <img
  //           title="View Image"
  //           src={placeholder}
  //           className="imageSelectorImage"
  //           alt=""
  //         />
  //       </div>
  //     );
  //   }
  //   if (photos.length === 0 && isUploading) {
  //     return (
  //       <>
  //         <div className="assetImageSelectorButton">
  //           <div className="lds-default">
  //             <div></div>
  //             <div></div>
  //             <div></div>
  //             <div></div>
  //             <div></div>
  //             <div></div>
  //             <div></div>
  //             <div></div>
  //             <div></div>
  //             <div></div>
  //             <div></div>
  //             <div></div>
  //           </div>
  //         </div>
  //       </>
  //     );
  //   }
  //   for (let i = 0; i < photos.length; i++) {
  //     console.log(photos)
  //     component.push(
  //       <div
  //         key={"thumb" + String(i)}
  //         value={keys[i]}
  //         className="assetImageSelectorButton"
  //         onClick={() => {
  //           showImage(photos[i], keys[i]);
  //         }}
  //       >
  //         <img
  //           title="View Image"
  //           src={photos[i]}
  //           className="imageSelectorImage"
  //           alt=""
  //         />
  //       </div>
  //     );
  //   }
  //   if (isUploading === true) {
  //     component.push(
  //       <div className="assetImageSelectorButton">
  //         <div className="lds-default">
  //           <div></div>
  //           <div></div>
  //           <div></div>
  //           <div></div>
  //           <div></div>
  //           <div></div>
  //           <div></div>
  //           <div></div>
  //           <div></div>
  //           <div></div>
  //           <div></div>
  //           <div></div>
  //         </div>
  //       </div>
  //     );
  //   }
  //   return component;
  // };

  const goBack = () => {
    window.backIndex = asset.dBIndex;
    window.location.href = asset.lastRef;
  };

  // const showImage = (img, key) => {
  //   setSelectedImage(img);
  //   setSelectedKey(key);
  // };

  if (!props.prufClient) {
    return (
      <>
        <Card>
          <CardHeader icon>
            <CardIcon className="headerIconBack"></CardIcon>
            <Button
              color="info"
              className="MLBGradient"
              onClick={() => goBack()}
            >
              Go Back
            </Button>
          </CardHeader>
          <CardBody>
            <h2>Oops, something went wrong...</h2>
          </CardBody>
          <br />
        </Card>
      </>
    );
  }

  return (
    <div>
      <Button color="info" className="MLBGradient" onClick={() => goBack()}>
        Go Back
      </Button>
      <Card>
        <>
          {!isMobile && (
            <CardHeader image className={classes.cardHeaderHoverCustom}>
              {asset.displayImage !== "" && (
                <>
                  {/* <Tooltip
                        id="tooltip-top"
                        title="Back"
                        placement="bottom"
                        classes={{ tooltip: classes.tooltip }}
                      >
                         <Button
                          onClick={() => moreInfo("back")}
                          color="info"
                          justIcon
                          className="back"
                        >
                          <KeyboardArrowLeft />
                        </Button> 
                      </Tooltip> */}
                  {asset.nodeData.storageProvider === "2" && (
                    <Tooltip title="See it on ARweave">
                      <a
                        href={`${asset.displayImage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={selectedImage} alt="" />
                      </a>
                    </Tooltip>
                  )}
                  {asset.nodeData.storageProvider === "1" && (
                    <img src={selectedImage} alt="" />
                  )}
                </>
              )}
              {asset.displayImage === "" && (
                <>
                  <Tooltip
                    id="tooltip-top"
                    title="Back"
                    placement="bottom"
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <Button
                      onClick={() => moreInfo("back")}
                      color="info"
                      justIcon
                      className="back"
                    >
                      <KeyboardArrowLeft />
                    </Button>
                  </Tooltip>
                  <div className="jdenticonMoreInfo">
                    <Jdenticon value={asset.id} />
                  </div>
                </>
              )}
            </CardHeader>
          )}
          {isMobile && (
            <CardHeader
              image
              onClick={() => moreInfo("back")}
              className={classes.cardHeaderHover}
            >
              {asset.displayImage !== "" && (
                <>
                  <Tooltip
                    id="tooltip-top"
                    title="Back"
                    placement="bottom"
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <Button
                      onClick={() => moreInfo("back")}
                      color="info"
                      justIcon
                      className="back"
                    >
                      <KeyboardArrowLeft />
                    </Button>
                  </Tooltip>
                  <img src={selectedImage} alt="..." />
                </>
              )}
              {asset.displayImage === "" && (
                <>
                  <Tooltip
                    id="tooltip-top"
                    title="Back"
                    placement="bottom"
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <Button
                      onClick={() => moreInfo("back")}
                      color="info"
                      justIcon
                      className="back"
                    >
                      <KeyboardArrowLeft />
                    </Button>
                  </Tooltip>
                  <div className="jdenticonMoreInfo">
                    <Jdenticon className="jdenticonMoreInfo" value={asset.id} />
                  </div>
                </>
              )}
            </CardHeader>
          )}
        </>
        <CardBody>
          {/* {Object.values(asset.photo).length > 1 && (
                <div className="imageSelector">
                  {generateThumbs(asset)}
                </div>
              )} */}
          <div className="horizontal">
            <h4 className={classes.cardTitleContent}>Name:&nbsp;</h4>
            <h4 className={classes.cardTitle}>
              {asset.nonMutableStorage.name}
            </h4>
          </div>
          <div className="horizontal">
            <h4 className={classes.cardTitleContent}>Node:&nbsp;</h4>
            <h4 className={classes.cardTitle}>{asset.nodeName}</h4>
          </div>

          {/* {asset.currency === "0" && (
                <div className="horizontal">
                  <h4 className={classes.cardTitleContent}>
                    Status:&nbsp;
              </h4>
                  <h4 className={classes.cardTitle}>
                    {asset.status}
                  </h4>
                </div>
              )}
              {asset.currency === undefined && (
                <div className="horizontal">
                  <h4 className={classes.cardTitleContent}>
                    Status:&nbsp;
              </h4>
                  <h4 className={classes.cardTitle}>
                    {asset.status}
                  </h4>
                </div>
              )}
              {asset.currency !== "0" &&
                asset.currency !== undefined && (
                  <>
                    <div className="horizontal">
                      <h4 className={classes.cardTitleContent}>
                        Status:&nbsp;
                </h4>
                      <h4 className={classes.cardTitle}>
                        {asset.status}
                      </h4>
                    </div>
                    <div className="horizontal">
                      <h4 className={classes.cardTitleContent}>
                        Sale Price:&nbsp;
                </h4>
                      <h4 className={classes.cardTitle}>
                        {currency}{asset.price}
                      </h4>
                    </div>
                  </>
                )} */}

          <br />
          {asset.nonMutableStorage.engraving !== undefined && (
            <>
              <br />
              <TextField
                // id="outlined-multiline"
                label="Engraving"
                // multiline
                rows={2}
                defaultValue={asset.nonMutableStorage.engraving}
                variant="outlined"
                fullWidth
                disabled
                className={engravingClasses.engraving}
              />
            </>
          )}
          {asset.nonMutableStorage.engraving === undefined && (
            <TextField
              // id="outlined-multiline"
              label="Engraving"
              // multiline
              rows={2}
              defaultValue="None"
              variant="outlined"
              fullWidth
              disabled
              className={engravingClasses.engraving}
            />
          )}
          {displaymutableStorage()}
          {/*@dev URLs go here*/}
          <br />
        </CardBody>
        <CardFooter>
          {!isMobile && (
            <>
              {!copyText && (
                <Tooltip title="Copy to Clipboard">
                  <div className={classes.stats}>
                    Asset ID:
                    <button
                      className="IDText"
                      onClick={() => {
                        copyTextSnippet(asset.id);
                      }}
                    >
                      {asset.id}
                    </button>
                  </div>
                </Tooltip>
              )}
              {copyText && (
                <Tooltip title="Copied to Clipboard">
                  <div className={classes.stats}>
                    Asset ID:
                    <button
                      className="IDText"
                      onClick={() => {
                        copyTextSnippet(asset.id);
                      }}
                    >
                      {asset.id}
                    </button>
                  </div>
                </Tooltip>
              )}
            </>
          )}
          {isMobile && !isAndroid && (
            <>
              {!copyText && (
                <Tooltip title="Copy to Clipboard">
                  <div className={classes.stats}>
                    Asset ID:
                    <button
                      className="IDText"
                      onClick={() => {
                        copyTextSnippet(asset.id);
                      }}
                    >
                      {asset.id.substring(0, 10) +
                        "..." +
                        asset.id.substring(56, 66)}
                    </button>
                  </div>
                </Tooltip>
              )}
              {copyText && (
                <Tooltip title="Copied to Clipboard">
                  <div className={classes.stats}>
                    Asset ID:
                    <button
                      className="IDText"
                      onClick={() => {
                        copyTextSnippet(asset.id);
                      }}
                    >
                      {asset.id.substring(0, 10) +
                        "..." +
                        asset.id.substring(56, 66)}
                    </button>
                  </div>
                </Tooltip>
              )}
            </>
          )}
          {isMobile && isAndroid && (
            <Tooltip title="Copy to Clipboard">
              <CopyToClipboard
                text={asset.id}
                onCopy={() => {
                  swalReact("Asset ID Copied to Clipboard!");
                }}
              >
                <span>
                  Asset ID:
                  {asset.id.substring(0, 10) +
                    "..." +
                    asset.id.substring(56, 66)}
                </span>
              </CopyToClipboard>
            </Tooltip>
          )}
          <div className="icons">
            <RWebShare
              className="shareMenu"
              data={{
                text: "Check out my PRüF-verified asset!",
                url: URL,
                title: "Share Asset Link",
              }}
            >
              <Tooltip title="Share Asset URL">
                <Icon className="footerIcon">
                  <Share />
                </Icon>
              </Tooltip>
            </RWebShare>
            <Tooltip title="View QR">
              <Icon
                className="footerIcon"
                onClick={() => {
                  swalReact({
                    content: (
                      <QRCode
                        value={URL}
                        size="160"
                        fgColor="#002a40"
                        quietZone="2"
                        ecLevel="M"
                      />
                    ),
                    buttons: "close",
                  });
                }}
              >
                qr_code
              </Icon>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
