import React, { useState, useEffect } from "react";
import { MapSchema } from "@colyseus/schema";
import { guiAssetPath } from "../../cssUtilities";
import { createUseStyles } from "react-jss";
import { useGameEvent } from "../../Hooks/useGameEvent";
import LootState from "@server/components/loot";
import { Button } from "@client/react/FormControls/Button";
import { IconButton } from "@client/react/FormControls/IconButton";
import { FaTimes } from "react-icons/fa";
import { objectMap, objectForEach } from "utilities/loops";
import LootItem from "./LootItem";
import LootItemState from "@server/components/lootItem";
import gameState from "@client/gameState";
import { isPresent } from "utilities/guards";

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
  propsLootState?: LootItemState[];
};

const EmptySlot = (props: { index: number }) => {
  const classes = useStyles();
  return <div className={classes.emptySlot} />;
};

export default ({ forceEnable = false, propsLootState = [] }: Props) => {
  const classes = useStyles();
  const [tileId, setTileId] = useState<number | undefined>(
    propsLootState ? 1 : undefined
  );
  const [lootItems, setLootItems] = useState<LootItemState[]>(propsLootState);

  useEffect(() => {
    gameState.subscribe("localPlayer:loot:open", (lootOpen) => {
      setTileId(lootOpen.tileId);
      gameState.trigger("localPlayer:loot:request", {
        tileId: lootOpen.tileId,
      });
    });
    gameState.subscribe("localPlayer:loot:update", (lootUpdate) => {
      if (lootUpdate.tileId === tileId) {
        setLootItems(
          Object.values(objectMap(lootUpdate.lootState.items, (_, v) => v))
        );
      }
    });
  }, [lootItems, tileId]);

  if (!forceEnable) {
    if (!isPresent(tileId)) return null;
    if (!lootItems.length) return null;
  }

  const slotRows = 3;
  const emptySlots = new Array(slotRows * 3).fill(0);

  const grab = (lootItem: LootItemState) => {
    if (lootItems && isPresent(tileId)) {
      gameState.send("map", "localPlayer:loot:grab", {
        tileId: tileId,
        position: lootItem.position,
      });
    }
  };

  if (!lootItems.length) return null;

  const grabAll = () => {
    lootItems.forEach((item) => grab(item));
  };

  return (
    <div className={classes.root}>
      <IconButton
        Icon={FaTimes}
        className={classes.closeBtn}
        onClick={() => setLootItems([])}
      />
      <div className={classes.slotContainer}>
        {emptySlots.map((_, index) => (
          <EmptySlot key={index} index={index} />
        ))}
        {lootItems.map((item) => (
          <LootItem
            key={item.position}
            onClick={() => grab(item)}
            lootItem={item}
          />
        ))}
        <Button onClick={grabAll} className={classes.button} value="Grab All" />
      </div>
    </div>
  );
};
