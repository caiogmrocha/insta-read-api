import { User, UserProps } from "./user";

export class Admin extends User {
  public readonly type: User['type'] = "admin";
};
