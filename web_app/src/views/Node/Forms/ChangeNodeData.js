import React from "react";
import "../../../assets/css/custom.css";
import swal from 'sweetalert';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import TextField from "@material-ui/core/TextField";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { GroupAdd } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function ChangeNodeData(props) {
  //ipfs: {idHashFields: [["Artist", "text"], ["Series", "text"], ["Piece x", "number"], ["Out of y", "number"]], ownerHashFields: [["Name", "text"], ["Password", "text"]], landingConfig: { url: "https://pruf.io", DBref: "ipfs.io" }, nodeAssets: { photo: {}, text: {} }}
  //if(!window.sentPacket) { window.location.href = "/#/user/node-manager"; window.location.reload();}

  const [transactionActive, setTransactionActive] = React.useState(false);

  const [ipfsActive, setIpfsActive] = React.useState(false);

  const defaultIpfs = {idHashFields: [], ownerHashFields: [], landingConfig: { url: "", DBref: "" }, nodeAssets: { photo: {}, text: {} }}


  const [ipfs, setIpfs] = React.useState( {
    idHashFields: [["Field 1", "field 1 placeholder"], ["Field 2", "field 2 placeholder"], ["Field 3", "field 3 placeholder"], ["Field 4", "field 4 placeholder"]], ownerHashFields: [], landingConfig: { url: "", DBref: "" }, nodeAssets: { photo: {}, text: {} }
  })
  const [newIpfs, setNewIpfs] = React.useState( {
    idHashFields: [["Field 1", "field 1 placeholder"], ["Field 2", "field 2 placeholder"], ["Field 3", "field 3 placeholder"], ["Field 4", "field 4 placeholder"]], ownerHashFields: [], landingConfig: { url: "", DBref: "" }, nodeAssets: { photo: {}, text: {} }
  });

  const [nodeInfo,] = React.useState(JSON.parse(JSON.stringify(window.sentPacket)))

  const link = document.createElement('div')
  document.body.style.cursor='default';

  //window.sentPacket = null

  const classes = useStyles();

  React.useEffect(() => {
    //if(window.sentPacket === undefined && nodeInfo === undefined) window.location.href = "/#/user/node-manager"; window.location.reload();
    if (props.ps) {
      props.ps.element.scrollTop = 0;
      //console.log("Scrolled to ", props.ps.element.scrollTop)
    }
    else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
    if (nodeInfo === undefined || nodeInfo === null) {
      console.log("No node found. Rerouting...")
      window.location.href = "/#/user/node-manager"
      window.location.reload()
    }

/*     if(window.sentPacket.id){
      let id = window.sentPacket.id;
      window.sentPacket = null;
      window.contracts.AC_MGR.methods
        .getExtAC_data_nostruct(id)
        .call((_error, _result) => {
          if (_error) { console.log("Error: ", _error) }
          else {
            window.utils.getIpfsHashFromBytes32(Object.values(_result)[4]).then(async (e)=>{
              for await (const chunk of window.ipfs.cat(e)) {
                let str = new TextDecoder("utf-8").decode(chunk);

                if(!str){
                  setIpfs(defaultIpfs)
                  return setNewIpfs(defaultIpfs)
                }
                try {
                  let obj = JSON.parse(str)
                  setIpfs(obj)
                  setNewIpfs(obj)
                }
                catch{
                  setIpfs(defaultIpfs)
                  return setNewIpfs(defaultIpfs)
                }
              }
            }) 
          }
        });

    } */

  }, [])

  const goBack = () => {
    window.backIndex = nodeInfo.dBIndex;
    window.location.href = nodeInfo.lastRef;
  }

  const undoAll = () => {
    setNewIpfs(JSON.parse(JSON.stringify(ipfs)));
  }

  const uploadConfig = (obj) => {
    if(!obj) return

    let payload;
    try {payload = JSON.stringify(obj)}
    catch {
      return swal({
      title: "Cannot stringify data from JSON",
      content: link,
      icon: "warning",
      button: "Close",
    });}

    setIpfsActive(true)
    window.ipfs.add(payload).then((hash)=>{
      if (!hash) {
        console.error("error sending to ipfs")
        return setIpfsActive(false);
      }
      else{
        let url = `https://ipfs.io/ipfs/${hash.cid}`
        console.log(`Url --> ${url}`)
        let b32Hash = window.utils.getBytes32FromIPFSHash(String(hash.cid))
        setIpfsActive(false);
        updateConfigData(b32Hash);
      } 
    })
  }

  const handleIdInput = (job, index, val) => {
    let temp = JSON.parse(JSON.stringify(newIpfs))
    let element = temp.idHashFields[index]
    element.splice(job, 1, val.trim());
    temp.idHashFields.splice(index, 1, element);
    setNewIpfs(temp)
  }

  const handleOwnerInput = (job, index, val) => {
    let temp = JSON.parse(JSON.stringify(newIpfs))
    let element = JSON.parse(JSON.stringify(temp.ownerHashFields[index]))
    element.splice(job, 1, val.trim());
    temp.ownerHashFields.splice(index, 1, element);
    setNewIpfs(temp)
  }

  const handleLandingConfig = (job, val) => {
    let temp = JSON.parse(JSON.stringify(newIpfs))
    temp.landingConfig[job] = val.trim()
    setNewIpfs(temp)
  }

  const generateNodeWorkspace = (obj) => {
    const idFields = obj.idHashFields;
    const ownerFields = obj.ownerHashFields;
    const landingConfig = obj.landingConfig;

    const generateIdFields = () => {
      let component = [<h3>Token ID Inputs</h3>, <hr></hr>];
      for (let i = 0; i < idFields.length; i++) {
        component.push(
          <>
            <h4>{"Input " + (i + 1)}</h4>
          Title: {"  "}<TextField
              value={idFields[i][0]}
              id={"Ititle" + i}
              onChange={(e) => {
                handleIdInput(0, i, e.target.value)
              }}
            /> placeHolder: {"  "}
            <TextField
              value={idFields[i][1]}
              id={"Itype" + i}
              onChange={(e) => {
                handleIdInput(1, i, e.target.value)
              }}
            /><br />
          Minter Sees: {"  "}
            <CustomInput
              labelText={idFields[i][0]}
              id={"Iexample" + i}              
              inputProps={{
                placeholder: idFields[i][1]
              }}
            />
            <br />
            <hr />
          </>
        );
      }
      return component;
    }

    const generateOwnerFields = () => {
      let component = [<h3>Owner Inputs</h3>, <hr></hr>];
      for (let i = 0; i < ownerFields.length; i++) {
        component.push(
          <>
            <h4>{"Input " + (i + 1)}</h4>
            Title: {"  "}<TextField
              value={ownerFields[i][0]}
              id={"Otitle" + i}
              onChange={(e) => {
                handleOwnerInput(0, i, e.target.value)
              }}
            /> Type: {"  "}
            <TextField
              value={ownerFields[i][1]}
              id={"Otype" + i}
              onChange={(e) => {
                handleOwnerInput(0, i, e.target.value)
              }}
            /><br />
            Minter Sees: {"  "}
            <CustomInput
              labelText={ownerFields[i][0]}
              id={"Oexample" + i}
              placeholder={ownerFields[i][1]}
            />
            <br />
            <hr />
          </>
        );
      }
      return component;
    }

    return (
      <>
        <CardHeader icon>
          <CardIcon className="headerIconBack">
            <GroupAdd />
          </CardIcon>
          <Button color="info" className="MLBGradient" onClick={() => goBack()}>Go Back</Button>
          <h4 className={classes.cardIconTitle}>Configure Node</h4>
        </CardHeader>
        <CardBody>
          <form>
            <h4>Node Selected: {nodeInfo.name}</h4>
            {idFields.length > 0 && (
              <>
                {generateIdFields()}
              </>
            )}
            {/* {ownerFields.length > 0 && (
              <>
                {generateOwnerFields()}
              </>
            )} */}
            {landingConfig && (
              <>
                URL: {"  "} <TextField
                  value={landingConfig.url}
                  id="landingUrl"
                  onChange={ (e) => {
                    handleLandingConfig("url", e.target.value)
                  }}
                />
                Database: {"  "} <TextField
                  value={landingConfig.DBref}
                  id="landingDB"
                  onChange={ (e) => {
                    handleLandingConfig("DBRef", e.target.value)
                  }}
                />
              </>
            )}
            {!transactionActive && !ipfsActive && (
              <div className="MLBGradientSubmit">
                <Button color="info" className="MLBGradient" onClick={() => uploadConfig(newIpfs)}>Submit Configuration</Button>
              </div>
            )}
            {transactionActive && !ipfsActive && (
              <h3>
                Updating Configuration Key<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
              </h3>
            )}
            {ipfsActive && !transactionActive &&(
              <h3>
                Uploading Configuration to IPFS<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
              </h3>
            )}
          </form>
        </CardBody>
      </>)
  }

  const updateConfigData = async (ipfsHash) => { //import held asset

    let tempTxHash;

    setTransactionActive(true);

    await window.contracts.AC_MGR.methods
      .updateACipfs(
        ipfsHash,
        nodeInfo.id,
      )
      .send({ from: props.addr })
      .on("error", function (_error) {
        setTransactionActive(false);
        //setTxStatus(false);
        //setTxHash(Object.values(_error)[0].transactionHash);
        tempTxHash = Object.values(_error)[0].transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        //setError(Object.values(_error)[0]);
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
        //setTxStatus(receipt.status);
        tempTxHash = receipt.transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        //setTxHash(receipt.transactionHash);
        swal({
          title: "Node Configuration Saved!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(() => {
          //window.backIndex = nodeInfo.dBIndex;
          window.location.href = "/#/user/node-manager";
        })
      });

  }

  return (
    <Card>
      {generateNodeWorkspace(newIpfs)}
    </Card>
  );
}
