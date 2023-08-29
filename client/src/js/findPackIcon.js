export function findPackIcon(packName, packs) {
  const packNameToFind = packName;
  const packToFind = packs
    .map((packtype) => Object.values(packtype[1]))
    .find((pack) => Object.values(pack).some((item) => item.name === packNameToFind));

  let iconUrl = null;

  if (packToFind) {
    const packItem = Object.values(packToFind).find((item) => item.name === packNameToFind);
    if (packItem) {
      iconUrl = packItem.icon;
      return iconUrl;
    }
  }
}