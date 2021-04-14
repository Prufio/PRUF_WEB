import Dashboard from "views/Dashboard/Dashboard.js";
import Home from "views/Home/Home.js";
import NewRecord from "views/Forms/NewRecord.js";
import Recycle from "views/Forms/Recycle.js";
import Discard from "views/Forms/Discard.js";
import Export from "views/Forms/Export.js";
import Import from "views/Forms/Import.js";
import ModifyDescription from "views/Forms/ModifyDescription.js";
import ModifyStatus from "views/Forms/ModifyStatus.js";
import ModifyRGT from "views/Forms/ModifyRGT.js";
import Transfer from "views/Forms/Transfer.js";
import Search from "views/Search/Search.js";
import Verify from "views/Forms/Verify.js";
import SetForSale from "views/Forms/SetForSale.js";

import NodeManager from "views/Node/NodeManager.js";

import ChangeNodeName from "views/Node/Forms/ChangeNodeName.js";
import AuthorizeUser from "views/Node/Forms/AuthorizeUser.js";
import ChangeNodeData from "views/Node/Forms/ChangeNodeData.js";
import ChangeNodeCosts from "views/Node/Forms/ChangeNodeCosts.js";
import CreateNode from "views/Node/Forms/CreateNode.js";
import TransferNode from "views/Node/Forms/TransferNode.js";
import FinalizeNode from "views/Node/Forms/FinalizeNode.js";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/DashboardOutlined";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import SearchIcon from "@material-ui/icons/Search";
import NewRecordIcon from "@material-ui/icons/LibraryAddOutlined";
import NodeManagerIcon from "@material-ui/icons/AccountBalance";

var dashRoutes = [
  {
    path: "/home",
    name: "Home",
    icon: HomeIcon,
    component: Home,
    layout: "/user",
  },
  {
    path: "/dashboard",
    name: "Asset Dashboard",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/user",
  },
  {
    path: "/search",
    name: "Search",
    icon: SearchIcon,
    component: Search,
    layout: "/user",
  },
  {
    path: "/new-asset",
    name: "New Asset",
    icon: NewRecordIcon,
    component: NewRecord,
    layout: "/user",
  },
  {
    path: "/node-manager",
    name: "Node Manager",
    icon: NodeManagerIcon,
    component: NodeManager,
    layout: "/user",
  },
  {
    name: "Recycle Asset",
    path: "/recycle-asset",
    component: Recycle,
    layout: "/user",
  },

  {
    name: "Discard Asset",
    path: "/discard-asset",
    component: Discard,
    layout: "/user",
  },
  // {
  //   name: "New Asset",
  //   path: "/escrow-manager",
  //   component: EscrowManager,
  //   layout: "/user"
  // },
  {
    name: "Export Asset",
    path: "/export-asset",
    component: Export,
    layout: "/user",
  },
  {
    name: "Import Asset",
    path: "/import-asset",
    component: Import,
    layout: "/user",
  },
  {
    name: "Update Asset Info",
    path: "/modify-description",
    component: ModifyDescription,
    layout: "/user",
  },
  {
    name: "Set For Sale",
    path: "/set-for-sale",
    component: SetForSale,
    layout: "/user",
  },
  {
    name: "Update Status",
    path: "/modify-status",
    component: ModifyStatus,
    layout: "/user",
  },
  {
    name: "Update Owner",
    path: "/modify-rightsholder",
    component: ModifyRGT,
    layout: "/user",
  },
  {
    name: "Transfer Asset",
    path: "/transfer-asset",
    component: Transfer,
    layout: "/user",
  },
  {
    name: "Verify Asset",
    path: "/verify-asset",
    component: Verify,
    layout: "/user",
  },
  {
    name: "Change Node Name",
    path: "/change-name",
    component: ChangeNodeName,
    layout: "/user",
  },
  {
    name: "Change Data",
    path: "/change-data",
    component: ChangeNodeData,
    layout: "/user",
  },
  {
    name: "Change Costs",
    path: "/change-costs",
    component: ChangeNodeCosts,
    layout: "/user",
  },
  {
    name: "Finalize Node",
    path: "/finalize-node",
    component: FinalizeNode,
    layout: "/user",
  },
  {
    name: "Create Node",
    path: "/create-node",
    component: CreateNode,
    layout: "/user",
  },
  {
    name: "Transfer Node",
    path: "/transfer-node",
    component: TransferNode,
    layout: "/user",
  },
  {
    name: "Authorize User",
    path: "/authorize-user",
    component: AuthorizeUser,
    layout: "/user",
  },
];
export default dashRoutes;
