import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('A variável de ambiente DATABASE_URL não está definida.');
}

// Cria o cliente SQL do Neon pronto para ser usado nas API Routes / Server Actions
const sql = neon(process.env.DATABASE_URL);

export default sql;
