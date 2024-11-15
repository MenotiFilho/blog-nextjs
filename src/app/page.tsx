'use client';

import { useState, useEffect } from 'react';
import type { Usuario } from '@/types';

export default function Home() {
	const [usuarios, setUsuarios] = useState<Usuario[]>([]);
	const [nome, setNome] = useState('');
	const [email, setEmail] = useState('');

	useEffect(() => {
		fetchUsuarios();
	}, []);

	async function fetchUsuarios() {
		const response = await fetch('/api/usuarios');
		const data = await response.json();
		setUsuarios(data);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		await fetch('/api/usuarios', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ nome, email }),
		});

		setNome('');
		setEmail('');
		fetchUsuarios();
	}

	return (
		<main className="p-8">
			<form onSubmit={handleSubmit} className="mb-8 space-y-4">
				<div>
					<input
						type="text"
						value={nome}
						onChange={(e) => setNome(e.target.value)}
						placeholder="Nome"
						className="border p-2 rounded"
					/>
				</div>
				<div>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						className="border p-2 rounded"
					/>
				</div>
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Adicionar Usuário
				</button>
			</form>

			<h2 className="text-xl font-bold mb-4">Usuários:</h2>
			<div className="space-y-2">
				{Array.isArray(usuarios) && usuarios.map((usuario) => (
					<div key={usuario.id} className="border p-4 rounded">
						<p>
							<strong>Nome:</strong> {usuario.nome}
						</p>
						<p>
							<strong>Email:</strong> {usuario.email}
						</p>
					</div>
				))}
			</div>
		</main>
	);
}
