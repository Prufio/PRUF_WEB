import React from "react";
import { Route } from "react-router-dom";

import ClaimPipAsset from "./Pip/ClaimPipAsset";
import MintPipAsset from "./Pip/MintPipAsset";

import SetCosts from "./ACAdmin/SetCosts"
import EnableContract from "./ACAdmin/EnableContract"
import AddUser from "./ACAdmin/AddUser"
import UpdateACName from "./ACAdmin/UpdateACName"
import GetACData from "./ACAdmin/GetACData"
import IncreaseACShare from "./ACAdmin/IncreaseACShare"
import TransferAC from "./ACAdmin/TransferAC"

import RetrieveRecord from "./AllCustodyTypes/RetrieveRecord";
import VerifyLite from "./AllCustodyTypes/VerifyLite"
import VerifyRightsholder from "./AllCustodyTypes/VerifyRightsholder";
import ACDashboard from "./AllCustodyTypes/ACDashboard";

import AddNote from "./Custodial/AddNote";
import DecrementCounter from "./Custodial/DecrementCounter";
import ForceModifyRecord from "./Custodial/ForceModifyRecord";
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

import AddNoteNC from "./NonCustodial/AddNoteNC";
import DecrementCounterNC from "./NonCustodial/DecrementCounterNC";
import EscrowManagerNC from "./NonCustodial/EscrowManagerNC";
import ImportAssetNC from "./NonCustodial/ImportAssetNC";
import ExportAssetNC from "./NonCustodial/ExportAssetNC";
import ModifyRightsHolder from "./NonCustodial/ModifyRightsHolder";
import ModifyDescriptionNC from "./NonCustodial/ModifyDescriptionNC";
import ModifyRecordStatusNC from "./NonCustodial/ModifyRecordStatusNC";
import NewRecordNC from "./NonCustodial/NewRecordNC";
import TransferAssetNC from "./NonCustodial/TransferAssetNC";
import AssetDashboard from "./NonCustodial/AssetDashboard"
import RecycleAssetNC from "./NonCustodial/RecycleAssetNC";
import DiscardAssetNC from "./NonCustodial/DiscardAssetNC";

import Faucet from "./Resources/Faucet";
import DnvkxiOAFy_vDC from "./Resources/DnvkxiOAFy_vDC"

