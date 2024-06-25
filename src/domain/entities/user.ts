import { Entity, EntityProps } from "./entity";

export type UserProps = Partial<{
  id: number
  name: string;
  email: string;
  password: string;
}> & Partial<EntityProps>;

export class User extends Entity<UserProps> implements UserProps {
  public id: number;
  public name: string;
  public email: string;
  public password: string;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt?: Date;
  public deleted: boolean;

  constructor(props: UserProps) {
    props.createdAt = props.createdAt ?? new Date();
    props.deleted = props.deleted ?? false;

    super(props);
  }
}
