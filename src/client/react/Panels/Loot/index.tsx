import React, { useState, useEffect } from "react";
import { MapSchema } from "@colyseus/schema";
import { guiAssetPath } from "../../cssUtilities";
import { createUseStyles } from "react-jss";
import { useGameEvent } from "../../Hooks/useGameEvent";
import LootState from "@server/components/loot";
import { Button } from "@client/react/FormControls/Button";
import { IconButton } from "@client/react/FormControls/IconButton";
import { FaTimes } from "react-icons/fa";
import { objectMap, objectFindValue, objectForEach } from "utilities/loops";
import LootItem from "./LootItem";
import LootItemState from "@server/components/lootItem";
import gameState from "@client/gameState";

const useStyles = createUseStyles({
  root: {
    position: "absolute",
    backgroundImage: guiAssetPath("panel/loot-bg.png"),
    width: 258,
    height: 324,
  },
  emptySlot: {
    backgroundImage: guiAssetPath("panel/inventory/inventory-slot.png"),
    width: 48,
    height: 48,
    margin: "0 6px 6px 6px",
    float: "left",
  },
  slotContainer: {
    position: "absolute",
    bottom: 29,
    left: 40,
  },
  button: {
    clear: "both",
    width: 178,
  },
  closeBtn: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});

type Props = {
  forceEnable?: boolean;
  propsLootState?: LootState;
};

const EmptySlot = (props: { index: number }) => {
  const classes = useStyles();
  return <div className={classes.emptySlot} />;
};

export default ({ forceEnable = false, propsLootState }: Props) => {
  const classes = useStyles();
  const [lootState] = useGameEvent("localPlayer:loot:response");
  const [iState, setiState] = useState<LootState>();

  useEffect(() => {
    setiState(lootState?.lootState || propsLootState);
  });

  const grab = (lootItem: LootItemState) => {
    if (lootState) {
      gameState.send("map", "localPlayer:loot:grab", {
        tileId: lootState.tileId,
        position: lootItem.position,
      });
    }
  };

  const slotRows = 3;
  const emptySlots = new Array(slotRows * 3).fill(0);

  if (!iState) return null;
  if (!forceEnable) return null;

  const grabAll = () => {
    objectForEach(iState.items, (_, item) => grab(item));
  };

  return (
    <div className={classes.root}>
      <IconButton
        Icon={FaTimes}
        className={classes.closeBtn}
        onClick={() => setiState(undefined)}
      />
      <div className={classes.slotContainer}>
        {emptySlots.map((_, index) => (
          <EmptySlot key={index} index={index} />
        ))}
        {Object.values(
          objectMap(iState.items, (_, item) => (
            <LootItem onClick={() => grab(item)} lootItem={item} />
          ))
        )}
        <Button onClick={grabAll} className={classes.button} value="Grab All" />
      </div>
    </div>
  );
};
