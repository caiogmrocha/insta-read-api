import { Test, TestingModule } from '@nestjs/testing';
import { CreateBookService } from './create-book.service';
import { faker } from '@faker-js/faker';
import { BookISBNAlreadyExistsException } from './errors/book-isbn-already-exists.exception';
import { Book } from '@/domain/entities/book';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';

describe('CreateBookService', () => {
  let service: CreateBookService;
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
    }).compile();

    service = module.get<CreateBookService>(CreateBookService);
    booksRepository = module.get<jest.Mocked<BooksRepository>>(BooksRepository);
  });

  it('should create a new book', async () => {
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
    booksRepository.create.mockResolvedValue(undefined);

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).resolves.toBeUndefined();
    expect(booksRepository.create).toHaveBeenCalled();
  });

  it('should throw BookISBNAlreadyExistsException when ISBN already exists', async () => {
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

    booksRepository.getByISBN.mockResolvedValue(new Book(params));

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(BookISBNAlreadyExistsException);
  });
});
