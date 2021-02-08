
import Dashboard from "views/Dashboard/Dashboard.js";
import Home from "views/Home/Home.js";
import NewRecord from "views/Forms/NewRecord.js";
import Recycle from "views/Forms/Recycle.js";
import Discard from "views/Forms/Discard.js";
import EscrowManager from "views/Forms/EscrowManager.js";
import Export from "views/Forms/Export.js";
import Import from "views/Forms/Import.js";
import ModifyDescription from "views/Forms/ModifyDescription.js";
import ModifyStatus from "views/Forms/ModifyStatus.js";
import ModifyRGT from "views/Forms/ModifyRGT.js";
import Transfer from "views/Forms/Transfer.js";
import Search from "views/Forms/Search.js";
import Verify from "views/Forms/Verify.js";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/DashboardOutlined";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import SearchIcon from "@material-ui/icons/Search";
import NewRecordIcon from "@material-ui/icons/LibraryAddOutlined";

var dashRoutes = [
  {
    path: "/home",
    name: "Home",
    icon: HomeIcon,
    component: Home,
    layout: "/user"
  },
  {
    path: "/dashboard",
    name: "Asset Dashboard",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/user"
  },
  {
    path: "/search",
    name: "Search",
    icon: SearchIcon,
    component: Search,
    layout: "/user"
  },
  {
    path: "/new-asset",
    name: "New Asset",
    icon: NewRecordIcon,
    component: NewRecord,
    layout: "/user"
  },
  {
    name: "Recycle Asset",
    path: "/recycle-asset",
    component: Recycle,
    layout: "/user"
  },

  {
    name: "Discard Asset",
    path: "/discard-asset",
    component: Discard,
    layout: "/user"
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
    layout: "/user"
  },
  {
    name: "Import Asset",
    path: "/import-asset",
    component: Import,
    layout: "/user"
  },
  {
    name: "Update Asset Info",
    path: "/modify-description",
    component: ModifyDescription,
    layout: "/user"
  },
  {
    name: "Update Status",
    path: "/modify-status",
    component: ModifyStatus,
    layout: "/user"
  },
  {
    name: "Update Owner",
    path: "/modify-rightsholder",
    component: ModifyRGT,
    layout: "/user"
  },
  {
    name: "Transfer Asset",
    path: "/transfer-asset",
    component: Transfer,
    layout: "/user"
  },
  {
    name: "Verify Asset",
    path: "/verify-asset",
    component: Verify,
    layout: "/user"
  },
];
export default dashRoutes;
