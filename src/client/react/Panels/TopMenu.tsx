import React from "react";
import { createUseStyles } from "react-jss";
import { guiAssetPath } from "../cssUtilities";
import { triggerGlobalKeypress } from "utilities/input";
import ReactTooltip from "react-tooltip";

const useStyles = createUseStyles({
  container: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -201.5,
    height: 56,
    backgroundImage: guiAssetPath("panel/top-menu/top-menu-bg.png"),
  },
  items: {
    padding: "4px 26px",
  },
  item: {
    float: "left",
    marginRight: 7,
    width: 32,
    height: 32,
    cursor: "pointer",
    "&:hover": {
      filter: "brightness(1.5)",
    },
  },
});

type Props = React.HTMLAttributes<HTMLDivElement>;

const menuItems = [
  {
    id: "character",
    label: "Character",
    hotkey: "C",
    enabled: false,
  },
  {
    id: "map",
    label: "Map",
    hotkey: "M",
    enabled: false,
  },
  {
    id: "store",
    label: "Storage",
    hotkey: "N",
    enabled: false,
  },
  {
    id: "abilities",
    label: "Abilities",
    hotkey: "A",
    enabled: false,
  },
  {
    id: "crafting",
    label: "Crafting",
    hotkey: "C",
    enabled: true,
  },
  {
    id: "inventory",
    label: "Inventory",
    hotkey: "I",
    enabled: true,
  },
  {
    id: "questlog",
    label: "Quest Log",
    hotkey: "B",
    enabled: false,
  },
  {
    id: "help",
    label: "Help",
    hotkey: "F1",
    enabled: false,
  },
  {
    id: "options",
    label: "Options/Logout",
    hotkey: "Escape",
    enabled: true,
  },
];

export default (props: Props) => {
  const classes = useStyles();

  return (
    <div {...props} className={classes.container}>
      <div className={classes.items}>
        {menuItems.map((item) => (
          <div
            data-tip={item.label}
            onClick={() => triggerGlobalKeypress(item.hotkey)}
            className={classes.item}
            key={item.id}
            style={{
              backgroundImage: guiAssetPath(`panel/top-menu/${item.id}.png`),
              opacity: item.enabled ? 1 : 0.5,
              filter: item.enabled ? "none" : "grayscale(100%)",
            }}
          />
        ))}
      </div>
      <ReactTooltip place="bottom" effect="solid" />
    </div>
  );
};
