import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import type { Usuario } from '@/types';

// Tipos para request
interface CreateUsuarioRequest {
	nome: string;
	email: string;
}

// Tipos para response
interface ApiResponse<T> {
	data?: T;
	error?: string;
}

export async function GET(): Promise<NextResponse<ApiResponse<Usuario[]>>> {
	try {
		const pool = await getConnection();
		const result = await pool.request().query('SELECT * FROM Usuarios');
		return NextResponse.json({ data: result.recordset });
	} catch (error) {
		console.error('Erro ao buscar usuários:', error);
		return NextResponse.json(
			{ error: 'Erro ao buscar usuários' },
			{ status: 500 }
		);
	}
}

export async function POST(
	request: Request
): Promise<NextResponse<ApiResponse<Usuario>>> {
	try {
		const body = (await request.json()) as CreateUsuarioRequest;

		// Validação básica
		if (!body.nome || !body.email) {
			return NextResponse.json(
				{ error: 'Nome e email são obrigatórios' },
				{ status: 400 }
			);
		}

		const pool = await getConnection();

		const result = await pool
			.request()
			.input('nome', body.nome)
			.input('email', body.email).query(`
        INSERT INTO Usuarios (nome, email)
        VALUES (@nome, @email);
        SELECT SCOPE_IDENTITY() AS id;
      `);

		const novoUsuario: Usuario = {
			id: result.recordset[0].id,
			nome: body.nome,
			email: body.email,
			dataCriacao: new Date(),
		};

		return NextResponse.json({ data: novoUsuario });
	} catch (error) {
		console.error('Erro ao criar usuário:', error);
		return NextResponse.json(
			{ error: 'Erro ao criar usuário' },
			{ status: 500 }
		);
	}
}
