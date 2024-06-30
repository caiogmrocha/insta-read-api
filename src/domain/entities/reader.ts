import { ReaderAlreadyArchivedException } from "@/app/services/readers/errors/reader-already-archived.exception";
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

  public archive(): void {
    if (this.isArchived) {
      throw new ReaderAlreadyArchivedException(this.id);
    }

    this.isArchived = true;
    this.archivedAt = new Date();
  }
};
