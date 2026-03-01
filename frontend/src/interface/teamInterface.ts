import type { ITeamCategory } from "./teamCategoryInterface";

export type ITeam = {
  _id: string;
  order: number;
  name: string;
  designation: string;
  image: string;
  category: ITeamCategory;
};
