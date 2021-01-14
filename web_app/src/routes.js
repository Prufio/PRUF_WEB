
import Dashboard from "views/Dashboard/Dashboard.js";
import Home from "views/Home/Home.js";
import NewRecord from "views/Forms/NewRecord.js";
import Recycle from "views/Forms/Recycle.js";
import Verify from "views/Forms/Verify.js";
import Counter from "views/Forms/Counter.js";
import Discard from "views/Forms/Discard.js";
import EscrowManager from "views/Forms/EscrowManager.js";
import Export from "views/Forms/Export.js";
import Import from "views/Forms/Import.js";
import ModifyDescription from "views/Forms/ModifyDescription.js";
import ModifyStatus from "views/Forms/ModifyStatus.js";
import ModifyRGT from "views/Forms/ModifyRGT.js";
import Transfer from "views/Forms/Transfer.js";
import Search from "views/Forms/Search.js";
import ViewAsset from "views/ViewAsset/ViewAsset.js";
import RetrievedRecord from "views/RetrievedRecord/RetrievedRecord.js";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import HowToReg from "@material-ui/icons/HowToReg";

var dashRoutes = [
  {
    path: "/home",
    name: "Home",
    rtlName: "لوحة القيادة",
    icon: HomeIcon,
    component: Home,
    layout: "/user"
  },
  {
    path: "/dashboard",
    name: "Asset Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/user"
  },
  {
    path: "/verify-asset",
    name: "Verify",
    rtlName: "لوحة القيادة",
    icon: HowToReg,
    component: Verify,
    layout: "/user"
  },
  {
    path: "/search",
    name: "Search",
    rtlName: "لوحة القيادة",
    icon: SearchIcon,
    component: Search,
    layout: "/user"
  },
  {
    collapse: true,
    name: "New Record",
    rtlName: "إستمارات",
    icon: "note_add",
    state: "formsCollapse",
    views: [
      {
        path: "/new-record",
        name: "New Record",
        rtlName: "أشكال عادية",
        mini: "NR",
        // icon: "cachced",
        rtlMini: "صو",
        component: NewRecord,
        layout: "/user"
      },
      {
        path: "/recycle-asset",
        name: "Recycle",
        rtlName: "أشكال عادية",
        mini: "R",
        // icon: "cachced",
        rtlMini: "صو",
        component: Recycle,
        layout: "/user"
      },
    ]
  },
  // {
  //   collapse: true,
  //   name: "Modify Asset",
  //   rtlName: "إستمارات",
  //   icon: "edit",
  //   state: "formsCollapse2",
  //   views: [
  //     {
  //       path: "/counter",
  //       name: "Counter",
  //       rtlName: "أشكال عادية",
  //       mini: "C",
  //       rtlMini: "صو",
  //       component: Counter,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/discard-asset",
  //       name: "Discard Asset",
  //       rtlName: "أشكال عادية",
  //       mini: "DA",
  //       rtlMini: "صو",
  //       component: Discard,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/escrow-manager",
  //       name: "Escrow Manager",
  //       rtlName: "أشكال عادية",
  //       mini: "EM",
  //       rtlMini: "صو",
  //       component: EscrowManager,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/export-asset",
  //       name: "Export Asset",
  //       rtlName: "أشكال عادية",
  //       mini: "EA",
  //       rtlMini: "صو",
  //       component: Export,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/import-asset",
  //       name: "Import Asset",
  //       rtlName: "أشكال عادية",
  //       mini: "IA",
  //       rtlMini: "صو",
  //       component: Import,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/modify-description",
  //       name: "Modify Description",
  //       rtlName: "أشكال عادية",
  //       mini: "MD",
  //       rtlMini: "صو",
  //       component: ModifyDescription,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/modify-status",
  //       name: "Modify Status",
  //       rtlName: "أشكال عادية",
  //       mini: "MS",
  //       rtlMini: "صو",
  //       component: ModifyStatus,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/modify-rightsholder",
  //       name: "Modify Rightsholder",
  //       rtlName: "أشكال عادية",
  //       mini: "MR",
  //       rtlMini: "صو",
  //       component: ModifyRGT,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/transfer-asset",
  //       name: "Transfer",
  //       rtlName: "أشكال عادية",
  //       mini: "T",
  //       rtlMini: "صو",
  //       component: Transfer,
  //       layout: "/admin"
  //     },
  //   ]
  // },
  // {
  //   path: "/view-asset",
  //   name: "View Asset",
  //   rtlName: "لوحة القيادة",
  //   icon: DashboardIcon,
  //   component: ViewAsset,
  //   layout: "/user"
  // },
  // {
  //   path: "/retrieved-record",
  //   name: "Retrieved Record",
  //   rtlName: "لوحة القيادة",
  //   icon: DashboardIcon,
  //   component: RetrievedRecord,
  //   layout: "/admin"
  // },
];
export default dashRoutes;
