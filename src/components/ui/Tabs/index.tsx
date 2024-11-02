import {Tab} from "@app/App";
import {HaussTab} from "./HaussTab";
import {ProgTab} from "./ProgTab";
import {SeidelTab} from "./SeidelTab";

interface TabsProps {
  currentTab: Tab;
}

export const Tabs = ({currentTab}: TabsProps) => {
  return (
    <>
      {currentTab === Tab.FIRST && <HaussTab />}
      {currentTab === Tab.SECOND && <ProgTab />}
      {currentTab === Tab.THIRD && <SeidelTab />}
    </>
  );
};
