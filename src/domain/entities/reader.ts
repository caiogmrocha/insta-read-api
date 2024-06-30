import { User, UserProps } from "./user";

export type ReaderProps = Partial<{
  isArchived: boolean;
  archivedAt?: Date;
}> & Partial<UserProps>;

export class Reader extends User<ReaderProps> implements ReaderProps {
  public readonly type: User<ReaderProps>['type'] = "reader";

  public isArchived: boolean;
  public archivedAt?: Date;

  constructor(props: ReaderProps) {
    super(props);

    this.isArchived = props.isArchived ?? false;
    this.archivedAt = props.archivedAt;
  }
};
