import returnABIs from "./returnABIs";

async function buildContracts(_web3) {

  const abis = returnABIs();

  const ID_TKN_ABI = abis.ID_TKN;
  const STOR_ABI = abis.STOR;
  const NP_ABI = abis.NP;
  const APP_ABI = abis.APP;
  const AC_MGR_ABI = abis.AC_MGR;
  const ECR_ABI = abis.ECR;
  const VERIFY_ABI = abis.VERIFY;
  const ECR_MGR_ABI = abis.ECR_MGR;
  const ECR_NC_ABI = abis.ECR_NC;
  const A_TKN_ABI = abis.A_TKN;
  const AC_TKN_ABI = abis.AC_TKN;
  const APP_NC_ABI = abis.APP_NC;
  const NP_NC_ABI = abis.NP_NC;
  const PIP_ABI = abis.PIP;
  const RCLR_ABI = abis.RCLR;
  const UTIL_TKN_ABI = abis.UTIL_TKN;
  const PARTY_ABI = abis.PARTY

  const STOR_Address = "0xaEfc4a04E1B40Ef85bDCDeA715Ec5a7d2745226A";
  const PARTY_Address = "0xA837a86dB071c8531AFf1D301C8Fd0f30c2c1E9A";

  const STOR = new _web3.eth.Contract(STOR_ABI, STOR_Address);
  const PARTY = new _web3.eth.Contract(PARTY_ABI, PARTY_Address);

  let APP = null;
  let NP = null;
  let AC_MGR = null;
  let AC_TKN = null;
  let A_TKN = null;
  let ECR_MGR = null;
  let ECR = null;
  let VERIFY = null;
  let ECR_NC = null;
  let APP_NC = null;
  let NP_NC = null;
  let RCLR = null;
  let PIP = null;
  let ID_TKN = null;
  let UTIL_TKN = null;

  await STOR.methods
    .resolveContractAddress("NP")
    .call(function (_error, _result) {
      if (_error) {
        console.log(_error);
      } else {
        //console.log(_result);
        NP = new _web3.eth.Contract(NP_ABI, _result);
      }
    }
    ).then(async () => {
      await STOR.methods
        .resolveContractAddress("NP_NC")
        .call(function (_error, _result) {
          if (_error) {
            console.log(_error);
          } else {
            //console.log(_result);
            NP_NC = new _web3.eth.Contract(NP_NC_ABI, _result);
          }
        }
        );
    });

  await STOR.methods
    .resolveContractAddress("APP")
    .call(function (_error, _result) {
      if (_error) {
        console.log(_error);
      } else {
        //console.log(_result);
        APP = new _web3.eth.Contract(APP_ABI, _result);
      }
    }
    );

  await STOR.methods
    .resolveContractAddress("APP_NC")
    .call(function (_error, _result) {
      if (_error) {
        console.log(_error);
      } else {
        //console.log(_result);
        APP_NC = new _web3.eth.Contract(APP_NC_ABI, _result);
      }
    }
    );

  await STOR.methods
    .resolveContractAddress("AC_MGR")
    .call(function (_error, _result) {
      if (_error) {
        console.log(_error);
      } else {
        //console.log(_result)
        AC_MGR = new _web3.eth.Contract(AC_MGR_ABI, _result);
      }
    }
    );

  await STOR.methods
    .resolveContractAddress("AC_TKN")
    .call(function (_error, _result) {
      if (_error) {
        console.log(_error);
      } else {
        //console.log(_result);
        AC_TKN = new _web3.eth.Contract(AC_TKN_ABI, _result);
      }
    }
    );

  await STOR.methods
    .resolveContractAddress("ECR")
    .call(function (_error, _result) {
      if (_error) {
        console.log(_error);
      } else {
        //console.log(_result);
        ECR = new _web3.eth.Contract(ECR_ABI, _result);
      }
    }
    );

  await STOR.methods
    .resolveContractAddress("ECR_NC")
    .call(function (_error, _result) {
      if (_error) {
        console.log(_error);
      } else {
        //console.log(_result);
        ECR_NC = new _web3.eth.Contract(ECR_NC_ABI, _result);
      }
    }
    );

  await STOR.methods
    .resolveContractAddress("ECR_MGR")
    .call(function (_error, _result) {
      if (_error) {
        console.log(_error);
      } else {
        //console.log(_result);
        ECR_MGR = new _web3.eth.Contract(ECR_MGR_ABI, _result);
      }
    }
    );

  await STOR.methods
    .resolveContractAddress("A_TKN")
    .call(function (_error, _result) {
      if (_error) {
        console.log(_error);
      } else {
        //console.log(_result);
        A_TKN = new _web3.eth.Contract(A_TKN_ABI, _result);
      }
    }
    );

  await STOR.methods
    .resolveContractAddress("RCLR")
    .call(function (_error, _result) {
      if (_error) {
        console.log(_error);
      } else {
        //console.log(_result);
        RCLR = new _web3.eth.Contract(RCLR_ABI, _result);
      }
    }
    );

  await STOR.methods
    .resolveContractAddress("ID_TKN")
    .call(function (_error, _result) {
      if (_error) {
        console.log(_error);
      } else {
        //console.log(_result);
        ID_TKN = new _web3.eth.Contract(ID_TKN_ABI, _result);
      }
    }
    );

  await STOR.methods
    .resolveContractAddress("UTIL_TKN")
    .call(function (_error, _result) {
      if (_error) {
        console.log(_error);
      } else {
        //console.log(_result);
        UTIL_TKN = new _web3.eth.Contract(UTIL_TKN_ABI, _result);
      }
    }
    );

  await STOR.methods
    .resolveContractAddress("PIP")
    .call(function (_error, _result) {
      if (_error) {
        console.log(_error);
      } else {
        //console.log(_result);
        PIP = new _web3.eth.Contract(PIP_ABI, _result);
      }
    }
    );

  await STOR.methods
    .resolveContractAddress("VERIFY")
    .call(function (_error, _result) {
      if (_error) {
        console.log(_error);
      } else {
        //console.log(_result);
        VERIFY = new _web3.eth.Contract(VERIFY_ABI, _result);
      }
    }
    );

  return window.contracts = {
    STOR: STOR,
    APP: APP,
    NP: NP,
    AC_MGR: AC_MGR,
    AC_TKN: AC_TKN,
    A_TKN: A_TKN,
    ECR_MGR: ECR_MGR,
    ECR: ECR,
    VERIFY: VERIFY,
    ECR_NC: ECR_NC,
    APP_NC: APP_NC,
    NP_NC: NP_NC,
    RCLR: RCLR,
    PIP: PIP,
    ID_TKN: ID_TKN,
    UTIL_TKN: UTIL_TKN,
    PARTY: PARTY
  }
}

export default buildContracts;
