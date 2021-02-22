import React from "react";

import { SCHEDULED } from "../../constants/uiConstants";
import { logo, logoSmall } from "../../assets/images";
import styles from "./styles.module.scss";

const strings = {
  video: "Video",
  logoAlt: "logo alt",
  cameraAlt: "Camera icon",
};

interface SidebarItem {
  label: string;
  unviewed: string | number;
  key: string;
  mobileIcon: string;
}

const renderListItems = (
  items: SidebarItem[],
  onCategory: (key: string) => void,
  activeKey?: string
): JSX.Element[] => {
  const active = activeKey || SCHEDULED;
  return items.map(
    ({ label, unviewed, key, mobileIcon }): JSX.Element => {
      const onChoose = () => onCategory(key);
      return (
        <div
          key={key}
          onClick={onChoose}
          className={`${styles.listItem} ${
            key === active ? styles.activeListItem : ""
          }`}
        >
          <img
            className={styles.cameraIcon}
            src={mobileIcon}
            alt={strings.cameraAlt}
          />
          <span className={styles.label}>{label}</span>
          {!!unviewed && <span className={styles.unviewed}>{unviewed}</span>}
        </div>
      );
    }
  );
};

interface SidebarProps {
  items: SidebarItem[];
  setActiveCategory: (key: string) => void;
  activeSidebarKey?: string;
}

const Sidebar = ({
  items,
  setActiveCategory,
  activeSidebarKey,
}: SidebarProps): JSX.Element => {
  return (
    <div className={styles.sidebarWrapper}>
      <img className={styles.logo} src={logo} alt={strings.logoAlt} />
      <div className={styles.logoSmallWrapper}>
        <img
          className={styles.logoSmall}
          src={logoSmall}
          alt={strings.logoAlt}
        />
      </div>
      <div className={styles.menu}>
        <h4 className={styles.title}>{strings.video}</h4>
        {renderListItems(items, setActiveCategory, activeSidebarKey)}
      </div>
    </div>
  );
};

export default Sidebar;
