import {Tab} from "@app/App";
import {Button} from "@components/core/Button";
import styles from "./style.module.scss";

interface NavbarProps {
  currentTab: Tab;
  setTab: (tab: Tab) => void;
}

export const Navbar = ({currentTab, setTab}: NavbarProps) => {
  return (
    <nav className={styles.tabsListContainer}>
      {Object.values(Tab).map((v, i) => (
        <Button
          className={`${styles.tabButton} ${
            v === currentTab ? styles.tabButtonActive : ""
          }`}
          onPress={() => setTab(v)}
          key={v}
        >
          {i + 1}
        </Button>
      ))}
    </nav>
  );
};
