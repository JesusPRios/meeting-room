import React, { useEffect, useCallback, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import ChevronDownIcon from "../icons/chevron-down.svg";
import GridIcon from "../icons/grid.svg";
import HorizontaLDots from "../icons/horizontal-dots.svg";
import ListIcon from "../icons/list.svg";
import TableIcon from "../icons/table.svg";
import FireIcon from "../icons/bolt.svg";
import BoxCube from "../icons/box-cube.svg";
import { NavItem } from "../types/NavItem";

const navItems: NavItem[] = [
  {
    icon: <img src={GridIcon} alt="Grid Icon" className="dark:invert" />,
    name: "Tablero",
    subItems: [{ name: "Inicio", path: "/home" }],
  },
  {
    name: "Sustancias Químicas",
    icon: <img src={ListIcon} alt="List Icon" className="dark:invert" />,
    subItems: [
      { name: "Listar sustancias", path: "/basic-tables" },
      { name: "Registrar sustancia", path: "/form-elements" },
    ],
  },
  {
    name: "Inventario",
    icon: <img src={TableIcon} alt="Table Icon" className="dark:invert" />,
    subItems: [
      { name: "Listar Inventario", path: "/inventario-info" },
      { name: "Registrar Inventario", path: "/inventario-register" },
    ],
  },
  {
    icon: <img src={FireIcon} alt="Fire Icon" className="dark:invert" />,
    name: "Pictogramas",
    subItems: [
      { name: "Listar Pictogramas", path: "/pictogramas" },
      { name: "Registrar Pictograma", path: "/pictogramas-register" },
    ],
  },
  {
    icon: <img src={BoxCube} alt="Box Icon" className="dark:invert" />,
    name: "Áreas",
    subItems: [
      { name: "Listar áreas", path: "/area-list" },
      { name: "Registrar áreas", path: "/areas-register" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
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
    <ul className="flex flex-col gap-4 text-black dark:text-white">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${
                openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"
              } cursor-pointer`}
            >
              <span>{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <img
                  src={ChevronDownIcon}
                  className={`ml-auto w-5 h-5 transition-transform duration-200 dark:invert ${
                    openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span>{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`main-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height: openSubmenu?.index === index ? `${subMenuHeight[`main-${index}`]}px` : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-[white] dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200  ${
        isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"
      } ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/home">
          {isExpanded || isHovered || isMobileOpen ? (
            <img className="dark:hidden mt-[-60px] mb-[-59px] ml-10" src="/images/logo-nofondo.png" alt="Logo" width={150} height={40} />
          ) : (
            <img />
          )}
        </Link>
      </div>
      <div className="py-8">
        <h2 className="mb-4 text-xs uppercase text-black dark:text-[white]">
          {isExpanded || isHovered || isMobileOpen ? "Menú" : <img src={HorizontaLDots} />}
        </h2>
        {renderMenuItems(navItems)}
      </div>
    </aside>
  );
};

export default AppSidebar;
