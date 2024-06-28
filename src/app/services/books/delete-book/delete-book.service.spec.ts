import { Test, TestingModule } from '@nestjs/testing';
import { DeleteBookService } from './delete-book.service';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { BookNotFoundException } from '../errors/book-not-found.exception';

describe('DeleteBookService', () => {
  let service: DeleteBookService;
  let booksRepository: jest.Mocked<BooksRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BooksRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getById: jest.fn(),
            delete: jest.fn(),
          })),
        },
        DeleteBookService,
      ],
    }).compile();

    service = module.get<DeleteBookService>(DeleteBookService);
    booksRepository = module.get(BooksRepository);
  });

  it('should throw an error if the book does not exist', async () => {
    // Arrange
    const bookId = 1;

    booksRepository.getById.mockResolvedValue(null);

    // Act
    const result = service.execute({ id: bookId });

    // Assert
    await expect(result).rejects.toThrow(BookNotFoundException);
  });

  it.todo('should delete a book');
});
