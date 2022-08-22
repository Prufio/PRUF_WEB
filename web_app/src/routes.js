import Dashboard from "views/Dashboard/Dashboard.js";
import Home from "views/Home/Home.js";
import NewRecord from "views/Forms/NewRecord.js";
import ModifyDescription from "views/Forms/ModifyDescription.js";
import ModifyStatus from "views/Forms/ModifyStatus.js";
import ModifyRGT from "views/Forms/ModifyRGT.js";
import Transfer from "views/Forms/Transfer.js";
import Search from "views/Search/Search.js";
import Verify from "views/Forms/Verify.js";
import Counter from "Resources/Counter.js";
import NodeManager from "views/Node/NodeManager.js";
import AuthorizeUser from "views/Node/Forms/AuthorizeUser.js";
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
    name: "Update Asset Info",
    path: "/modify-mutable",
    component: ModifyDescription,
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
  {
    path: "/counter",
    component: Counter,
    layout: "/user",
  },
];
export default dashRoutes;
