import { User } from "./user";

export class Reader extends User {
  public readonly type: User['type'] = "reader";
};
