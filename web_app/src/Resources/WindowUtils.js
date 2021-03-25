import bs58 from "bs58";
import { QRCode } from 'react-qrcode-logo';
import React from 'react';
import "../assets/css/custom.css"

function buildWindowUtils() {

  const _tenThousandHashesOf = (varToHash) => {
    var tempHash = varToHash;
    for (var i = 0; i < 10000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  }

  const _getBytes32FromIPFSHash = (hash) => {
    let str = "0x" + bs58.decode(hash).slice(2).toString("hex");
    return str;
  };

  const _getIpfsHashFromBytes32 = async (bytes32Hex) => {
    const hashHex = "1220" + bytes32Hex.slice(2);
    const hashBytes = Buffer.from(hashHex, "hex");
    const hashStr = bs58.encode(hashBytes);
    return hashStr;
  };

  const _convertTimeTo = (rawTime, to) => {
    var time;
    if (to === "seconds") { time = rawTime }
    else if (to === "minutes") { time = rawTime * 60 }
    else if (to === "hours") { time = rawTime * 3600 }
    else if (to === "days") { time = rawTime * 86400 }
    else if (to === "weeks") { time = rawTime * 604800 }
    else { alert("Invalid time unit") }
    return (time);
  }

  const _getETHBalance = async (addr) => {
    if (addr === undefined) { return 0 }
    await window.web3.eth.getBalance(addr, (err, balance) => {
      if (err) { } else {
        window.ETHBalance = window.web3.utils.fromWei(balance, "ether")
        //console.log("UTILS: Wallet balance: ", window.ETHBalance)
      }
    });
  }

  const _checkAssetExistsBare = async (idxHash) => {
    let tempBool;
    // console.log(idxHash.substring(0, 2))
    if (idxHash.substring(0, 2) !== "0x") {
      return (false)
    }
    await window.contracts.STOR.methods
      .retrieveShortRecord(idxHash)
      .call(function (_error, _result) {
        if (_error) {
          return (console.log("IN ERROR IN ERROR IN ERROR"))
        } else if (
          Object.values(_result)[2] === "0"
        ) {
          tempBool = false;
        } else {
          tempBool = true;
        }

      });
    console.log(tempBool);
    return tempBool;
  }

  const _getStatusString = async (_status) => {
    let tempStat;
    let statusId = String(_status)

    console.log(statusId)
    switch(statusId) {
      case("0") : tempStat = "No Status Set"; break        
      case("1") : tempStat = "Transferable"; break
      case("2") : tempStat = "Non-Transferable"; break
      case("3") : tempStat = "MARKED STOLEN"; break
      case("4") : tempStat = "MARKED LOST"; break
      case("5") : tempStat = "Transferred (Unclaimed)"; break
      case("6") : tempStat = "In Supervised Escrow"; break
      case("7") : tempStat = "Out of Supervised Escrow"; break
      case("50") : tempStat = "In Locked Escrow"; break
      case("51") : tempStat = "Transferable"; break
      case("52") : tempStat = "Non-Transferable"; break
      case("53") : tempStat = "MARKED STOLEN"; break
      case("54") : tempStat = "MARKED LOST"; break
      case("55") : tempStat = "Transferred (Unclaimed)"; break
      case("56") : tempStat = "In Supervised Escrow"; break
      case("57") : tempStat = "Out of Escrow"; break
      case("58") : tempStat = "Out of Escrow"; break
      case("59") : tempStat = "Ready for Discard"; break
      case("60") : tempStat = "Ready to Recycle"; break
      case("70") : tempStat = "Ready for Import"; break
      default : console.error('PRUF_ERR: Status id "', statusId, '"not recognized.'); break
  }

    return (tempStat)
  }

  const _checkHoldsToken = async (req, id, addr) => {
    let tempBool;
    if (!addr) return false
    if (req === "asset") {
      await window.contracts.A_TKN.methods
        .ownerOf(id)
        .call(function (_error, _result) {
          if (_error) {
            console.log(_error);
          } else {
            console.log("res", _result, "prop", addr);
            if (window.web3.utils.toChecksumAddress(_result) === window.web3.utils.toChecksumAddress(addr)) {
              tempBool = true
            }
            else { tempBool = false }
          }
          console.log("checked in A_TKN");
        });
    }
    else if (req === "AC") {
      await window.contracts.AC_TKN.methods
        .ownerOf(id)
        .call(function (_error, _result) {
          if (_error) {
            console.log(_error);
          } else {
            console.log(_result, addr);
            if (window.web3.utils.toChecksumAddress(_result) === window.web3.utils.toChecksumAddress(addr)) {
              tempBool = true
            }
            else { tempBool = false }

          }
          console.log("checked in AC_TKN");
        });
    }

    return tempBool;
  }

  const _checkNoteExists = async (idxHash) => {
    let tempBool;
    await window.contracts.STOR.methods
      .retrieveShortRecord(idxHash)
      .call(function (_error, _result) {
        if (_error) {
          return (console.log("IN ERROR IN ERROR IN ERROR"))
        } else if (
          Object.values(_result)[8] > 0
        ) {
          tempBool = true
        } else {
          tempBool = false
        }

      });

    return tempBool;
  }

  const _getACNames = async (assetClasses) => {

    if (window.contracts !== undefined) {
      let tempArr = [];

      for (let i = 0; i < assetClasses.length; i++) {
        await window.contracts.AC_MGR.methods
          .getAC_name(assetClasses[i])
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              //console.log("resolved AC name ", _result, " from AC index ", assetClasses[i]);
              tempArr.push(_result)
            }
          });
      }

      return tempArr;
    }


  }

  const _getACName = async (AC) => {
    let temp;
    if (window.contracts !== undefined) {
      await window.contracts.AC_MGR.methods
        .getAC_name(AC)
        .call((_error, _result) => {
          if (_error) { console.log("Error: ", _error) }
          else {
            temp = _result
            console.log("resolved AC name ", temp, " from AC index ", AC);
          }
        });
      return temp
    }
    else {
      return "Unable to resolve AC name"
    }
  }

  const _resolveACFromID = async (AC, addr) => {
    let temp;
    if (window.contracts !== undefined) {
      await window.contracts.AC_MGR.methods
        .getAC_name(AC)
        .call((_error, _result) => {
          if (_error) { console.log("Error: ", _error) }
          else {
            temp = _result
            //console.log("resolved AC name ", temp, " from AC index ", AC);

          }
        });
    }

    if (addr !== undefined) {
      let acData = await window.utils.getACData("id", AC)
      await window.utils.checkCreds(acData, AC);
      await window.utils.getCosts(6, AC);
    }

    //await console.log("User authLevel: ", window.authLevel);
    window.assetClassName = temp; //DEV REMOVE ALL window. REFS
    return (temp)

  }

  const _checkCreds = async (acData, AC, addr) => {
    window.isAuthUser = undefined;
    let custodyType = acData.custodyType

    if (window.contracts !== undefined) {


      await window.contracts.AC_TKN.methods
        .ownerOf(AC)
        .call((_error, _result) => {
          if (_error) { console.log("Error: ", _error) }
          else {
            if (window.web3.utils.toChecksumAddress(_result) === window.web3.utils.toChecksumAddress(addr)) {
              window.isACAdmin = true;
            }
            else {
              window.isACAdmin = false;
            }
          }
        });

      if (custodyType === "Custodial") {
        let addrHash = await window.web3.utils.soliditySha3(window.web3.utils.toChecksumAddress(addr))
        await window.contracts.AC_MGR.methods
          .getUserType(addrHash, AC)
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              if (_result === "0" && window.isACAdmin === false) { window.authLevel = "Standard User"; window.isAuthUser = false; }
              else if (_result === "1" && window.isACAdmin === false) { window.authLevel = "Authorized User"; window.isAuthUser = true; }
              else if (_result === "9" && window.isACAdmin === false) { window.authLevel = "Robot"; window.isAuthUser = false; }
              else if (_result === "1" && window.isACAdmin === true) { window.authLevel = "Authorized User/AC Admin"; window.isAuthUser = true; }
              else if (_result === "9" && window.isACAdmin === true) { window.authLevel = "Robot/AC Admin"; window.isAuthUser = false; }
              else if (_result === "0" && window.isACAdmin === true) { window.authLevel = "AC Admin"; window.isAuthUser = false; }
              console.log(_result)
              return (window.custodyType = "Custodial")
            }
          });
      }

      else if (custodyType === "Non-Custodial") {
        await window.contracts.ID_TKN.methods
          .balanceOf(addr)
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              if (Number(_result) === 1 && window.isACAdmin === false) { window.authLevel = "Pruf Minter"; window.isAuthUser = false; }
              else if (Number(_result) !== 1 && window.isACAdmin === true) { window.authLevel = "Pruf User/AC Admin"; window.isAuthUser = false; }
              else if (Number(_result) === 1 && window.isACAdmin === true) { window.authLevel = "Pruf Minter/AC Admin"; window.isAuthUser = false; }
              else if (Number(_result) !== 1 && window.isACAdmin === false) { window.authLevel = "Pruf User"; window.isAuthUser = false; }
              console.log(_result)
              return (window.custodyType = "Non-Custodial")
            }
          });
      }



    }

    else {
      console.log("window.contracts object is undefined.")
    }
  }

  const _checkForAC = async (ref, ac) => {
    let tempBool;
    if (window.contracts !== undefined) {
      if (ref === "id") {
        console.log("Using id ref")
        await window.contracts.AC_MGR.methods
          .getAC_name(ac)
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              if (_result !== "") { tempBool = true }
              else { tempBool = false }
            }
          });
      }

      else if (ref === "name") {
        console.log("Using name ref")
        await window.contracts.AC_MGR.methods
          .resolveAssetClass(ac)
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              if (Number(_result) > 0) { tempBool = true }
              else { tempBool = false }
            }
          });
      }

      return tempBool;
    }

  }

  const _checkACName = async (name) => {
    let tempBool;
    if (window.contracts !== undefined) {
      await window.contracts.AC_MGR.methods
        .resolveAssetClass(name)
        .call((_error, _result) => {
          if (_error) { console.log(_error) }
          else {
            console.log("resolved successfully to AC: ", _result)
            if (Number(_result) > 0) { tempBool = true }
            else { tempBool = false }
          }
        });
    }
    return tempBool;
  }

  const _getEscrowData = async (idxHash) => {
    let tempArray = [];

    if (window.contracts !== undefined) {
      await window.contracts.ECR_MGR.methods
        .retrieveEscrowData(idxHash)
        .call((_error, _result) => {
          if (_error) { console.log(_error) }
          else {
            console.log("Got escrow data: ", _result)
            tempArray = Object.values(_result)
            console.log("tempArray: ", tempArray)
          }
        });
      return tempArray;
    }
  }

  const _getACData = async (ref, ac) => {
    let tempData;
    let tempAC;

    if (window.contracts !== undefined) {

      if (ref === "name") {
        console.log("Using name ref")
        await window.contracts.AC_MGR.methods
          .resolveAssetClass(ac)
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              //console.log(_result)
              if (Number(_result) > 0) { tempAC = Number(_result) }
              else { return 0 }
            }
          });

      }

      else if (ref === "id") { tempAC = ac; }

      await window.contracts.AC_MGR.methods
        .getAC_data(tempAC)
        .call((_error, _result) => {
          if (_error) { console.log("Error: ", _error) }
          else {
            let _custodyType;

            if (Object.values(_result)[1] === "1") {
              _custodyType = "Custodial"
            }

            else {
              _custodyType = "Non-Custodial"
            }

            tempData = {
              root: Object.values(_result)[0],
              custodyType: _custodyType,
              discount: Object.values(_result)[2],
              exData: Object.values(_result)[3],
              AC: tempAC
            }
          }
        });
      window.tempACData = tempData;
      return tempData;
    }

  }

  const _getCosts = async (numOfServices, AC) => {
    window.costArray = [];
    if (window.contracts !== undefined) {
      //console.log("Getting cost array");

      for (var i = 1; i <= numOfServices; i++) {
        await window.contracts.AC_MGR.methods
          .getServiceCosts(AC, i)
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              let root = window.web3.utils.fromWei(Object.values(_result)[1]);
              let acth = window.web3.utils.fromWei(Object.values(_result)[3]);
              window.costArray.push(window.web3.utils.toWei(String(Number(root) + Number(acth))));
            }
          })
      }

      //console.log("before setting window-level costs")

      window.costs = {
        newAsset: window.costArray[0],
        transferAsset: window.costArray[1],
        createNote: window.costArray[2],
        remintAsset: window.costArray[3],
        changeAsset: window.costArray[4],
        forceTransfer: window.costArray[5],
      }

      //window.utils.checkCreds()

      //console.log("window costs object: ", window.costs);
      return window.costs
      //console.log("this should come last");
    }
    else {
      console.log("Window.contracts object is undefined.")
    }
  }

  const _retreiveCosts = async (numOfServices, AC) => {
    let costs = {}, costArray = [];
    if (window.contracts === undefined) return
      //console.log("Getting cost array");

      for (var i = 1; i <= numOfServices; i++) {
        await window.contracts.AC_MGR.methods
          .getServiceCosts(AC, i)
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              let root = window.web3.utils.fromWei(Object.values(_result)[1]);
              let acth = window.web3.utils.fromWei(Object.values(_result)[3]);
              let rootAddress = Object.values(_result)[0]
              let BeneficiaryAddress = Object.values(_result)[2]
              costArray.push(window.web3.utils.toWei(String(Number(root) + Number(acth))));
              costs["cost"+i] = {rootCost: window.web3.utils.toWei(root), acthCost: window.web3.utils.toWei(acth), totalCost: window.web3.utils.toWei(String(Number(root) + Number(acth))), rootAddress, BeneficiaryAddress}
            }
          })
      }
      return costs
  }

  const _getACFromIdx = async (idxHash) => {
    await window.contracts.STOR.methods
      .retrieveShortRecord(idxHash)
      .call(function (_error, _result) {
        if (_error) {
          return (console.log("IN ERROR IN ERROR IN ERROR"))
        } else {
          window.assetClass = Object.values(_result)[2];
          console.log("Now operating in AC: ", window.assetClass)
        }
      });

    await window.utils.getCosts(6, window.assetClass)

  }

  const _determineTokenBalance = async (addr) => {

    if (window.contracts !== undefined && addr !== undefined) {
      let _assetClassBal, _assetBal, _IDTokenBal, _prufTokenBal;
      //console.log("getting balance info from token contracts...")
      await window.contracts.A_TKN.methods.balanceOf(addr).call((error, result) => {
        if (error) { console.log(error) }
        else { _assetBal = result; /* console.log("assetBal: ", _assetBal); */ }
      });

      await window.contracts.AC_TKN.methods.balanceOf(addr).call((error, result) => {
        if (error) { console.log(error) }
        else { _assetClassBal = result; /* console.log("assetClassBal", _assetClassBal); */ }
      });

      await window.contracts.ID_TKN.methods.balanceOf(addr).call((error, result) => {
        if (error) { console.log(error) }
        else { _IDTokenBal = result; /* console.log("IDTokenBal", _IDTokenBal); */ }
      });

      await window.contracts.UTIL_TKN.methods.balanceOf(addr).call((error, result) => {
        if (error) { console.log(error) }
        else { _prufTokenBal = window.web3.utils.fromWei(result, 'ether'); /* console.log("prufTokenBal", _prufTokenBal); */ }
      });

      if (Number(_assetBal) > 0) {
        window.assetHolderBool = true
      }

      else if (Number(_assetBal) === 0 || _assetBal === undefined) {
        window.assetHolderBool = false
      }

      if (Number(_assetClassBal) > 0) {
        window.assetClassHolderBool = true
      }

      else if (Number(_assetClassBal) === 0 || _assetClassBal === undefined) {
        window.assetClassHolderBool = false
      }

      if (Number(_IDTokenBal) > 0 && Number(_IDTokenBal) < 2) {
        window.IDHolderBool = true
      }

      else if (Number(_IDTokenBal) === 0 || _IDTokenBal === undefined || _IDTokenBal > 1) {
        window.IDHolderBool = false
      }
      window.balances = {
        prufTokenBalance: _prufTokenBal,
        assetClassBalance: _assetClassBal,
        assetBalance: _assetBal,
        IDTokenBalance: _IDTokenBal
      }

      return window.balances
    }
  }

  const _getAssetClassTokenInfo = async (addr) => {
    if (window.balances === undefined) { return 0 }
    let tknIDArray = [], roots = [], discounts = [], custodyTypes = [], exData = [], names = [];
    //console.log("GACTI: In _getAssetClassTokenInfo")

    if (Number(window.balances.assetClassBalance) > 0) {

      for (let i = 0; i < window.balances.assetClassBalance; i++) {
        await window.contracts.AC_TKN.methods.tokenOfOwnerByIndex(addr, i)
          .call((_error, _result) => {
            if (_error) {
              return (console.log("IN ERROR IN ERROR IN ERROR"))
            } else {
              let resStr;
              resStr = _result;
              tknIDArray.push(resStr)
            }
          });
      }

      //console.log("AC IDs: ", tknIDArray);

      for (let i = 0; i < tknIDArray.length; i++) {
        await window.contracts.AC_MGR.methods
          .getAC_data(tknIDArray[i])
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              let _custodyType;

              if (Object.values(_result)[1] === "1") {
                _custodyType = "Custodial"
              }

              else {
                _custodyType = "Non-Custodial"
              }

              roots.push(Object.values(_result)[0])
              custodyTypes.push(_custodyType)
              discounts.push(Object.values(_result)[2])
              exData.push(Object.values(_result)[3])

            }
          });

        await window.contracts.AC_MGR.methods
          .prufPerShare()
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              window.AC_CostOfShares = _result;
            }
          });

        await window.contracts.AC_MGR.methods
          .upperLimit()
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              window.AC_UpperLimit = _result;
            }
          });

        await window.contracts.AC_MGR.methods
          .getAC_name(tknIDArray[i])
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              //console.log("resolved AC name ", _result, " from AC index ", tknIDArray[i]);
              names.push(_result)
            }
          });
      }
    }

    else { console.log("No asset classes held by user"); window.assetClasses = { names: [], exData: [], discounts: [], custodyTypes: [], roots: [], ids: [], identicons: [], identiconsLG: [] }; return window.hasNoAssetClasses = true }

    return { names, custodyTypes, exData, roots, discounts, ids: tknIDArray }
  }

  const _getAssetTokenInfo = async (addr, pruf) => {
    let obj = {};

    if (window.balances === undefined) { return }

    //console.log("GATI: In _getAssetTokenInfo")
    //alert("IN GATI")

    if (Number(window.balances.assetBalance) > 0) {
      let
        tknIDArray = [],
        ipfsHashArray = [],
        noteArray = [],
        statuses = [],
        countPairs = [],
        assetClasses = [],
        statusNums = [],
        prices = [];



      for (let i = 0; i < window.balances.assetBalance; i++) {
        await pruf.get.heldAssetAtIndex(addr, i)
          .call((_error, _result) => {
            if (_error) {
              return (console.log("IN ERROR IN ERROR IN ERROR"))
            } else {
              let resStr;
              resStr = window.web3.utils.numberToHex(_result);
              while (resStr.length < 66) {
                resStr = resStr.substring(0, 2) + "0" + resStr.substring(2, resStr.length)
              }
              tknIDArray.push(resStr)
            }
          });
      }

      for (let x = 0; x < tknIDArray.length; x++) {
        await pruf.get.assetRecord(tknIDArray[x])
          .call((_error, _result) => {
            if (_error) {
              console.log("IN ERROR IN ERROR IN ERROR")
            } else {
              if (Number(Object.values(_result)[5]) > 0) {
                ipfsHashArray.push(window.utils.getIpfsHashFromBytes32(Object.values(_result)[5]))
              }
              else {
                ipfsHashArray.push("0")
              }
              if (Number(Object.values(_result)[6]) > 0) {
                noteArray.push("https://ipfs.io/ipfs/" + String(window.utils.getIpfsHashFromBytes32(Object.values(_result)[6])))
              }
              else {
                noteArray.push("0")
              }

              if (_result[0] === "50") { statuses.push("In Locked Escrow") }
              else if (_result[0] === "51") { statuses.push("Transferable") }
              else if (_result[0] === "52") { statuses.push("Non-Transferable") }
              else if (_result[0] === "53") { statuses.push("MARKED STOLEN") }
              else if (_result[0] === "54") { statuses.push("MARKED LOST") }
              else if (_result[0] === "55") { statuses.push("Transferred/Unclaimed") }
              else if (_result[0] === "56") { statuses.push("In Escrow") }
              else if (_result[0] === "57") { statuses.push("Out of Supervised Escrow") }
              else if (_result[0] === "58") { statuses.push("Out of Escrow") }
              else if (_result[0] === "59") { statuses.push("Discardable") }
              else if (_result[0] === "60") { statuses.push("Recyclable") }
              else if (_result[0] === "70") { statuses.push("Ready for Import") }
              else if (_result[0] === "0") { statuses.push("Status Not Set") }
              statusNums.push(_result[0])
              assetClasses.push(Object.values(_result)[2]);
              countPairs.push([Object.values(_result)[3], Object.values(_result)[4]]);
            }
          })
        await pruf.get.assetPriceData(tknIDArray[x])
          .call((_error, _result) => {
            if (_error) {
              console.log("IN ERROR IN ERROR IN ERROR")
            } else {
              prices.push({ price: Object.values(_result)[0], currency: Object.values(_result)[1] });
            }
          })
        //console.log(x)
      }

      let roots = [];

      obj.ids = tknIDArray;
      obj.ipfs = ipfsHashArray;
      obj.countPairs = countPairs;
      obj.assetClasses = assetClasses;
      obj.statuses = statuses;
      obj.statusNums = statusNums;
      obj.notes = noteArray;
      obj.prices = prices;

      await window.utils.getACNames(assetClasses).then((e) => {
        obj.assetClassNames = e;
      })

      for(let i = 0; i < tknIDArray.length; i++){
        await window.utils.getACData("id", assetClasses[i]).then((e)=>{
          roots.push(e.root);
        })
      }

      obj.roots = roots;

      return obj
    }

    else { console.log("No assets held by user"); return obj }
  }

  const _generateCardPrint = (obj) => {

    var date = Date().toLocaleString();

    return (
      <div className="printForm">
        {obj !== undefined && (
          <>
            <div className="printQR">
              <QRCode
                value={"https://app.pruf.io/#/retrieve-record?" + obj.idxHash}
                size="160"
                fgColor="#002a40"
                // logoWidth="24.4"
                // logoHeight="32"
                // logoImage="https://pruf.io/assets/images/pruf-u-logo-with-border-323x429.png"
                quietZone="2"
                ecLevel="M"
              />
            </div>
            <div className="cardHref">https://app.pruf.io</div>
            <div className="cardDate">{date}</div>
            <div className="printFormContent">
              {/* <img
                className="printImageBackgroundForm"
                src={require("../Resources/Images/PrufPrintBackground.png")}
                alt="Pruf Print Background" /> */}
              <div className="printQR2">
                <QRCode
                  value={"https://app.pruf.io/#/retrieve-record?" + obj.idxHash}
                  size="120"
                  fgColor="#002a40"
                  quietZone="2"
                  ecLevel="L"
                />
              </div>
              <p className="cardNamePrint">Name : {obj.name}</p>
              <p className="cardAcPrint">Asset Class : {obj.assetClassName}</p>
              <h4 className="cardIdxPrint">Asset ID : {obj.idxHash}</h4>

            </div>
          </>
        )}
      </div >
    )
  }

  window.utils = {

    checkCreds: _checkCreds,
    getCosts: _getCosts,
    retreiveCosts: _retreiveCosts,
    determineTokenBalance: _determineTokenBalance,
    getACData: _getACData,
    getACName: _getACName,
    checkACName: _checkACName,
    checkAssetExistsBare: _checkAssetExistsBare,
    getStatusString: _getStatusString,
    checkNoteExists: _checkNoteExists,
    tenThousandHashesOf: _tenThousandHashesOf,
    convertTimeTo: _convertTimeTo,
    resolveACFromID: _resolveACFromID,
    checkForAC: _checkForAC,
    getAssetClassTokenInfo: _getAssetClassTokenInfo,
    getEscrowData: _getEscrowData,
    getBytes32FromIPFSHash: _getBytes32FromIPFSHash,
    getIpfsHashFromBytes32: _getIpfsHashFromBytes32,
    getAssetTokenInfo: _getAssetTokenInfo,
    checkHoldsToken: _checkHoldsToken,
    getACNames: _getACNames,
    getACFromIdx: _getACFromIdx,
    getETHBalance: _getETHBalance,
    generateCardPrint: _generateCardPrint,

  }

  return
}

export default buildWindowUtils

