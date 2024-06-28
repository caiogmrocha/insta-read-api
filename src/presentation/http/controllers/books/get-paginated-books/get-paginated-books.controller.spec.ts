import { Test, TestingModule } from '@nestjs/testing';

import { bookRepositoryGetPaginatedMock, mockedBooks } from '@/app/services/books/get-paginated-books/get-paginated-books.service.spec';

import { GetPaginatedBooksController } from './get-paginated-books.controller';
import { GetPaginatedBooksService } from '@/app/services/books/get-paginated-books/get-paginated-books.service';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';

describe('GetPaginatedBooksController', () => {
  let controller: GetPaginatedBooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BooksRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getPaginated: bookRepositoryGetPaginatedMock,
          })),
        },
        {
          provide: JwtProvider,
          useClass: jest.fn().mockImplementation(() => ({})),
        },
        GetPaginatedBooksService,
      ],
      controllers: [GetPaginatedBooksController],
    }).compile();

    controller = module.get<GetPaginatedBooksController>(GetPaginatedBooksController);
  });

  it('should response a list of books paginated', async () => {
    // Arrange
    const params = {
      page: 1,
      limit: 10,
    };

    // Act
    const result = await controller.handle(params);

    // Assert
    expect(result).toEqual({
      data: expect.any(Array),
      total: mockedBooks.length,
    });
    expect(result.data).toHaveLength(params.limit);
  })
});
