import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('book-loan')
export class BookLoanProcessor extends WorkerHost {
  public async process(job: Job): Promise<any> {

  }
}
