import { Section } from "../../Section";
import React, { useEffect, useState } from "react";
import gameState from "../../../../gameState";
import { useGameEvent } from "../../../Hooks/useGameEvent";
import TeleportForm from "./TeleportForm";
import Select from "../../../FormControls/Select";

export const SelectedUser = React.createContext<string | null>("selectedUser");

export default ({ show = false }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [allPlayers] = useGameEvent("admin:list:allPlayers");

  useEffect(() => {
    gameState.send("admin", "admin:list:requestAllPlayers");
  }, []);

  if (!show) return null;

  return (
    <Section>
      <Select
        onChange={(e) => {
          setSelectedUser(e.value);
        }}
        placeholder="Select Player"
        isLoading={!allPlayers}
        options={
          allPlayers &&
          allPlayers.all.map((player) => ({
            label: player.displayName,
            value: player.username,
          }))
        }
      />
      <SelectedUser.Provider value={selectedUser}>
        <TeleportForm />
      </SelectedUser.Provider>
    </Section>
  );
};
