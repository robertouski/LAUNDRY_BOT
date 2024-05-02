const fs = require('fs');
const filePath = "users.json";


async function checkUser(ctx) {
	try {
			let users = [];
			if (fs.existsSync(filePath)) {
					const data = fs.readFileSync(filePath, 'utf8');
					if (data.trim().length !== 0) { 
							users = JSON.parse(data);
					}
			}
			
			let userExists = users.some(user => user.idPhone === ctx.from);
			return userExists;
	} catch (err) {
			console.error("Error handling the users file:", err);
	}
}

async function registerUser(name, number) {
	try {
			let users = [];
			if (fs.existsSync(filePath)) {
					const data = fs.readFileSync(filePath, 'utf8');
					if (data.trim()) {  
							users = JSON.parse(data);
					}
			}
			users.push({ idPhone: number, name: name });
			fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
	} catch (err) {
			console.error("Error writing to the users file:", err);
			if (err instanceof SyntaxError) {
					console.error("There is a syntax error in your JSON. Here's the problematic data:", err.message);
			} else {
					console.error("An error occurred:", err.message);
			}
	}
}

async function deleteUser(idPhone) {
	try {
			let users = [];
			if (fs.existsSync(filePath)) {
					const data = fs.readFileSync(filePath, 'utf8');
					if (data.trim()) {
							users = JSON.parse(data);
					}
			}

			const index = users.findIndex(user => user.idPhone === idPhone);
			if (index !== -1) {
					users.splice(index, 1);  
					fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
					console.log("User deleted successfully.");
			} else {
					console.log("User not found.");
			}
	} catch (err) {
			console.error("Error updating the users file:", err);
	}
}

async function findUserName(idPhone) {
	try {
			let users = [];
			if (fs.existsSync(filePath)) {
					const data = fs.readFileSync(filePath, 'utf8');
					if (data.trim()) {
							users = JSON.parse(data);
					}
			}

			const user = users.find(user => user.idPhone === idPhone);
			if (user) {
					console.log("User found:", user.name);
					return user.name;  
			} else {
					console.log("User not found.");
					return null;  
			}
	} catch (err) {
			console.error("Error searching the users file:", err);
			return null;  
	}
}

module.exports = {checkUser, registerUser, findUserName}