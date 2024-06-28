import { Test, TestingModule } from '@nestjs/testing';
import { GetPaginatedBooksService, GetPaginatedBooksServiceParams } from './get-paginated-books.service';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { faker } from '@faker-js/faker';
import { Book } from '@/domain/entities/book';

export const mockedBooks = faker.helpers.multiple(() => new Book({
  isbn: faker.helpers.replaceSymbols('###-#-######-##-#'),
  title: faker.commerce.productName(),
  sinopsis: faker.lorem.paragraph(),
  pages: faker.number.int({ min: 50, max: 500 }),
  amount: faker.number.int({ min: 1, max: 100 }),
  author: faker.person.fullName(),
  category: faker.commerce.department(),
  publisher: faker.company.name(),
  publicationDate: faker.date.past(),
}), { count: 20 });

export let bookRepositoryGetPaginatedMock= jest.fn((params: Parameters<BooksRepository['getPaginated']>[0]) => {
  let processedBooks = mockedBooks.slice((params.page - 1) * params.limit, params.page * params.limit);

  if (params.fields) {
    processedBooks = processedBooks.map((book) => {
      const bookProps = Object.entries(book);

      const filteredProps = bookProps.filter(([key]) => params.fields.includes(key as keyof Book));

      const filteredBook = Object.fromEntries(filteredProps);

      const newBook = new Book(filteredBook);

      return newBook;
    });
  }

  return Promise.resolve({
    data: processedBooks,
    total: mockedBooks.length,
  });
});

describe('GetPaginatedBooksService', () => {
  let service: GetPaginatedBooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BooksRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getPaginated: bookRepositoryGetPaginatedMock,
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
    expect(result.data).toHaveLength(params.limit);
  });

  it('should return a list of books paginated in the second page', async () => {
    // Arrange
    const params = {
      page: 2,
      limit: 10,
    };

    // Act
    const result = await service.execute(params);

    // Assert
    expect(result).toEqual({
      data: mockedBooks.slice(10, 20),
      total: mockedBooks.length,
    });
    expect(result.data).toHaveLength(params.limit);
  });

  it('should return a list of books only with specific fields', async () => {
    // Arrange
    const params: GetPaginatedBooksServiceParams = {
      page: 1,
      limit: 10,
      fields: ['title', 'author'],
    };

    // Act
    const result = await service.execute(params);

    // Assert
    expect(result).toEqual({
      data: expect.arrayContaining([
        expect.objectContaining({
          title: expect.any(String),
          author: expect.any(String),
        }),
      ]),
      total: mockedBooks.length,
    });
    expect(result.data[0]).not.toHaveProperty('isbn');
    expect(result.data[0]).not.toHaveProperty('sinopsis');
    expect(result.data[0]).not.toHaveProperty('pages');
    expect(result.data[0]).not.toHaveProperty('amount');
    expect(result.data[0]).not.toHaveProperty('category');
    expect(result.data[0]).not.toHaveProperty('publisher');
    expect(result.data[0]).not.toHaveProperty('publicationDate');
    expect(result.data).toHaveLength(params.limit);
  });
});
