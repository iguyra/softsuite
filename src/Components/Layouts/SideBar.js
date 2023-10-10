import { useState } from "react";
import Switch from "../Modules/Switch";

const sidebarData = [
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
    subItems: [
      {
        id: 4,
        label: "Payroll Run",
        icon: "las la-list",
        link: "/payroll-list",
        parentid: "payroll",
      },

      {
        id: 1,
        label: "Payroll Reversal",
        link: "/payroll-new",
        parentid: "payroll",
      },
      {
        id: 1,
        label: "Payroll History",
        link: "/payroll-new",
        parentid: "payroll",
      },
      {
        id: 1,
        label: "Payroll Lock",
        link: "/payroll-new",
        parentid: "payroll",
      },
      {
        id: 1,
        label: "Payroll Payslip",
        link: "/payroll-new",
        parentid: "payroll",
      },
      {
        id: 1,
        label: "Payroll Log",
        link: "/payroll-new",
        parentid: "payroll",
      },
      {
        id: 1,
        label: "Payroll Aproval",
        link: "/payroll-new",
        parentid: "payroll",
      },
    ],
  },

  {
    id: "salary",
    label: "Salary Structure",
    icon: "/tree.png",
    link: "/salary",
  },

  {
    id: "elements-setup",
    label: "Elements Setup",
    icon: "/settings1.png",
    chevron: "/Iconly.png",
    link: "/#",

    parentId: "payroll",
    // stateVariables: ispayroll,
    subItems: [
      {
        id: 4,
        label: "Elements",
        icon: "las la-list",
        link: "/payroll-list",
        parentid: "payroll",
      },

      {
        id: 1,
        label: "Balances",
        link: "/payroll-new",
        parentid: "payroll",
      },
    ],
  },

  {
    id: "Employee",
    label: "Employee Structure",
    icon: "/employee.png",
    link: "/employee",
  },
  //
  //
  {
    id: "payroll-settings",
    label: "Payroll Settings",
    icon: "/settings.png",
    chevron: "/Iconly.png",
    link: "/#",

    parentId: "payroll",
    // stateVariables: ispayroll,
    subItems: [
      {
        id: 4,
        label: "Payroll Run",
        icon: "las la-list",
        link: "/payroll-list",
        parentid: "payroll",
      },

      {
        id: 1,
        label: "Payroll Reversal",
        link: "/payroll-new",
        parentid: "payroll",
      },
      {
        id: 1,
        label: "Payroll History",
        link: "/payroll-new",
        parentid: "payroll",
      },
      {
        id: 1,
        label: "Payroll Lock",
        link: "/payroll-new",
        parentid: "payroll",
      },
      {
        id: 1,
        label: "Payroll Payslip",
        link: "/payroll-new",
        parentid: "payroll",
      },
      {
        id: 1,
        label: "Payroll Log",
        link: "/payroll-new",
        parentid: "payroll",
      },
      {
        id: 1,
        label: "Payroll Aproval",
        link: "/payroll-new",
        parentid: "payroll",
      },
    ],
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

      <ul className="sidebar__list">
        <div className="sidebar__item">
          <img src="/dash.png" alt="" />

          <p>Dashboard</p>
        </div>
      </ul>

      <ul className="sidebar__list">
        {sidebarData.map((item, i) => {
          return (
            <div key={i} className="sidebar__itemcontainer">
              {item.chevron ? (
                <div
                  // className="sidebar__item"
                  className={
                    item.id === activeMenuId && activeMenu
                      ? "sidebar__item active"
                      : "sidebar__item "
                  }
                >
                  <img src={item.icon} alt="" />

                  <p onClick={() => handleNavClick(item)}>{item.label}</p>

                  {item.id === activeMenuId && activeMenu ? (
                    <img src="/arrow-down.png" alt="" />
                  ) : (
                    <img src="/Iconly.png" alt="" />
                  )}

                  {/* {item.chevron ? <img src="/Iconly.png" alt="" /> : null} */}
                </div>
              ) : (
                <div
                  // className="sidebar__item "
                  className={
                    item.id === activeMenuId && activeMenu
                      ? "sidebar__item active"
                      : "sidebar__item "
                  }
                >
                  <img src={item.icon} alt="" />

                  <p onClick={() => handleNavClick(item)}>{item.label}</p>
                </div>
              )}

              {item.subItems ? (
                <ul
                  className={
                    item.id === activeMenuId && activeMenu
                      ? "sidebar__subitem active"
                      : "sidebar__subitem "
                  }
                >
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
