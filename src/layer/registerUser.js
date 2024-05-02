const fs = require('fs');
const filePath = "users.json";

// Función para registrar usuario
async function checkUser(ctx) {
	try {
			let users = [];
			if (fs.existsSync(filePath)) {
					const data = fs.readFileSync(filePath, 'utf8');
					if (data.trim().length !== 0) { // Asegura que el contenido no esté vacío
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
					if (data.trim()) {  // Asegúrate de que hay algo antes de parsear
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

module.exports = {checkUser, registerUser}