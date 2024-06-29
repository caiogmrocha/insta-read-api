import { Test, TestingModule } from '@nestjs/testing';

import { UpdateBookService, UpdateBookServiceParams } from './update-book.service';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { faker } from '@faker-js/faker';
import { BookNotFoundException } from '../errors/book-not-found.exception';

describe('UpdateBookService', () => {
  let service: UpdateBookService;
  let booksRepository: jest.Mocked<BooksRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BooksRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getById: jest.fn(),
            update: jest.fn(),
          })),
        },
        UpdateBookService,
      ],
    }).compile();

    service = module.get<UpdateBookService>(UpdateBookService);
    booksRepository = module.get<jest.Mocked<BooksRepository>>(BooksRepository);
  });

  it('should throw BookNotFoundException when book does not exist', async () => {
    // Arrange
    const params: UpdateBookServiceParams = {
      id: faker.number.int(),
      isbn: faker.helpers.replaceSymbols('###-#-##-#####-#'),
      title: faker.lorem.words(),
      sinopsis: faker.lorem.paragraph(),
      pages: faker.number.int(),
      amount: faker.number.int(),
      author: faker.person.fullName(),
      category: faker.lorem.word(),
      publisher: faker.company.name(),
      publicationDate: faker.date.recent(),
    };

    booksRepository.getById.mockResolvedValue(null);

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(BookNotFoundException);
  });

  it.todo('should throw BookISBNAlreadyExistsException when ISBN already exists');
  it.todo('should update the book');
});
