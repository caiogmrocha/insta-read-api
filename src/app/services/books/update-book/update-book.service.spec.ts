import { Test, TestingModule } from '@nestjs/testing';

import { UpdateBookService, UpdateBookServiceParams } from './update-book.service';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { faker } from '@faker-js/faker';
import { BookNotFoundException } from '../errors/book-not-found.exception';
import { Book } from '@/domain/entities/book';
import { BookISBNAlreadyExistsException } from '../errors/book-isbn-already-exists.exception';

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
            getByISBN: jest.fn(),
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

  it('should throw BookISBNAlreadyExistsException when ISBN already exists', async () => {
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

    const bookToBeUpdated = new Book(params);

    booksRepository.getById.mockResolvedValue(bookToBeUpdated);

    params.isbn = faker.helpers.replaceSymbols('###-#-##-#####-#');

    const bookThatAlreadyExists = new Book({
      id: faker.number.int(),
      isbn: params.isbn,
      title: faker.lorem.words(),
      sinopsis: faker.lorem.paragraph(),
      pages: faker.number.int(),
      amount: faker.number.int(),
      author: faker.person.fullName(),
      category: faker.lorem.word(),
      publisher: faker.company.name(),
      publicationDate: faker.date.recent(),
    });

    booksRepository.getByISBN.mockResolvedValue(bookThatAlreadyExists);

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(BookISBNAlreadyExistsException);
  });

  it('should update the book', async () => {
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

    const bookToBeUpdated = new Book(params);

    booksRepository.getById.mockResolvedValue(bookToBeUpdated);
    booksRepository.getByISBN.mockResolvedValue(null);

    Object.assign(params, {
      title: faker.lorem.words(),
      sinopsis: faker.lorem.paragraph(),
      pages: faker.number.int(),
      amount: faker.number.int(),
    });

    // Act
    await service.execute(params);

    // Assert
    const bookToBeUpdatedCopy = JSON.parse(JSON.stringify(bookToBeUpdated)); // To prevent reference to the same object in the next line

    expect(new Book(Object.assign(bookToBeUpdatedCopy, params)).equals(booksRepository.update.mock.calls[0][0])).toBeTruthy();
  });
});
