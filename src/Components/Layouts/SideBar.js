import { useEffect, useState } from "react";
import Switch from "../Modules/Switch";

const sidebarData = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "/dash.png",
    link: "/salary",
  },
  {
    id: "payroll",
    label: "Payroll Activites",
    icon: "/activity.png",
    chevron: "/Iconly.png",
    link: "/#",
    // click: function (e) {
    //   e.preventDefault();
    //   setIspayroll(!ispayroll);
    //   setIscurrentState("payroll");
    //   updateIconSidebar(e);
    // },
    parentId: "payroll",
    // stateVariables: ispayroll,
    // subItems: [
    //   {
    //     id: 4,
    //     label: "Payroll Run",
    //     icon: "las la-list",
    //     link: "/payroll-list",
    //     parentid: "payroll",
    //   },

    //   {
    //     id: 1,
    //     label: "Payroll Reversal",
    //     link: "/payroll-new",
    //     parentid: "payroll",
    //   },
    //   {
    //     id: 1,
    //     label: "Payroll History",
    //     link: "/payroll-new",
    //     parentid: "payroll",
    //   },
    //   {
    //     id: 1,
    //     label: "Payroll Lock",
    //     link: "/payroll-new",
    //     parentid: "payroll",
    //   },
    //   {
    //     id: 1,
    //     label: "Payroll Payslip",
    //     link: "/payroll-new",
    //     parentid: "payroll",
    //   },
    //   {
    //     id: 1,
    //     label: "Payroll Log",
    //     link: "/payroll-new",
    //     parentid: "payroll",
    //   },
    //   {
    //     id: 1,
    //     label: "Payroll Aproval",
    //     link: "/payroll-new",
    //     parentid: "payroll",
    //   },
    // ],
  },

  // {
  //   id: "salary",
  //   label: "Salary Structure",
  //   icon: "/tree.png",
  //   link: "/salary",
  // },

  {
    id: "elements-setup",
    label: "Elements Setup",
    icon: "/settings1.png",
    chevron: "/Iconly.png",
    link: "/#",

    parentId: "payroll",
    // stateVariables: ispayroll,
    // subItems: [
    //   {
    //     id: 4,
    //     label: "Elements",
    //     icon: "las la-list",
    //     link: "/payroll-list",
    //     parentid: "payroll",
    //   },

    //   {
    //     id: 1,
    //     label: "Balances",
    //     link: "/payroll-new",
    //     parentid: "payroll",
    //   },
    // ],
  },

  {
    id: "payroll-settings",
    label: "Payroll Settings",
    icon: "/settings.png",
    chevron: "/Iconly.png",
    link: "/#",

    parentId: "payroll",
    // stateVariables: ispayroll,
    // subItems: [
    //   {
    //     id: 4,
    //     label: "Payroll Run",
    //     icon: "las la-list",
    //     link: "/payroll-list",
    //     parentid: "payroll",
    //   },

    //   {
    //     id: 1,
    //     label: "Payroll Reversal",
    //     link: "/payroll-new",
    //     parentid: "payroll",
    //   },
    //   {
    //     id: 1,
    //     label: "Payroll History",
    //     link: "/payroll-new",
    //     parentid: "payroll",
    //   },
    //   {
    //     id: 1,
    //     label: "Payroll Lock",
    //     link: "/payroll-new",
    //     parentid: "payroll",
    //   },
    //   {
    //     id: 1,
    //     label: "Payroll Payslip",
    //     link: "/payroll-new",
    //     parentid: "payroll",
    //   },
    //   {
    //     id: 1,
    //     label: "Payroll Log",
    //     link: "/payroll-new",
    //     parentid: "payroll",
    //   },
    //   {
    //     id: 1,
    //     label: "Payroll Aproval",
    //     link: "/payroll-new",
    //     parentid: "payroll",
    //   },
    // ],
  },

  {
    id: "account",
    label: "My Account",
    icon: "/profile.png",
    link: "/salary",
  },

  {
    id: "logout",
    label: "Logout",
    icon: "/logout.png",
    link: "/salary",
  },
];

function SideBar() {
  const [activeMenu, setActiveMenu] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState("elements-setup");

  const handleNavClick = (item) => {
    console.log(item);

    setActiveMenu(!activeMenu);
    setActiveMenuId(item.id);
  };

  return (
    <div className="sidebar">
      <Switch
        backgroundColor="white"
        name="Switch module"
        list={[]}
        iconPath={"/switch.png"}
      />

      {/* <ul className="sidebar__list">
        <div className="sidebar__item">
          <img src="/dash.png" alt="" />

          <p>Dashboard</p>
        </div>
      </ul> */}

      <ul className="sidebar__list">
        {sidebarData.map((item, i) => {
          return (
            <div key={i} className="sidebar__itemcontainer">
              {item.chevron ? (
                <div
                  className={
                    item.id === activeMenuId
                      ? "sidebar__item active"
                      : "sidebar__item "
                  }
                >
                  <img src={item.icon} alt="" />

                  <p onClick={() => handleNavClick(item)}>{item.label}</p>

                  {/* {item?.subItems && item.id === activeMenuId ? (
                    <img src="/arrow-down.png" alt="" />
                  ) : (
                    <img src="/Iconly.png" alt="" />
                  )} */}

                  {/* {item.id === activeMenuId ? (
                    <img src="/arrow-down.png" alt="" />
                  ) : (
                    <img src="/Iconly.png" alt="" />
                  )} */}
                </div>
              ) : (
                <div
                  className={
                    item.id === activeMenuId
                      ? "sidebar__item active"
                      : "sidebar__item "
                  }
                >
                  <img src={item.icon} alt="" />

                  <p onClick={() => handleNavClick(item)}>{item.label}</p>
                </div>
              )}

              {item.subItems ? (
                <ul className={item.id === activeMenuId ? "active" : " "}>
                  {item.subItems.map((sub, i) => {
                    return <li key={i}>{sub.label}</li>;
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default SideBar;
