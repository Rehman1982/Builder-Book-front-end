export const makeTree = (itemsArray) => {
  const map = {};
  const tree = [];

  // Create a map with default children array
  itemsArray.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  // Build the tree
  itemsArray.forEach((item) => {
    if (item.parent_id && map[item.parent_id]) {
      map[item.parent_id].children.push(map[item.id]);
    } else {
      tree.push(map[item.id]);
    }
  });
  return tree;
};
