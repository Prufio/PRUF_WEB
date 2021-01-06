import React from "react";
import { Route } from "react-router-dom";

import RetrieveRecord from "./AllCustodyTypes/RetrieveRecord";
import VerifyLite from "./AllCustodyTypes/VerifyLite"
import VerifyRightsholder from "./AllCustodyTypes/VerifyRightsholder";

import AddNote from "./Custodial/AddNote";
import DecrementCounter from "./Custodial/DecrementCounter";
import ModifyRightsHolder from "./Custodial/ModifyRightsHolder";
import ModifyDescription from "./Custodial/ModifyDescription";
import ModifyRecordStatus from "./Custodial/ModifyRecordStatus";
import NewRecord from "./Custodial/NewRecord";
import TransferAsset from "./Custodial/TransferAsset";
import EscrowManager from "./Custodial/EscrowManager";
import ExportAsset from "./Custodial/ExportAsset";
import ImportAsset from "./Custodial/ImportAsset";
import LoginToAC from "./Custodial/LoginToAC";

import RetrieveRecordMobile from "./Mobile/RetrieveRecordMobile";
import VerifyLiteMobile from "./Mobile/VerifyLiteMobile";
import DeepVerifyMobile from "./Mobile/DeepVerifyMobile";
import TransferAssetMobile from "./Mobile/TransferAssetMobile";
import ModifyRightsHolderMobile from "./Mobile/ModifyRightsHolderMobile";
import AssetDashboardMobile from "./Mobile/AssetDashboardMobile";
import ModifyStatusMobile from "./Mobile/ModifyStatusMobile";
import DiscardMobile from "./Mobile/DiscardMobile";
import RecycleMobile from "./Mobile/RecycleMobile";
import ModifyDescriptionMobile from "./Mobile/ModifyDescriptionMobile";
import DecrementMobile from "./Mobile/DecrementMobile";
import EscrowMobile from "./Mobile/EscrowMobile";
import ImportMobile from "./Mobile/ImportMobile";
import ExportMobile from "./Mobile/ExportMobile";
import NewRecordMobile from "./Mobile/NewRecordMobile";

import Faucet from "./Resources/Faucet";
import DnvkxiOAFy_vDC from "./Resources/DnvkxiOAFy_vDC"

function Router(routeRequest) {

    if (routeRequest === "basic") {
        return (
            <>
                <Route path="/new-record" component={NewRecord} />
                <Route path="/modify-rightsholder" component={ModifyRightsHolder} />
                <Route path="/import-asset" component={ImportAsset} />
                <Route path="/transfer-asset" component={TransferAsset} />
                <Route path="/modify-record-status" component={ModifyRecordStatus} />
                <Route path="/decrement-counter" component={DecrementCounter} />
                <Route path="/modify-asset-information" component={ModifyDescription} />
                <Route path="/add-note" component={AddNote} />
                <Route path="/export-asset" component={ExportAsset} />
                <Route path="/manage-escrow" component={EscrowManager} />
                <Route path="/verify-lite" component={VerifyLite} />
                <Route path="/verify-rights-holder" component={VerifyRightsholder} />
                <Route path="/retrieve-record" component={RetrieveRecord} />
                <Route path="/DnvkxiOAFy_vDC" component={DnvkxiOAFy_vDC} />
            </>
        )
    }

    else if (routeRequest === "basicMobile") {
        return (
            <>
                <Route path="/transfer-mobile" component={TransferAssetMobile} />
                <Route path="/deep-verify-mobile" component={DeepVerifyMobile} />
                <Route path="/verify-lite-mobile" component={VerifyLiteMobile} />
                <Route path="/retrieve-record-mobile" component={RetrieveRecordMobile} />
                <Route path="/modify-rights-holder-mobile" component={ModifyRightsHolderMobile} />
                <Route path="/asset-dashboard-mobile" component={AssetDashboardMobile} />
                <Route path="/modify-status-mobile" component={ModifyStatusMobile} />
                <Route path="/discard-mobile" component={DiscardMobile} />
                <Route path="/recycle-mobile" component={RecycleMobile} />
                <Route path="/modify-description-mobile" component={ModifyDescriptionMobile} />
                <Route path="/import-mobile" component={ImportMobile} />
                <Route path="/export-mobile" component={ExportMobile} />
                <Route path="/escrow-mobile" component={EscrowMobile} />
                <Route path="/decrement-mobile" component={DecrementMobile} />
                <Route path="/new-record-mobile" component={NewRecordMobile} />
                <Route path="/faucet" component={Faucet} />
                
            </>
        )
    }

    else if (routeRequest === "noAddr") {
        return (
            <>
                <Route path="/verify-lite" component={VerifyLite} />
                <Route path="/retrieve-record" component={RetrieveRecord} />
                <Route path="/verify-lite-mobile" component={VerifyLiteMobile} />
                <Route path="/retrieve-record-mobile" component={RetrieveRecordMobile} />
            </>
        )
    }

}

export default Router;