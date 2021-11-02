import React from "react";
import "../../assets/css/custom.css";
import { isMobile, isAndroid } from "react-device-detect";
import swal from "sweetalert";
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
import {AddPhotoAlternateOutlined, DeleteForever, Settings, KeyboardArrowLeft,} from "@material-ui/icons";
import Share from "@material-ui/icons/Share";
import Icon from "@material-ui/core/Icon";
import FormControl from "@material-ui/core/FormControl";
import Check from "@material-ui/icons/Check";
import CardFooter from "components/Card/CardFooter.js";
import placeholder from "../../assets/img/placeholder.jpg";
import { RWebShare } from "react-web-share";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import formStyles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import engravingStyles from "../../assets/css/custom";
import Danger from "components/Typography/Danger";

const useStyles = makeStyles(styles);
const useFormStyles = makeStyles(formStyles);
const useEngravingStyles = makeStyles(engravingStyles);

export default function ModifyDescription(props) {
  if(!window.sentPacket) window.sentPacket = {}

  const [asset] = React.useState(JSON.parse(JSON.stringify(window.sentPacket)));
  console.log(window.sentPacket)

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
    }

    else if (asset.statusNum && !hasMounted && asset !== undefined) {
      if (
        asset.statusNum === "50" ||
        asset.statusNum === "56" ||
        asset.statusNum === "70"
      ) {
        swal({
          title: "Asset not in correct status!",
          text:
            "This asset is not in a modifiable status, please set asset into a non-escrow status before attempting to modify.",
          icon: "warning",
          button: "Close",
        }).then(() => {
          window.backIndex = asset.dBIndex;
          window.location.href = asset.lastRef;
        });
      }

      // else if (asset.nodeData.storageProvider === "2") {
      //   swal({
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
      setSelectedImage(asset.displayImage)
      setHasMounted(true);
    }
  }, []);


  let fileInput = React.createRef();
  let fileInputJSON = React.createRef();

  const handleClick = () => {
    fileInput.current.value = "";
    fileInput.current.click();
  };

  const handleJSON = () => {
    fileInputJSON.current.value = "";
    fileInputJSON.current.click();
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
    let tempObj = JSON.parse(JSON.stringify(newasset));
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
    setNewasset(tempObj);
    return forceUpdate();
  };

  const setDisplayImage = (img, key) => {
    // console.log("Deleting: ", key);
    // let tempObj = JSON.parse(JSON.stringify(newasset));
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
    // setNewasset(tempObj);
    // setSelectedImage(tempObj.photo.displayImage);
    // setSelectedKey("displayImage");
    // return forceUpdate();
  };

  // const resetChanges = () => {
  //   setNewasset(asset);
  //   return forceUpdate();
  // };

  const submitChanges = async () => {
    if (JSON.stringify(newasset) === JSON.stringify(asset)) {
      return swal({
        title: "New data matches old! No changes made.",
        icon: "warning",
        button: "Close",
      });
    }
    let tempObj = JSON.parse(JSON.stringify(newasset));
    tempObj.photo = tempObj.photoUrls;
    delete tempObj.photoUrls;

    let payload = JSON.stringify(tempObj, null, 5);
    let fileSize = Buffer.byteLength(payload, "utf8");

    if (fileSize > 1000000) {
      return swal({
        title:
          "Document size exceeds 1 MB limit! (" + String(fileSize) + "Bytes)",
        icon: "warning",
        button: "Close",
      });
    }

    setIpfsActive(true);
    console.log("Submitting changes. Parsed Payload: ", tempObj);

    window.ipfs.add(payload).then((hash) => {
      if (!hash) {
        console.error("error sending to ipfs");
        return setIpfsActive(false);
      } else {
        let url = `https://ipfs.io/ipfs/${hash.cid}`;
        console.log(`Url --> ${url}`);
        let b32Hash = window.utils.getBytes32FromIPFSHash(String(hash.cid));
        setIpfsActive(false);
        updateasset(b32Hash, tempObj);
      }
    });
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

  const updateasset = (hash, newAsset) => {
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
    props.prufClient.do
      .asset.modifyMutableStorage(id, hash)
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
          swal({
            title: "Something went wrong!",
            content: link,
            icon: "warning",
            button: "Close",
          });
        }
        if (tempTxHash === undefined) {
          swal({
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
        swal({
          title: "Information Successfully Updated!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(() => {
          //refreshBalances()
          window.newDescObj = JSON.parse(JSON.stringify(newasset));
          window.backIndex = asset.dBIndex;
          window.location.href = asset.lastRef;
          window.replaceAssetData = {
            key: pageKey,
            newAsset: newAsset,
            assetAction: "mod"
          };
          window.replaceAssetData.refreshBals = true
        window.dispatchEvent(props.refresh)
        });
      });
  };

  const urlKeyIsGood = (e) => {
    if (newasset.urls) {
      if (newasset.urls[e] || e === "") {
        return false;
      }
    }
    return true;
  };

  const submitCurrentUrl = () => {
    let url = assetURL,
      key = URLTitle,
      tempObj = JSON.parse(JSON.stringify(newasset));
    if ((url === "" && key !== "") || (url !== "" && key === "")) {
      if (url === "") {
        return setloginURLState("error");
      }
      if (key === "") {
        return setloginURLTitleState("error");
      }
    }
    if (!tempObj.urls) {
      tempObj.urls = {};
    }
    if (!url.includes("http")) {
      url = "http://" + url;
    }
    tempObj.urls[key] = url;
    console.log(tempObj);
    setNewasset(tempObj);
    setAssetURL("");
    setURLTitle("");
    setloginURLState("");
    setloginURLTitleState("");
    return forceUpdate();
  };

  const handleDescription = (e) => {
    let tempObj = JSON.parse(JSON.stringify(newasset));
    tempObj.text.Description = e;
    setNewasset(tempObj);
  };

  const renderImage = (mobile) => {
    //console.log("AI", asset)
    //console.log("NAI", newasset)
    if (!mobile) {
      if (
        newasset.photo.displayImage !== undefined ||
        Object.values(newasset.photo).length > 0
      ) {
        console.log(selectedImage)
        return (
          <CardHeader image className={classes.cardHeaderHoverCustom}>
            <Button
              color="info"
              justIcon
              className="back"
              onClick={() => {
                settings();
              }}
            >
              <Settings />
            </Button>
            <img src={selectedImage} alt="..." />
          </CardHeader>
        );
      } else if (
        newasset.photo.displayImage === undefined &&
        Object.values(newasset.photo).length === 0
      ) {
        return (
          <CardHeader image className={classes.cardHeaderHoverCustom}>
            <Button
              color="info"
              justIcon
              className="back"
              onClick={() => {
                settings();
              }}
            >
              <Settings />
            </Button>
            <Jdenticon value={asset.id} />
          </CardHeader>
        );
      }
    } else if (mobile) {
      if (
        newasset.photo.displayImage !== undefined ||
        Object.values(newasset.photo).length > 0
      ) {
        return (
          <CardHeader image className={classes.cardHeaderHover}>
            <Button
              color="info"
              justIcon
              className="back"
              onClick={() => {
                settings();
              }}
            >
              <Settings />
            </Button>
            <img src={selectedImage} alt="..." />
          </CardHeader>
        );
      } else if (
        newasset.photo.displayImage === undefined &&
        Object.values(newasset.photo).length === 0
      ) {
        return (
          <CardHeader image className={classes.cardHeaderHover}>
            {asset.identicon}
          </CardHeader>
        );
      }
    }
  };

  const addImage = async (prefix, buffer, fileName, iteration) => {
    if (!buffer) return;
    if (!iteration) {
      iteration = 1;
    }
    console.log(fileName);

    let tempObj = JSON.parse(JSON.stringify(newasset));
    if (tempObj.photo[fileName]) {
      //console.log("Already exists, adding copy")
      let tempFN = fileName;
      tempFN += "_(" + iteration + ")";
      if (tempObj.photo[tempFN]) {
        return addImage(buffer, fileName, iteration + 1);
      } else {
        fileName = tempFN;
      }
    }

    let tempBuffer = buffer;

    var i = new Image();

    i.onload = function () {
      console.log(i.height, i.width);
      if (i.height > maxImageSize || i.width > maxImageSize) {
        let newH, newW, ar;
        if (i.width > i.height) {
          ar = i.height / i.width;
          newW = maxImageSize;
          newH = ar * newW;
        } else {
          ar = i.width / i.height;
          newH = maxImageSize;
          newW = ar * newH;
        }
        console.log("Resizing image... ");
        resizeImg(tempBuffer, {
          height: newH,
          width: newW,
          format: "jpg",
        }).then((e) => {
          console.log("Resized to ", newH, "x", newW);
          tempObj.photo[fileName] = prefix + base64.encode(e);

          window.ipfs.add(prefix + base64.encode(e)).then((hash) => {
            if (!hash) {
              //console.error(err)
              return setIsUploading(false);
            } else {
              let url = `https://ipfs.io/ipfs/${hash.cid}`;
              console.log(`Url --> ${url}`);
              tempObj.photoUrls[fileName] = url;
              setNewasset(tempObj);
              if (selectedImage === "") {
                setSelectedImage(tempObj.photo[fileName]);
                setSelectedKey(fileName);
              }
              setIsUploading(false);
              return forceUpdate();
            }
          });
        });
      } else {
        resizeImg(tempBuffer, {
          height: i.height,
          width: i.width,
          format: "jpg",
        }).then((e) => {
          console.log("Converted to .JPG");
          tempObj.photo[fileName] = prefix + base64.encode(e);

          window.ipfs.add(prefix + base64.encode(e)).then((hash) => {
            if (!hash) {
              //console.error(err)
              return setIsUploading(false);
            } else {
              let url = `https://ipfs.io/ipfs/${hash.cid}`;
              console.log(`Url --> ${url}`);
              tempObj.photoUrls[fileName] = url;
              setNewasset(tempObj);
              if (selectedImage === "") {
                setSelectedImage(tempObj.photo[fileName]);
                setSelectedKey(fileName);
              }
              setIsUploading(false);
              return forceUpdate();
            }
          });
        });
      }
    };

    i.src = prefix + base64.encode(tempBuffer);
  };

  const uploadImage = (e) => {
    e.preventDefault();
    if (!e.target.files[0]) return;
    let file;
    //console.log(e.target.files[0]);
    file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (!file.type.includes("image")) {
        //setIsUploading(false)
        return swal({
          title: "Unsupported File Type",
          button: "Close",
        });
      }
      setIsUploading(true);
      const fileType = file.type;
      const fileName = file.name;
      const prefix = `data:${fileType};base64,`;
      const buf = Buffer(reader.result);
      //const base64buf = prefix + base64.encode(buf);
      addImage(prefix, buf, fileName);
    };
    //const photo = document.getElementById("photo");
    reader.readAsArrayBuffer(e.target.files[0]); // Read Provided File
  };

  const copyTextSnippet = (temp) => {
    navigator.clipboard.writeText(temp);
    if (isMobile && !isAndroid) {
      swal("Asset ID Copied to Clipboard!");
    } else if (!isMobile) {
      setCopyText(true);
      setTimeout(() => {
        setCopyText(false);
      }, 1000);
    }
  };

  const useCustomJSON = (e) => {
    if (!e.target.files[0]) return;
    let newObj;
    const reader = new FileReader();
    reader.onloadend = () => {
      const str = reader.result;
      try {
        newObj = JSON.parse(str);
      } catch (file) {
        return console.log("Error converting file to JSON.", file);
      }

      if (newObj) {
        newObj.photoUrls = newasset.photoUrls;
        console.log(newObj);
        if (newObj.name && newObj.text && newObj.photo && newObj.urls) {
          console.log("Setting new JSON config into state");
          setNewasset(newObj);
          forceUpdate();
        } else {
          return console.log("Does not contain the requisite keys");
        }
        // forceUpdate()
        // return e.target.value = null;
      }
    };
    //const photo = document.getElementById("photo");
    reader.readAsText(e.target.files[0]); // Read Provided File
  };

  const createBackupJSON = () => {
    let filename;
    if (newasset.name !== "") {
      filename = newasset.name.replace(/ /g, "_") + "_Backup.json";
    } else {
      filename = "unnamed_asset_backup.json";
    }

    let tempObj = JSON.parse(JSON.stringify(newasset));
    tempObj.photo = tempObj.photoUrls;
    delete tempObj.photoUrls;

    const data = new Blob([JSON.stringify(tempObj, null, 5)], {
      type: "application/json",
    });
    const fileURL = URL.createObjectURL(data);
    const anchorTag = document.createElement("a");
    anchorTag.href = fileURL;
    anchorTag.target = "_blank";
    anchorTag.className = "imageInput";
    anchorTag.download = filename;
    document.body.appendChild(anchorTag);
    anchorTag.click();
    document.body.removeChild(anchorTag);
  };

  // const settings = () => {
  //   swal("What would you like to do with this image?", {
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
  //           newasset.photo.displayImage === undefined &&
  //           Object.values(newasset.photo).length === 0
  //         ) {
  //           return swal("Cannot delete asset identicon.");
  //         }
  //         swal("Are you sure you want to delete this image?", {
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
  //               swal("Image Deleted!");
  //               break;

  //             case "no":
  //               swal("Image not Deleted");
  //               break;

  //             default:
  //               return;
  //           }
  //         });
  //         break;

  //       case "default":
  //         if (
  //           newasset.photo.displayImage === undefined &&
  //           Object.values(newasset.photo).length === 0
  //         ) {
  //           return swal("Cannot set asset identicon as default image.");
  //         }
  //         setDisplayImage(selectedImage, selectedKey);
  //         swal("Default image set!");
  //         break;

  //       case "back":
  //         break;

  //       default:
  //         return;
  //     }
  //   });
  // };

  // const deleteURL = (key) => {
  //   swal("Delete this URL?", {
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
  //         swal("Are you sure you want to delete this URL?", {
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

  if(!props.prufClient){
    return <>
      <Card>
          <CardHeader icon>
            <CardIcon className="headerIconBack">
              
            </CardIcon>
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
                <h4 className={classes.cardTitleContent}>
                  Name:&nbsp;
            </h4>
                <h4 className={classes.cardTitle}>
                  {asset.nonMutableStorage.name}
                </h4>
              </div>
              <div className="horizontal">
                <h4 className={classes.cardTitleContent}>
                  Node:&nbsp;
            </h4>
                <h4 className={classes.cardTitle}>
                  {asset.nodeName}
                </h4>
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
                    id="outlined-multiline"
                    label="Engraving"
                    multiline
                    rows={2}
                    defaultValue={asset.nonMutableStorage.engraving}
                    variant="outlined"
                    fullWidth
                    disabled
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
                      swal("Asset ID Copied to Clipboard!");
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
