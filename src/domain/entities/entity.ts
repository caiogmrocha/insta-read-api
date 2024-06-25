export type EntityProps = Partial<{
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  deleted: boolean;
}>;

export abstract class Entity<T extends EntityProps> {
  constructor(props: T) {
    Object.entries(props).forEach(([key, value]) => {
      Object.defineProperty(this, key, {
        get() {
          return this.props[key];
        },
        set(value) {
          this.props[key] = value;
        },
      });
    });
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
