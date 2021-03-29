async function assembleInterface(contracts) {
    
    const interfaceFunctions = {
        calls: [
            ["getTokenRecord", contracts.STOR.methods.retrieveShortRecord],

        ],
    
        txns: [
            ["verifyRightsHolder", contracts.STOR.methods.blockchainVerifyRightsHolder],
            ["transferToken", window.contracts.A_TKN.methods.safeTransferFrom]
        ],
    
        utils: [
            ["isValidId", async (id) => {
                try {
                    if (!id) throw "TokenID is undefined"
                    else if (typeof id !== "string") throw "tokenID must be a string"
                    else if (id.toLowerCase().substring(0, 2) !== "0x") throw "tokenID must begin with '0x'"
                    else if (id.length !== 66) throw "tokenID must be 66 characters long"
        
                    else {
                        return true;
                    }
        
                }
        
                catch (err) {
                    console.error("PRUF_ERR:", err)
                    return false
                }
        
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
