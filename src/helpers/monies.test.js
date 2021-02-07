import {
  calculateDiscountPrice,
  calculateDiscountPercent,
  getDiscountData,
  calculateTax,
  calculateTotal,
} from './monies';

let product, product2;

beforeAll(() => {
  product = {
    byline: 'Latest generation smart televison 2021',
    discount: '0.00',
    image_url:
      'https://www.lg.com/sg/images/tvs/md05271244/gallery/LG-43LH600T-L.jpg',
    name: 'Samsung XG-900 55 inch LCD TV',
    price: '400.40',
    product_id: 1,
    rating: null,
    quantity: 2,
  };
  product2 = {
    byline: 'A good remote.',
    discount: '0.15',
    image_url:
      'https://www.lg.com/sg/images/tvs/md05271244/gallery/LG-43LH600T-L.jpg',
    name: 'Logitech Singularity Universal Remote',
    price: '40.20',
    product_id: 2,
    rating: null,
    quantity: 1,
  };
});

describe('calculateDiscountPrice', () => {
  test('should return discounted price if product has discount', () => {
    const price = calculateDiscountPrice(product2);
    expect(price).toEqual('34.17');
  });

  test('should return price if product has no discount', () => {
    const price = calculateDiscountPrice(product);
    expect(price).toEqual('400.40');
  });
});

describe('calculateDiscountPercent', () => {
  test('should return 15 for 0.15 discount', () => {
    const discountPercent = calculateDiscountPercent(product2);
    expect(discountPercent).toEqual('15');
  });

  test('should return 0 for 0.00 discount', () => {
    const discountPercent = calculateDiscountPercent(product);
    expect(discountPercent).toEqual('0');
  });
});

describe('getDiscountData', () => {
  test('should return discount price and percent', () => {
    const data = getDiscountData(product2);
    expect(data.discountPrice).toEqual('34.17');
    expect(data.percent).toEqual('15');
  });

  test('should return non-discount price and percent', () => {
    const data = getDiscountData(product);
    expect(data.discountPrice).toEqual('400.40');
    expect(data.percent).toEqual('0');
  });
});

describe('calculateTax', () => {
  test('should give accurate tax for CA residents', () => {
    expect(calculateTax('100.00', 'california')).toBe('8.50');
    expect(calculateTax('1000.00', 'Ca')).toBe('85.00');
  });

  test('should return subtotal for non-CA residents', () => {
    expect(calculateTax('100.00', 'Nevada')).toBe('0.00');
    expect(calculateTax('1000.00', 'MI')).toBe('0.00');
  });
});

describe('calculateTotal', () => {
  test('should give accurate total for CA residents', () => {
    expect(calculateTotal('100.00', 'california')).toBe('108.50');
    expect(calculateTotal('1000.00', 'Ca', '12.00')).toBe('1097.00');
  });

  test('should return subtotal plus shipping for non-CA residents', () => {
    expect(calculateTotal('100.00', 'Nevada')).toBe('100.00');
    expect(calculateTotal('1000.00', 'MI', '25.00')).toBe('1025.00');
  });
});
