process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const items = require('../fakeDb');

let chocolate = { name: 'Chocolate', price: 2.99 };
let chocolateUpdatedName = { name: 'ChocolateIceCream' };
let chocolateUpdatedPrice = { price: 3.99 };
let chocolateUpdatedAll = { name: 'ChocolateBar', price: 4.99 };
let soup = { name: 'Soup', price: 3.49 };

beforeEach(() => {
	items.push(chocolate);
});

afterEach(() => {
	items.length = 0;
});

describe('GET /items', () => {
	test('Get all items', async () => {
		const res = await request(app).get('/items');
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ items: [ chocolate ] });
	});
});

describe('POST /items', () => {
	test('Creating an item', async () => {
		const res = await request(app).post('/items').send(soup);
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({ added: soup });
	});
	test('Respond with 400 if name is missing', async () => {
		const res = await request(app).post('/items').send({});
		expect(res.statusCode).toBe(400);
		expect(res.body).toEqual({ error: 'Name is required' });
	});
});

describe('GET /items/:name', () => {
	test('Get item by name', async () => {
		const res = await request(app).get(`/items/${chocolate.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ item: chocolate });
	});
	test('Respond with 404 for invalid item', async () => {
		const res = await request(app).get(`/items/WRONG`);
		expect(res.statusCode).toBe(404);
		expect(res.body).toEqual({ error: 'Item not found' });
	});
});

describe('PATCH /items/:name', () => {
	test('Update item name', async () => {
		const res = await request(app).patch(`/items/${chocolate.name}`).send(chocolateUpdatedName);
		expect(res.statusCode).toBe(200);
		let update = chocolate;
		update.name = chocolateUpdatedName.name;
		expect(res.body).toEqual({ updated: update });
	});
	test('Update item price', async () => {
		const res = await request(app).patch(`/items/${chocolate.name}`).send(chocolateUpdatedPrice);
		expect(res.statusCode).toBe(200);
		let update = chocolate;
		update.price = chocolateUpdatedPrice.price;
		expect(res.body).toEqual({ updated: update });
	});
	test('Update item name and price', async () => {
		const res = await request(app).patch(`/items/${chocolate.name}`).send(chocolateUpdatedAll);
		expect(res.statusCode).toBe(200);
		let update = chocolate;
		update.name = chocolateUpdatedAll.name;
		update.price = chocolateUpdatedAll.price;
		expect(res.body).toEqual({ updated: update });
	});
});

describe('DELETE /items/:name', () => {
	test('Delete an item', async () => {
		const res = await request(app).delete(`/items/${chocolate.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: 'Deleted' });
	});
	test('Respond with 404 for deleting invalid item', async () => {
		const res = await request(app).delete(`/items/WRONG`);
		expect(res.statusCode).toBe(404);
		expect(res.body).toEqual({ error: 'Item not found' });
	});
});
