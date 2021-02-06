
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
    path: "/recycle-asset",
    component: Recycle,
    layout: "/user"
  },

  {
    path: "/discard-asset",
    component: Discard,
    layout: "/user"
  },
  {
    path: "/escrow-manager",
    component: EscrowManager,
    layout: "/user"
  },
  {
    path: "/export-asset",
    component: Export,
    layout: "/user"
  },
  {
    path: "/import-asset",
    component: Import,
    layout: "/user"
  },
  {
    path: "/modify-description",
    component: ModifyDescription,
    layout: "/user"
  },
  {
    path: "/modify-status",
    component: ModifyStatus,
    layout: "/user"
  },
  {
    path: "/modify-rightsholder",
    component: ModifyRGT,
    layout: "/user"
  },
  {
    path: "/transfer-asset",
    component: Transfer,
    layout: "/user"
  },
];
export default dashRoutes;
