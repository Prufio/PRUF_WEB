import resolveContracts from "./Contracts"
import assembleInterface from "./Interface"

// Class which constructs a full suite of functions that interact with the PRüF network. 

class PRUF {
    constructor(web3Provider) {
        //this.provider = web3Provider;

        if (!web3Provider) throw "Web3 returned undefined. Get web3 before initializing PRUF"
        
        else {
            try {
                web3Provider.eth.net.getNetworkType().then((e) => {
                    if (!e) throw "Unidentified network. Initialization falied"
                    else if (e !== "kovan") throw "Web3 provider must be connected to a kovan test network node"
                    else {
                        try {
                            resolveContracts(web3Provider).then((f) => {
                                if (!f) throw "Contracts returned undefined"
                                else {
                                    try {
                                        assembleInterface(f).then((g) => {
                                            if (!g) throw "Interface returned undefined"
                                            this.get = g.calls
                                            this.utils = g.utils
                                            this.do = g.methods
                                        })
                                    }
                                    catch (err) {
                                        console.error("PRUF_ERR:", err)
                                    }
                                }
                            })
                        }
                        catch (err) {
                            console.error("PRUF_ERR:", err)
                        }
                    }
                })
            }
            catch (err) {
                console.error("PRUF_ERR:", err)
            }
        }

    }
}

export default PRUF