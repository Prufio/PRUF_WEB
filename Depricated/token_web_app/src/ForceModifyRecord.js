import React, { useState } from "react";
import Web3Listener from "./Web3Listener";

function ForceModifyRecord() {
  let web3 = Web3Listener("web3");
  web3.eth.getAccounts().then((e) => setAddr(e[0]));
  let frontend = Web3Listener("frontend");

  var [txHash, setTxHash] = useState("");

  var [type, setType] = useState("");
  var [manufacturer, setManufacturer] = useState("");
  var [model, setModel] = useState("");
  var [serial, setSerial] = useState("");
  var [addr, setAddr] = useState("");

  var [newFirst, setNewFirst] = useState("");
  var [newMiddle, setNewMiddle] = useState("");
  var [newSurname, setNewSurname] = useState("");
  var [newId, setNewID] = useState("");
  var [newSecret, setNewSecret] = useState("");
  
  const _forceModifyRecord = () => {
    var idxHash = web3.utils.soliditySha3(type, manufacturer, model, serial);
   
    var newRgtRaw = web3.utils.soliditySha3(newFirst, newMiddle, newSurname, newId, newSecret);

    var newRgtHash = web3.utils.soliditySha3(idxHash, newRgtRaw);

    console.log("idxHash", idxHash);
    console.log("New rgtRaw", newRgtRaw);
    console.log("New rgtHash", newRgtHash);

    frontend.methods
      .$forceModRecord(idxHash, newRgtHash)
      .send({ from: addr, value: web3.utils.toWei("0.01") })
      .on("receipt", (receipt) => {
        setTxHash(receipt.transactionHash);
        //Stuff to do when tx confirms
      });
    console.log(txHash);
  };

  return (
    <div>
      {addr === undefined && (
          <div className="VRresults">
            <h2>WARNING!</h2>
            Injected web3 not connected to form!
          </div>
        )}
     {addr > 0 && (
      <form className="FMRform">
        <h2>Transfer Asset</h2>
        Type:
        <input
          type="text"
          name="type"
          placeholder="Type"
          required
          onChange={(e) => setType(e.target.value)}
        />
        <br></br>
        Manufacturer:
        <input
          type="text"
          name="manufacturer"
          placeholder="Manufacturer"
          required
          onChange={(e) => setManufacturer(e.target.value)}
        />
        <br></br>
        Model:
        <input
          type="text"
          name="model"
          placeholder="Model"
          required
          onChange={(e) => setModel(e.target.value)}
        />
        <br></br>
        Serial:
        <input
          type="text"
          name="serial"
          placeholder="Serial Number"
          required
          onChange={(e) => setSerial(e.target.value)}
        />
        <br></br>
        New First Name:
        <input
          type="text"
          name="first"
          placeholder="New First name"
          required
          onChange={(e) => setNewFirst(e.target.value)}
        />
        <br></br>
        New Middle Name:
        <input
          type="text"
          name="middle"
          placeholder="New Middle name"
          required
          onChange={(e) => setNewMiddle(e.target.value)}
        />
        <br></br>
        New Surname:
        <input
          type="text"
          name="surname"
          placeholder="New Surname"
          required
          onChange={(e) => setNewSurname(e.target.value)}
        />
        <br></br>
        New ID:
        <input
          type="text"
          name="id"
          placeholder="New ID"
          required
          onChange={(e) => setNewID(e.target.value)}
        />
        <br></br>
        New Password:
        <input
          type="text"
          name="secret"
          placeholder="New Password"
          required
          onChange={(e) => setNewSecret(e.target.value)}
        />
        <br></br>
        <input type="button" value="Modify Record" onClick={_forceModifyRecord} />
      </form>)}

      {txHash > 0 && ( //conditional rendering
        <div className="VRresults">
          No Errors Reported
          <br></br>
          <br></br>
          <a
            href={"https://kovan.etherscan.io/tx/" + txHash}
            target="_blank"
            rel="noopener noreferrer"
          >
            KOVAN Etherscan:{txHash}
          </a>
        </div>
      )}
      </div>
  );
}

export default ForceModifyRecord;