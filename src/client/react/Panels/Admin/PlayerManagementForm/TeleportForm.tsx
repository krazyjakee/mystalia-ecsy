import { SubSection } from "../../SubSection";
import React, { useEffect, useRef, useContext, useState } from "react";
import { TextInput } from "../../../FormControls/TextInput";
import { Button } from "../../../FormControls/Button";
import { useGameEvent } from "../../../../react/Hooks/useGameEvent";
import gameState from "../../../../gameState";
import Select, { SelectValue } from "../../../FormControls/Select";
import { SelectedUser } from ".";

export default () => {
  const [allMaps] = useGameEvent("admin:list:allMaps");

  const selectedUser = useContext(SelectedUser);
  const [tileId, setTileId] = useState("1");
  const [selectedMap, setSelectedMap] = useState<string | null>(null);

  useEffect(() => {
    gameState.send("admin", "admin:list:requestAllMaps");
  }, []);

  const toMe = () => {
    gameState.subscribe("localPlayer:movement:response", (movement) => {
      const roomName = gameState.rooms["map"].name;
      if (selectedUser && roomName && movement.currentTile) {
        gameState.send("admin", "admin:teleport:request", {
          username: selectedUser,
          fileName: roomName,
          tileId: movement.currentTile,
        });
      }
      return false;
    });

    gameState.trigger("localPlayer:movement:request", undefined);
  };

  const meTo = () => {
    if (selectedUser) {
      gameState.send("admin", "admin:teleport:request", {
        username: selectedUser,
      });
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedMap && tileId && selectedUser) {
      gameState.send("admin", "admin:teleport:request", {
        username: selectedUser,
        fileName: selectedMap,
        tileId: parseInt(tileId),
      });
    }
    return false;
  };

  const teleportDisabled = !selectedUser || !selectedMap || !tileId;

  return (
    <SubSection label="Teleport">
      <form onSubmit={onSubmit}>
        <Select
          onChange={(e) => {
            setSelectedMap(e.value);
          }}
          placeholder="Select Map"
          isLoading={!allMaps}
          options={
            allMaps &&
            allMaps.all.map((map) => ({
              label: map,
              value: map,
            }))
          }
        />
        <TextInput
          onChange={(e) => setTileId(e.currentTarget.value)}
          placeholder="Enter Tile ID"
          type="number"
        />
        <Button value="Teleport" disabled={teleportDisabled} />
      </form>
      <Button value="Teleport To Me" disabled={!selectedUser} onClick={toMe} />
      <Button value="Teleport Me To" disabled={!selectedUser} onClick={meTo} />
    </SubSection>
  );
};
