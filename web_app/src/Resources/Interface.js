import bs58 from "bs58";
async function assembleInterface(contracts) {
    //@dev add decorate functions, custodialApp, verify, wrap
    const interfaceFunctions = {
        calls: [
            ["nodePricing", contracts.AC_MGR.methods.currentACpricingInfo],
            ["nodeData", contracts.AC_MGR.methods.getAC_data],
            ["nodeName", contracts.AC_MGR.methods.getAC_name],
            ["nodeExtendedData", contracts.AC_MGR.methods.getExtAC_data],
            ["nodeExtendedData_NoStruct", contracts.AC_MGR.methods.getExtAC_data_nostruct],
            ["operationCost", contracts.AC_MGR.methods.getServiceCosts],
            ["userType", contracts.AC_MGR.methods.getUserType],
            ["nodeId", contracts.AC_MGR.methods.resolveAssetClass],
            ["isSameRoot", contracts.AC_MGR.methods.isSameRootAC],
            ["escrowData", contracts.ECR_MGR.methods.retrieveEscrowDataHeavy],
            ["escrowOwner", contracts.ECR_MGR.methods.retrieveEscrowOwner],
            ["isRightsHolder", contracts.STOR.methods._verifyRightsHolder],
            ["assetPriceData", contracts.STOR.methods.getPriceData],
            ["assetRecord", contracts.STOR.methods.retrieveShortRecord],
            ["heldAssetAtIndex", contracts.A_TKN.methods.tokenOfOwnerByIndex],
            ["assetAtIndex", contracts.A_TKN.methods.tokenByIndex],
            ["assetExists", contracts.A_TKN.methods.tokenExists],
            ["assetBalance", contracts.A_TKN.methods.balanceOf],
            ["numberOfAssets", contracts.A_TKN.methods.totalSupply],
            ["prufBalance", contracts.UTIL_TKN.methods.balanceOf],
            ["isColdWallet", contracts.UTIL_TKN.methods.isColdWallet],
            ["howMuchPrufExists", contracts.UTIL_TKN.methods.totalSupply],
            ["nodeBalance", contracts.AC_TKN.methods.balanceOf],
            ["nodeExists", contracts.AC_TKN.methods.tokenExists],
            ["heldNodeAtIndex", contracts.AC_TKN.methods.tokenOfOwnerByIndex],
            ["nodeAtIndex", contracts.AC_TKN.methods.tokenByIndex],
            ["numberOfNodes", contracts.AC_TKN.methods.totalSupply],
        ],

        txns: [
            ["verifyRightsHolder", contracts.STOR.methods.blockchainVerifyRightsHolder],
            ["transferAsset", contracts.A_TKN.methods.safeTransferFrom],
            ["setAssetURI", contracts.A_TKN.methods.setURI],
            ["discardAsset", contracts.A_TKN.methods.discard],
            ["transferNode", contracts.AC_TKN.methods.safeTransferFrom],
            ["setOperationCost", contracts.AC_MGR.methods.ACTH_setCosts],
            ["addUser", contracts.AC_MGR.methods.addUser],
            ["redeemNode", contracts.AC_MGR.methods.purchaseACnode],
            ["modifyNodeExtData", contracts.AC_MGR.methods.updateACipfs],
            ["modifyNodeName", contracts.AC_MGR.methods.updateACname],
            ["modifyNodeRefAddr", contracts.AC_MGR.methods.updateACreferenceAddress],
            ["inscribeAsset", contracts.APP_NC.methods.addIpfs2Note],
            ["importAsset", contracts.APP_NC.methods.importAsset],
            ["mintAsset", contracts.APP_NC.methods.newRecordWithDescription],
            ["initEscrow", contracts.ECR_NC.methods.setEscrow],
            ["terminateEscrow", contracts.ECR_NC.methods.endEscrow],
            ["modifyAssetRightHolder", contracts.NP_NC.methods._changeRgt],
            ["decrementAssetCounter", contracts.NP_NC.methods._decCounter],
            ["exportAsset", contracts.NP_NC.methods._exportNC],
            ["modifyAssetSoftData", contracts.NP_NC.methods._modIpfs1],
            ["modifyAssetStatus", contracts.NP_NC.methods._modStatus],
            ["markAssetLostOrStolen", contracts.NP_NC.methods._setLostOrStolen],
            ["redeemPipAsset", contracts.PIP.methods.claimPipAsset],
            ["mintPip", contracts.PIP.methods.mintPipAsset],
            ["unSetForSale", contracts.PURCHASE.methods._clearPrice],
            ["setForSale", contracts.PURCHASE.methods._setPrice],
            ["buyAsset", contracts.PURCHASE.methods.purchaseWithPRUF],
            ["recycle", contracts.RCLR.methods.recycle],
            ["setColdWallet", contracts.UTIL_TKN.methods.setColdWallet],
            ["unSetColdWallet", contracts.UTIL_TKN.methods.unSetColdWallet],
            ["transferPruf", contracts.UTIL_TKN.methods.transferFrom],

            //PARTY -- TEST RELEASE ONLY
            ["setOperationCost", contracts.PARTY.methods.GET_ID],
            ["setOperationCost", contracts.PARTY.methods.BUY_PRUF],
            //
        ],

        utils: [
            ["isValidId", async (id) => {
                try {
                    if (!id) throw "TokenID is undefined"
                    else if (typeof id !== "string") throw "tokenID must be a string"
                    else if (id.toLowerCase().substring(0, 2) !== "0x") throw "tokenID must begin with '0x'"
                    else if (id.length !== 66) throw "tokenID must be 66 characters long"
                    else return true;

                }

                catch (err) {
                    console.error("PRUF_ERR:", err)
                    return false
                }

            }],
            ["ipfsFromB32", async (bytes32Hex) => {
                const hashHex = "1220" + bytes32Hex.slice(2);
                const hashBytes = Buffer.from(hashHex, "hex");
                const hashStr = bs58.encode(hashBytes);
                return hashStr;
            }],
            ["ipfsToB32", async (hash) => {
                let str = "0x" + bs58.decode(hash).slice(2).toString("hex");
                return str;
            }],
            ["stringifyStatus", async (_status) => {
                let tempStat = "Not Recognized";
                let statusId = String(_status)
                
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
              }],
        ]
    }

    let callObj = {}, txObj = {}, utilObj = {};

    const parseFunctions = async (calls, txns, utils) => {

        for (const call of calls) {
            callObj[call[0]] = call[1]
        }

        for (const tx of txns) {
            txObj[tx[0]] = tx[1]
        }

        for (const util of utils) {
            utilObj[util[0]] = util[1]
        }

    }

    if (!contracts) return console.error("PRUF_ERR: Failed to build interface. Provided contract network is unreachable.")

    else {
        const calls = interfaceFunctions.calls
        const txns = interfaceFunctions.txns
        const utils = interfaceFunctions.utils
        try {
            parseFunctions(calls, txns, utils)
        }
        catch {
            console.error("PRUF_ERR: Unable to parse given functions.")
        }
    }

    return { calls: callObj, methods: txObj, utils: utilObj };
}

export default assembleInterface;
