'use strict'
const Database = use('Database');

class UserController {
	async index(){
		return await Database.table("users").select("*");
	}

	async update({request, response}) {
		const {name, id: body} = request;
		return await Database.table("users").where("id", id).update("name", name);
	}

	async create({request, response}){
		const body = request.post();
		return await Database.insert({name: body.name}).into("users").on('query', console.log);
	}
}

module.exports = UserController
