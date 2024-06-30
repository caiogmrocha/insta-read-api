import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { DeleteBookController } from './delete-book.controller';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { DeleteBookService } from '@/app/services/books/delete-book/delete-book.service';
import { Book } from '@/domain/entities/book';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';

describe('DeleteBookController', () => {
  let controller: DeleteBookController;
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
        {
          provide: JwtProvider,
          useClass: jest.fn().mockImplementation(() => ({})),
        },
        DeleteBookService,
      ],
      controllers: [DeleteBookController],
    }).compile();

    controller = module.get<DeleteBookController>(DeleteBookController);
    booksRepository = module.get<jest.Mocked<BooksRepository>>(BooksRepository);
  });

  it('should response with 204 if the book was deleted successfully', async () => {
    // Arrange
    const bookId = 1;

    const book = new Book({ id: bookId });

    booksRepository.getById.mockResolvedValue(book);

    // Act
    const result = await controller.handle({ id: bookId });

    // Assert
    expect(result).toBeUndefined();
  });

  it('should response with 404 if the book does not exist', async () => {
    // Arrange
    const bookId = 1;

    booksRepository.getById.mockResolvedValue(null);

    // Act
    const result = controller.handle({ id: bookId });

    // Assert
    await expect(result).rejects.toThrow(NotFoundException);
  });

  it('should response with 500 if something unexpected happens when trying to delete the book', async () => {
    // Arrange
    const bookId = 1;

    const error = new Error('Unexpected error');

    booksRepository.getById.mockRejectedValue(error);

    // Act
    const result = controller.handle({ id: bookId });

    // Assert
    await expect(result).rejects.toThrow(InternalServerErrorException);
  });
});
