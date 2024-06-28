import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { Book } from '@/domain/entities/book';
import { CreateBookController } from './create-book.controller';
import { CreateBookService } from '@/app/services/books/create-book/create-book.service';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

describe('CreateBookController', () => {
  let controller: CreateBookController;
  let booksRepository: jest.Mocked<BooksRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BooksRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getByISBN: jest.fn(),
            create: jest.fn(),
          })),
        },
        {
          provide: JwtProvider,
          useClass: jest.fn().mockImplementation(() => ({})),
        },
        CreateBookService,
      ],
      controllers: [CreateBookController],
    }).compile();

    controller = module.get<CreateBookController>(CreateBookController);
    booksRepository = module.get<jest.Mocked<BooksRepository>>(BooksRepository);
  });

  it('should response with 201 status code when book is created', async () => {
    // Arrange
    const params = {
      isbn: faker.helpers.replaceSymbols('###-#-######-##-#'),
      title: faker.commerce.productName(),
      sinopsis: faker.lorem.paragraph(),
      pages: faker.number.int({ min: 50, max: 500 }),
      amount: faker.number.int({ min: 1, max: 100 }),
      author: faker.person.fullName(),
      category: faker.commerce.department(),
      publisher: faker.company.name(),
      publicationDate: faker.date.past(),
    };

    booksRepository.getByISBN.mockResolvedValue(null);

    // Act
    const promise = controller.handle(params);

    // Assert
    await expect(promise).resolves.toBeUndefined();
  });

  it('should response with 409 status code when ISBN already exists', async () => {
    // Arrange
    const params = {
      isbn: faker.helpers.replaceSymbols('###-#-######-##-#'),
      title: faker.commerce.productName(),
      sinopsis: faker.lorem.paragraph(),
      pages: faker.number.int({ min: 50, max: 500 }),
      amount: faker.number.int({ min: 1, max: 100 }),
      author: faker.person.fullName(),
      category: faker.commerce.department(),
      publisher: faker.company.name(),
      publicationDate: faker.date.past(),
    };

    booksRepository.getByISBN.mockResolvedValue(new Book(params));

    // Act
    const promise = controller.handle(params);

    // Assert
    await expect(promise).rejects.toThrow(ConflictException);
  });

  it('should response with 500 status code when an unexpected error occurs', async () => {
    // Arrange
    const params = {
      isbn: faker.helpers.replaceSymbols('###-#-######-##-#'),
      title: faker.commerce.productName(),
      sinopsis: faker.lorem.paragraph(),
      pages: faker.number.int({ min: 50, max: 500 }),
      amount: faker.number.int({ min: 1, max: 100 }),
      author: faker.person.fullName(),
      category: faker.commerce.department(),
      publisher: faker.company.name(),
      publicationDate: faker.date.past(),
    };

    booksRepository.getByISBN.mockRejectedValue(new Error('Unexpected error'));

    // Act
    const promise = controller.handle(params);

    // Assert
    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });
});
