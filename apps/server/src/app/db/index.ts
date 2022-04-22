import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, {
	debug: true,
});

export default sql;
