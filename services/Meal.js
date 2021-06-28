const MongoLib = require("../lib/db");
const ItemService = require("./Item");

class MealService {
	static MongoDB = new MongoLib();
	static collection = "meals";

	static async getMeals({ itemId, expiratedDate }) {
		const query = { itemId, expiratedDate };

		Object.keys(query).forEach((key) => {
			if (query[key] === undefined) {
				delete query[key];
			}
		});

		return await this.MongoDB.getAll(this.collection, query);
	}

	static async getMeal({ id }) {
		return await this.MongoDB.get(this.collection, id);
	}

	static async createMeal({ meal }) {
		return await this.MongoDB.create(this.collection, meal);
	}

	static async updateMeal({ id, meal }) {
		return await this.MongoDB.update(this.collection, id, meal);
	}

	static async deleteMeal({ id }) {
		const meal = await this.getMeal({ id });

		if (!meal) {
			throw new Error(`Item ${id} is not found`);
		}

		await ItemService.deleteItem({ id: meal.itemId });

		return await this.updateMeal({ id, meal: { deleted: true } });
	}
}

module.exports = MealService;
