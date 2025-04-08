import React, { useEffect, useCallback, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import ChevronDownIcon from "../icons/chevron-down.svg";
import GridIcon from "../icons/grid.svg";
import ListIcon from "../icons/list.svg";
import TableIcon from "../icons/table.svg";
import FireIcon from "../icons/bolt.svg";
import { NavItem } from "../types/NavItem";
import Cookies from "js-cookie";

const role = Cookies.get("role");

const navItems: NavItem[] = [
  {
    icon: <img src={GridIcon} alt="Grid Icon" className="dark:invert" />,
    name: "Inicio",
    path: "/",
  },
  {
    name: "Reservar reunión",
    icon: <img src={ListIcon} alt="List Icon" className="dark:invert" />,
    path: "/form-elements",
  },
  {
    icon: <img src={FireIcon} alt="Fire Icon" className="dark:invert" />,
    name: "Iniciar sesión",
    path: "/signin",
  },
];

const navItemsAdmin: NavItem[] = [
  {
    name: "Inicio - Admin",
    icon: <img src={TableIcon} alt="Table Icon" className="dark:invert" />,
    path: "/inventario-register"
    // subItems: [
    //   { name: "Listar Inventario", path: "/inventario-info" },
    //   { name: "Registrar Inventario", path: "/inventario-register" },
    // ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "main", index });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `main-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prevOpenSubmenu) =>
      prevOpenSubmenu?.index === index ? null : { type: "main", index }
    );
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4 text-black">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems && nav.subItems.length > 0 ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={`menu-item group bg-white text-black ${
                  openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer`}
              >
                <span>{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text text-black">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <img
                    src={ChevronDownIcon}
                    className={`ml-auto w-5 h-5 transition-transform duration-200 dark:invert ${
                      openSubmenu?.index === index ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Subitems visibles solo si está abierto el submenu */}
              {openSubmenu?.index === index && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`main-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height: subMenuHeight[`main-${index}`] || "auto",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`menu-dropdown-item bg-white ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : nav.path ? (
            <Link
              to={nav.path}
              className={`menu-item group ${
                isActive(nav.path)
                  ? "bg-white text-black"
                  : "bg-white text-black"
              }`}
            >
              <span>{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </Link>
          ) : null}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-[#39A900] dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-[#39A900]  ${
        isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
          ? "w-[290px]"
          : "w-[90px]"
      } ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/home">
          {isExpanded || isHovered || isMobileOpen ? (
            <img
              className="dark:hidden mt-[-60px] mb-[59px] ml-10"
              src=""
              alt="Logo"
              width={150}
              height={40}
            />
          ) : (
            <img />
          )}
        </Link>
      </div>
      <div className="py-8">
        <h2 className="mb-4 mt-[-60px] text-xs uppercase text-[white] font-medium">
          {isExpanded || isHovered || isMobileOpen ? (
            "Menú de opciones"
          ) : (
            <img src="" />
          )}
        </h2>
        {renderMenuItems(navItems)}

        {role === "admin" && (
          <>
            <h2 className="mb-2 mt-6 text-xs uppercase text-white font-medium">
              Administración
            </h2>
            {renderMenuItems(navItemsAdmin)}
          </>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
