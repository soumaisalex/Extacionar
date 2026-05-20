import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_para_desenvolvimento';

export async function POST(request: Request) {
  try {
    const { bloco, apartamento, senha } = await request.json();

    // Validação básica dos campos obrigatórios
    if (!bloco || !apartamento || !senha) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      )
    }

    // Busca o apartamento no Neon.tech
    // O recurso do driver do Neon parametriza automaticamente para evitar SQL Injection
    const result = await sql`
      SELECT id, bloco, apartamento, senha_hash 
      FROM apartamentos 
      WHERE UPPER(bloco) = ${bloco.toUpperCase()} AND apartamento = ${apartamento}
      LIMIT 1
    `;

    const aptoEncontrado = result[0];

    // Se não encontrar ou a senha estiver incorreta
    if (!aptoEncontrado) {
      return NextResponse.json(
        { message: 'Credenciais inválidas para este apartamento.' },
        { status: 401 }
      );
    }

    const senhaValida = await bcrypt.compare(senha, aptoEncontrado.senha_hash);
    if (!senhaValida) {
      return NextResponse.json(
        { message: 'Credenciais inválidas para este apartamento.' },
        { status: 401 }
      );
    }

    // Cria o token de sessão JWT
    const token = jwt.sign(
      { 
        id: aptoEncontrado.id, 
        bloco: aptoEncontrado.bloco, 
        apartamento: aptoEncontrado.apartamento 
      },
      JWT_SECRET,
      { expiresIn: '7d' } // Mantém o morador logado por 7 dias no celular
    );

    // Configura a resposta com o cookie seguro HTTP-only
    const response = NextResponse.json(
      { message: 'Login efetuado com sucesso!' },
      { status: 200 }
    );

    response.cookies.set({
      name: 'extacionar_session',
      value: token,
      httpOnly: true, // Impede acesso via scripts no front-end (proteção XSS)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias em segundos
    });

    return response;

  } catch (error: any) {
    console.error('Erro na rota de login:', error);
    return NextResponse.json(
      { message: 'Erro interno no servidor ao processar o login.' },
      { status: 500 }
    );
  }
}
