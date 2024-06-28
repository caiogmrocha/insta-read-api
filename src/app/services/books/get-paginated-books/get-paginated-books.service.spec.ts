import { Test, TestingModule } from '@nestjs/testing';
import { GetPaginatedBooksService } from './get-paginated-books.service';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { faker } from '@faker-js/faker';
import { Book } from '@/domain/entities/book';

describe('GetPaginatedBooksService', () => {
  let service: GetPaginatedBooksService;

  const mockedBooks = faker.helpers.multiple(() => new Book({
    isbn: faker.helpers.replaceSymbols('###-#-######-##-#'),
    title: faker.commerce.productName(),
    sinopsis: faker.lorem.paragraph(),
    pages: faker.number.int({ min: 50, max: 500 }),
    amount: faker.number.int({ min: 1, max: 100 }),
    author: faker.person.fullName(),
    category: faker.commerce.department(),
    publisher: faker.company.name(),
    publicationDate: faker.date.past(),
  }), { count: 20 })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BooksRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getPaginated: jest.fn((params: Parameters<BooksRepository['getPaginated']>[0]) => {
              return Promise.resolve({
                data: mockedBooks.slice((params.page - 1) * params.limit, params.page * params.limit),
                total: mockedBooks.length,
              });
            }),
          })),
        },
        GetPaginatedBooksService,
      ],
    }).compile();

    service = module.get<GetPaginatedBooksService>(GetPaginatedBooksService);
  });

  it('should return a list of books paginated', async () => {
    // Arrange
    const params = {
      page: 1,
      limit: 10,
    };

    // Act
    const result = await service.execute(params);

    // Assert
    expect(result).toEqual({
      data: expect.any(Array),
      total: mockedBooks.length,
    });
    expect(result.data).toHaveLength(10);
  });
});
