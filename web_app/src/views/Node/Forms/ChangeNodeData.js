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

  if (!window.sentPacket) { window.sentPacket = {DBindex:1, name:"Boop", id:"71",ipfs:{
    idHashFields: [["Artist","text"],["Series", "text"],["Piece x", "number"], ["Out of y", "number"]], ownerHashFields: [["Name", "text"], ["Password", "text"]], landingConfig: { url: "", DBref: "" }, nodeAssets: { photo: {}, text: {} }
    }}
  }//window.location.href = "/#/user/node-manager"; window.location.reload();}

  const [transactionActive, setTransactionActive] = React.useState(false);

  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");

  const [first, setFirst] = React.useState("");
  const [middle, setMiddle] = React.useState("");
  const [last, setLast] = React.useState("");

  const [ipfs,] = React.useState(JSON.parse(JSON.stringify(window.sentPacket.ipfs)) || {
    idHashFields: [], ownerHashFields: [], landingConfig: { url: "", DBref: "" }, nodeAssets: { photo: {}, text: {} }
  })
  const [newIpfs, setNewIpfs] = React.useState(JSON.parse(JSON.stringify(window.sentPacket.ipfs)) || {
    idHashFields: [], ownerHashFields: [], landingConfig: { url: "", DBref: "" }, nodeAssets: { photo: {}, text: {} }
  });

  const [nodeInfo,] = React.useState(JSON.parse(JSON.stringify(window.sentPacket)))

  const link = document.createElement('div')

  window.sentPacket = null

  const classes = useStyles();

  React.useEffect(() => {

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

  }, [])

  const goBack = () => {
    window.backIndex = nodeInfo.dBIndex;
    window.location.href = nodeInfo.lastRef;
  }

  const uploadConfig = () => {

  }

  const handleIdInput = (job, index, val) => {
    let temp = JSON.parse(JSON.stringify(newIpfs))
    let element = temp.idHashFields[index]
    element.splice(job,1,val);
    temp.idHashFields.splice(index,1,element);
    setNewIpfs(temp)
  }

  const handleOwnerInput = (job, index, val) => {
    let temp = JSON.parse(JSON.stringify(newIpfs))
    let element = JSON.parse(JSON.stringify(temp.ownerHashFields[index]))
    element.splice(job,1,val);
    temp.ownerHashFields.splice(index,1,element);
    setNewIpfs(temp)
  }

  const handleLandingConfig = (job, val) => {
    let temp = JSON.parse(JSON.stringify(newIpfs))
    temp.landingConfig[job] = val
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
          <h4>{"Input "+(i+1)}</h4>
          Title: {"  "}<TextField
            labelText="input title"
            //defualtValue={idFields[i][0]}
            value={idFields[i][0]}
            id={"title" + i}
            onChange ={ (e) => {
              handleIdInput(0, i, e.target.value.trim())
            }}
          /> Type: {"  "}
          <TextField
            labelText="input type"
            //defualtValue={idFields[i][1]}
            value={idFields[i][1]}
            id={"type" + i}
            onChange ={ (e) => {
              handleIdInput(1, i, e.target.value.trim())
            }}
          /><br/>
          Minter Sees: {"  "}
            <CustomInput
              labelText={idFields[i][0]}
              //type={idFields[i][1]}
              id={"example" + i}
              inputProps={{
                type: idFields[i][1]
              }}
            />
            <br/>
            <hr/>
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
          <h4>{"Input "+(i+1)}</h4>
            Title: {"  "}<TextField
              labelText="input title"
              //defualtValue={ownerFields[i][0]}
              value={ownerFields[i][0]}
              id={"title" + i}
              onChange ={ (e) => {
                handleOwnerInput(0, i, e.target.value.trim())
              }}
            /> Type: {"  "}
            <TextField
              labelText="input type"
              //defaultValue={ownerFields[i][1]}
              value={ownerFields[i][1]}
              id={"type" + i}
              onChange ={ (e) => {
                handleOwnerInput(0, i, e.target.value.trim())
              }}
            /><br/>
            Minter Sees: {"  "}
            <CustomInput
              labelText={ownerFields[i][0]}
              id={"example" + i}
              inputProps={{
                type: ownerFields[i][1]
              }}
            />
            <br/>
            <hr/>
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
              {ownerFields.length > 0 && (
                <>
                {generateOwnerFields()}
                </>
              )}
              {landingConfig && (
                <CustomInput
                labelText="landing url"
                defualtValue={JSON.stringify(landingConfig)}
                id="landingUrl"
                inputProps={{
                  onChange: event => {
                    handleLandingConfig("url", event.target.value.trim())
                  },
                }}
              />
              )}
            {!transactionActive && (
              <div className="MLBGradientSubmit">
                <Button color="info" className="MLBGradient" onClick={() => uploadConfig()}>Submit New Owner Information</Button>
              </div>
            )}
            {transactionActive && (
              <h3>
                Changing Owner Information<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
              </h3>
            )}
          </form>
        </CardBody>
        </>)
  }

  const updateConfigData = async () => { //import held asset

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);

    await window.contracts.AC_MGR.methods
      .updateACipfs(
        newIpfs,
        nodeInfo.id,
      )
      .send({ from: props.addr })
      .on("error", function (_error) {
        setTransactionActive(false);
        setTxStatus(false);
        setTxHash(Object.values(_error)[0].transactionHash);
        tempTxHash = Object.values(_error)[0].transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
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
        tempTxHash = receipt.transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        setTxHash(receipt.transactionHash);
        swal({
          title: "Node Configuration Saved!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(() => {
          window.backIndex = nodeInfo.dBIndex;
          window.location.href = nodeInfo.lastRef;
        })
      });

  }

  return (
    <Card>
      {generateNodeWorkspace(newIpfs)}
    </Card>
  );
}
