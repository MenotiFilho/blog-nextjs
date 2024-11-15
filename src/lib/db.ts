import { DefaultAzureCredential } from '@azure/identity';
import sql from 'mssql';

const credential = new DefaultAzureCredential();

async function getToken() {
	const tokenResponse = await credential.getToken(
		'https://database.windows.net/'
	);
	return tokenResponse.token;
}

const sqlConfig = {
	server: process.env.AZURE_SQL_SERVER!,
	database: process.env.AZURE_SQL_DATABASE!,
	options: {
		encrypt: true,
		trustServerCertificate: false,
	},
	authentication: {
		type: 'azure-active-directory-access-token' as const,
		options: {
			token: await getToken(),
		},
	},
};

export async function getConnection() {
	try {
		const pool = await sql.connect(sqlConfig);
		return pool;
	} catch (err) {
		console.error('Erro ao conectar ao banco:', err);
		throw err;
	}
}
