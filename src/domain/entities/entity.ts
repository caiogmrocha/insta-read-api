export type EntityProps = Partial<{
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  deleted: boolean;
}>;

export abstract class Entity<T extends EntityProps> {
  constructor(props: T) {
    props.createdAt = props.createdAt ?? new Date();
    props.deleted = props.deleted ?? false;

    Object.assign(this, props);
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    return JSON.stringify(this) === JSON.stringify(object);
  }
}
