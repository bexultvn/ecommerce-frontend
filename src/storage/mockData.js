export const mockProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    image: 'https://placehold.co/300x300?text=Headphones',
    category: 'Electronics', categoryName: 'Electronics', categoryId: 1,
    stock: 25, availableQuantity: 25,
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers and remote workers.',
    rating: 4.5
  },
  {
    id: '2',
    name: 'Smartphone Stand & Charger',
    price: 34.99,
    image: 'https://placehold.co/300x300?text=Phone+Stand',
    category: 'Electronics', categoryName: 'Electronics', categoryId: 1,
    stock: 50, availableQuantity: 50,
    description: 'Adjustable smartphone stand with built-in 15W wireless charging. Compatible with all Qi-enabled devices. Non-slip base for stable placement.',
    rating: 4.2
  },
  {
    id: '3',
    name: 'USB-C Hub 7-in-1',
    price: 49.99,
    image: 'https://placehold.co/300x300?text=USB+Hub',
    category: 'Electronics', categoryName: 'Electronics', categoryId: 1,
    stock: 30, availableQuantity: 30,
    description: 'Expand your laptop connectivity with HDMI 4K, 3x USB 3.0, SD card reader, and 100W PD charging port. Plug and play, no drivers required.',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    price: 129.99,
    image: 'https://placehold.co/300x300?text=Keyboard',
    category: 'Electronics', categoryName: 'Electronics', categoryId: 1,
    stock: 15, availableQuantity: 15,
    description: 'Compact TKL mechanical keyboard with Cherry MX Red switches. RGB backlit keys, aluminum frame, and detachable USB-C cable.',
    rating: 4.8
  },
  {
    id: '5',
    name: 'Classic Cotton T-Shirt',
    price: 19.99,
    image: 'https://placehold.co/300x300?text=T-Shirt',
    category: 'Clothing', categoryName: 'Clothing', categoryId: 2,
    stock: 100, availableQuantity: 100,
    description: '100% organic cotton crew-neck t-shirt. Pre-shrunk, breathable fabric available in a range of sizes. Machine washable.',
    rating: 4.3
  },
  {
    id: '6',
    name: 'Slim Fit Chino Pants',
    price: 44.99,
    image: 'https://placehold.co/300x300?text=Chinos',
    category: 'Clothing', categoryName: 'Clothing', categoryId: 2,
    stock: 60, availableQuantity: 60,
    description: 'Versatile slim-fit chino pants made from stretch cotton blend. Suitable for casual and semi-formal occasions. Available in multiple colors.',
    rating: 4.1
  },
  {
    id: '7',
    name: 'Hooded Zip-Up Sweatshirt',
    price: 54.99,
    image: 'https://placehold.co/300x300?text=Hoodie',
    category: 'Clothing', categoryName: 'Clothing', categoryId: 2,
    stock: 45, availableQuantity: 45,
    description: 'Cozy fleece-lined hoodie with kangaroo pocket and adjustable drawstring. Perfect for layering on cool days.',
    rating: 4.6
  },
  {
    id: '8',
    name: 'JavaScript: The Good Parts',
    price: 24.99,
    image: 'https://placehold.co/300x300?text=JS+Book',
    category: 'Books', categoryName: 'Books', categoryId: 3,
    stock: 20, availableQuantity: 20,
    description: 'A classic guide to JavaScript best practices by Douglas Crockford. Essential reading for any web developer looking to master the language.',
    rating: 4.9
  },
  {
    id: '9',
    name: 'Clean Code',
    price: 29.99,
    image: 'https://placehold.co/300x300?text=Clean+Code',
    category: 'Books', categoryName: 'Books', categoryId: 3,
    stock: 18, availableQuantity: 18,
    description: 'Robert C. Martin\'s handbook of agile software craftsmanship. Learn how to write readable, maintainable, and robust code.',
    rating: 4.8
  },
  {
    id: '10',
    name: 'The Pragmatic Programmer',
    price: 32.99,
    image: 'https://placehold.co/300x300?text=Pragmatic',
    category: 'Books', categoryName: 'Books', categoryId: 3,
    stock: 22, availableQuantity: 22,
    description: 'A timeless guide to software development best practices. Covers topics from career development to technical excellence.',
    rating: 4.7
  },
  {
    id: '11',
    name: 'Ceramic Coffee Mug Set',
    price: 27.99,
    image: 'https://placehold.co/300x300?text=Mug+Set',
    category: 'Home', categoryName: 'Home', categoryId: 4,
    stock: 35, availableQuantity: 35,
    description: 'Set of 4 handcrafted ceramic mugs, 12oz each. Microwave and dishwasher safe. Minimalist design complements any kitchen style.',
    rating: 4.4
  },
  {
    id: '12',
    name: 'Bamboo Desk Organizer',
    price: 39.99,
    image: 'https://placehold.co/300x300?text=Organizer',
    category: 'Home', categoryName: 'Home', categoryId: 4,
    stock: 28, availableQuantity: 28,
    description: 'Eco-friendly bamboo desk organizer with 5 compartments for pens, papers, and accessories. Keeps your workspace tidy and stylish.',
    rating: 4.5
  }
];

export const mockUsers = [
  {
    id: 'u1',
    email: 'john@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    address: { street: 'Main St', houseNumber: '123', zipCode: '62701' }
  },
  {
    id: 'u2',
    email: 'jane@example.com',
    password: 'password456',
    firstName: 'Jane',
    lastName: 'Smith',
    address: { street: 'Oak Ave', houseNumber: '456', zipCode: '97201' }
  }
];

export const mockOrders = [
  {
    id: 'o1',
    userId: 'u1',
    items: [
      { productId: '1', name: 'Wireless Bluetooth Headphones', price: 79.99, qty: 1 },
      { productId: '8', name: 'JavaScript: The Good Parts', price: 24.99, qty: 2 }
    ],
    total: 129.97,
    status: 'Delivered',
    date: '2026-02-15'
  },
  {
    id: 'o2',
    userId: 'u1',
    items: [
      { productId: '4', name: 'Mechanical Keyboard', price: 129.99, qty: 1 }
    ],
    total: 129.99,
    status: 'Shipped',
    date: '2026-03-01'
  },
  {
    id: 'o3',
    userId: 'u2',
    items: [
      { productId: '5', name: 'Classic Cotton T-Shirt', price: 19.99, qty: 3 },
      { productId: '11', name: 'Ceramic Coffee Mug Set', price: 27.99, qty: 1 }
    ],
    total: 87.96,
    status: 'Processing',
    date: '2026-03-10'
  }
];
