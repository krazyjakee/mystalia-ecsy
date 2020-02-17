export const getMapProperties = (mapData: any) => {
  if (mapData.properties) {
    let properties: any = {};
    mapData.properties.forEach((p: any) => {
      properties[p.name] = p.value;
    });
    return properties;
  }
  throw new Error("Failed to load map. No properties found.");
};