function Router(routeRequest) {
    if (routeRequest === "authUser") {
        return (
            <>
                <Route path="/new-record" component={NewRecord} />
                <Route path="/retrieve-record" component={RetrieveRecord} />
                <Route path="/force-transfer-asset" component={ForceModifyRecord} />
                <Route path="/import-asset" component={ImportAsset} />
                <Route path="/transfer-asset" component={TransferAsset} />
                <Route path="/modify-record-status" component={ModifyRecordStatus} />
                <Route path="/decrement-counter" component={DecrementCounter} />
                <Route path="/modify-asset-information" component={ModifyDescription} />
                <Route path="/add-note" component={AddNote} />
                <Route path="/export-asset" component={ExportAsset} />
                <Route path="/verify-rights-holder" component={VerifyRightsholder} />
                <Route path="/manage-escrow" component={EscrowManager} />
                <Route path="/mint-pip-asset" component={MintPipAsset} />
                <Route path="/claim-pip-asset" component={ClaimPipAsset} />
                <Route path="/login" component={LoginToAC} />
                <Route path="/DnvkxiOAFy_vDC" component={DnvkxiOAFy_vDC} />
            </>
        )
    }

    else if (routeRequest === "NCAdmin") {
        return (
            <>
                <Route path="/new-record-NC" component={NewRecordNC} />
                <Route path="/retrieve-record" component={RetrieveRecord} />
                <Route path="/force-modify-record-NC" component={ModifyRightsHolder} />
                <Route path="/transfer-asset-NC" component={TransferAssetNC} />
                <Route path="/modify-record-status-NC" component={ModifyRecordStatusNC} />
                <Route path="/decrement-counter-NC" component={DecrementCounterNC} />
                <Route path="/modify-asset-information-NC" component={ModifyDescriptionNC} />
                <Route path="/add-note-NC" component={AddNoteNC} />
                <Route path="/import-asset-NC" component={ImportAssetNC} />
                <Route path="/export-asset-NC" component={ExportAssetNC} />
                <Route path="/verify-rights-holder" component={VerifyRightsholder} />
                <Route path="/manage-escrow-NC" component={EscrowManagerNC} />
                <Route path="/mint-pip-asset" component={MintPipAsset} />
                <Route path="/claim-pip-asset" component={ClaimPipAsset} />
                <Route path="/asset-dashboard" component={AssetDashboard} />
                <Route path="/recycle-asset-NC" component={RecycleAssetNC} />
                <Route path="/discard-asset-NC" component={DiscardAssetNC} />
                <Route path="/DnvkxiOAFy_vDC" component={DnvkxiOAFy_vDC} />
            </>)
    }

    else if (routeRequest === "NCUser") {
        return (
            <>
                <Route path="/retrieve-record" component={RetrieveRecord} />
                <Route path="/force-modify-record-NC" component={ModifyRightsHolder} />
                <Route path="/transfer-asset-NC" component={TransferAssetNC} />
                <Route path="/modify-record-status-NC" component={ModifyRecordStatusNC} />
                <Route path="/decrement-counter-NC" component={DecrementCounterNC} />
                <Route path="/modify-asset-information-NC" component={ModifyDescriptionNC} />
                <Route path="/add-note-NC" component={AddNoteNC} />
                <Route path="/import-asset-NC" component={ImportAssetNC} />
                <Route path="/export-asset-NC" component={ExportAssetNC} />
                <Route path="/verify-rights-holder" component={VerifyRightsholder} />
                <Route path="/manage-escrow-NC" component={EscrowManagerNC} />
                <Route path="/mint-pip-asset" component={MintPipAsset} />
                <Route path="/claim-pip-asset" component={ClaimPipAsset} />
                <Route path="/asset-dashboard" component={AssetDashboard} />
                <Route path="/recycle-asset-NC" component={RecycleAssetNC} />
                <Route path="/discard-asset-NC" component={DiscardAssetNC} />
                <Route path="/DnvkxiOAFy_vDC" component={DnvkxiOAFy_vDC} />
            </>)
    }

    else if (routeRequest === "ACAdmin") {
        return (
            <>
                <Route path="/ac-dashboard" component={ACDashboard} />
                <Route path="/add-user" component={AddUser} />
                <Route path="/transfer-ac" component={TransferAC} />
                <Route path="/enable-contract" component={EnableContract} />
                <Route path="/set-costs" component={SetCosts} />
                <Route path="/update-ac-name" component={UpdateACName} />
                <Route path="/mint-pip-asset" component={MintPipAsset} />
                <Route path="/claim-pip-asset" component={ClaimPipAsset} />
                <Route path="/get-ac-data" component={GetACData} />
                <Route path="/increase-ac-share" component={IncreaseACShare} />
                <Route path="/DnvkxiOAFy_vDC" component={DnvkxiOAFy_vDC} />


            </>)
    }

    else if (routeRequest === "basic") {
        return (
            <>
                <Route path="/verify-lite" component={VerifyLite} />
                <Route path="/verify-rights-holder" component={VerifyRightsholder} />
                <Route path="/retrieve-record" component={RetrieveRecord} />
                <Route path="/mint-pip-asset" component={MintPipAsset} />
                <Route path="/claim-pip-asset" component={ClaimPipAsset} />
                <Route path="/asset-dashboard" component={AssetDashboard} />
                <Route path="/DnvkxiOAFy_vDC" component={DnvkxiOAFy_vDC} />
                <Route path="/ac-dashboard" component={ACDashboard} />
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

    else if (routeRequest === "faucet") {
        return (
            <>
                <Route path="/faucet" component={Faucet} />
                <Route path="/DnvkxiOAFy_vDC" component={DnvkxiOAFy_vDC} />
            </>
        )
    }

    else {
        return (
            <>
            <Route path="/DnvkxiOAFy_vDC" component={DnvkxiOAFy_vDC} />
            </>
        )
    }

}

export default Router;