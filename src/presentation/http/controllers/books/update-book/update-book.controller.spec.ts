import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { UpdateBookController } from './update-book.controller';
import { UpdateBookBodyDto, UpdateBookParamsDto } from './update-book.dto';
import { UpdateBookService } from '@/app/services/books/update-book/update-book.service';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';

describe('UpdateBookController', () => {
  let controller: UpdateBookController;
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
      controllers: [UpdateBookController],
    }).compile();

    controller = module.get<UpdateBookController>(UpdateBookController);
    booksRepository = module.get<jest.Mocked<BooksRepository>>(BooksRepository);
  });

  it.todo('should response with 204 when book is updated');

  it('should response with 404 when book does not exist', async () => {
    // Arrange
    const params: UpdateBookParamsDto = {
      id: faker.number.int(),
    };

    const body: UpdateBookBodyDto = {
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
    const promise = controller.handle(params, body);

    // Assert
    await expect(promise).rejects.toThrow(NotFoundException);
  });

  it.todo('should response with 409 when ISBN already exists');
  it.todo('should response with 500 when any error happens');
});
