import { BG_COLORS } from "../contants/styles";
import {
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

export const getRandomBgClass = () => {
  return BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
};

export const getSortingStrategy = (type: "list" | "grid") => {
  return type === "list" ? verticalListSortingStrategy : rectSortingStrategy;
};
