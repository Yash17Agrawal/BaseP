import { ICartItem } from "interfaces/commonInterfaces";
import { DateTime } from "luxon";

export const convertDateTimeFromISO = (data: string) => {
  return DateTime.fromISO(data).toLocaleString({
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const convertDateFromISO = (data: string) => {
  return DateTime.fromISO(data).toLocaleString({
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
export const deleteCartItem = (
  itemId: number,
  cartItems: ICartItem,
  itemsCartSequence: number[]
): { items: ICartItem; itemsCartSequence: Array<number> } => {
  let removeTempItems = { ...cartItems };
  let tempSequence = [...itemsCartSequence];
  const itemIndex = tempSequence.findIndex((el) => el === itemId);
  tempSequence.splice(itemIndex, 1);
  delete removeTempItems[itemId];
  return {
    items: removeTempItems,
    itemsCartSequence: tempSequence,
  };
};

export const addItemToCartData = (
  itemId: number,
  items: ICartItem,
  itemsCartSequence: number[]
): { items: ICartItem; itemsCartSequence: Array<number> } => {
  let tempItems = { ...items };
  if (tempItems[itemId]) {
    tempItems[itemId] = tempItems[itemId] + 1;
    return {
      items: tempItems,
      itemsCartSequence: itemsCartSequence,
    };
  } else {
    let tempSequence = [...itemsCartSequence];
    tempSequence.push(itemId);
    tempItems[itemId] = 1;
    return {
      items: tempItems,
      itemsCartSequence: tempSequence,
    };
  }
};

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export type Order = "asc" | "desc";

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
export function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
