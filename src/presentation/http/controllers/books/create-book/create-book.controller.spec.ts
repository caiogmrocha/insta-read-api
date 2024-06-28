import { Test, TestingModule } from '@nestjs/testing';
import { CreateBookController } from './create-book.controller';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { CreateBookService } from '@/app/services/books/create-book/create-book.service';
import { faker } from '@faker-js/faker';

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

  it.todo('should response with 400 status code when ISBN already exists');
  it.todo('should response with 500 status code when an unexpected error occurs');
});
