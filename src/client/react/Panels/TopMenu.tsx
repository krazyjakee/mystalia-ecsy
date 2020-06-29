import React from "react";
import { createUseStyles } from "react-jss";
import { guiAssetPath } from "../cssUtilities";
import { triggerGlobalKeypress } from "utilities/input";

const useStyles = createUseStyles({
  container: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -201.5,
    width: 403,
    height: 56,
    backgroundImage: guiAssetPath("panel/top-menu/top-menu-bg.png"),
  },
  items: {
    padding: "4px 45px",
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
  },
  {
    id: "map",
    label: "Map",
    hotkey: "M",
  },
  {
    id: "store",
    label: "Storage",
    hotkey: "N",
  },
  {
    id: "abilities",
    label: "Abilities",
    hotkey: "A",
  },
  {
    id: "inventory",
    label: "Inventory",
    hotkey: "I",
  },
  {
    id: "questlog",
    label: "Quest Log",
    hotkey: "B",
  },
  {
    id: "help",
    label: "Help",
    hotkey: "F1",
  },
  {
    id: "options",
    label: "Options/Logout",
    hotkey: "Escape",
  },
];

export default (props: Props) => {
  const classes = useStyles();

  return (
    <div {...props} className={classes.container}>
      <div className={classes.items}>
        {menuItems.map((item) => (
          <div
            onClick={() => triggerGlobalKeypress(item.hotkey)}
            className={classes.item}
            key={item.id}
            style={{
              backgroundImage: guiAssetPath(`panel/top-menu/${item.id}.png`),
            }}
          />
        ))}
      </div>
    </div>
  );
};
