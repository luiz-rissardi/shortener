// import Redis from 'ioredis';

// const redis = new Redis({
//   sentinels: [
//     { host: 'sentinel-1', port: 26379 },
//     { host: 'sentinel-2', port: 26379 },
//     { host: 'sentinel-3', port: 26379 }
//   ],
//   name: 'mymaster',
//   password: 'redispassword',

//   retryStrategy: (times) =>
//     Math.min(times * 200, 3000),
//   maxRetriesPerRequest: 10
// });

// redis.on('connect', () => {
//   console.log('✅ Conectado ao Sentinel');
// });

// redis.on('ready', () => {
//   console.log('✅ Redis pronto');
// });

// redis.on('reconnecting', () => {
//   console.log('🔄 Reconectando...');
// });

// redis.on('error', (err) => {
//   console.error('❌ Redis:', err.message);
// });

// async function main() {
//   try {
//     console.log('PING:', await redis.ping());

//     await redis.set(
//       'teste:failover',
//       new Date().toISOString()
//     );

//     console.log(
//       'GET:',
//       await redis.get('teste:failover')
//     );

//     const info =
//       await redis.info('replication');

//     const role =
//       info.match(/role:(\w+)/)?.[1] ||
//       'desconhecido';

//     console.log(
//       'ROLE:',
//       role
//     );

//   } catch (err) {
//     console.error(
//       '❌ Falha:',
//       err.message
//     );

//     process.exitCode = 1;
//   }
// }

// main();

// funciona
import mysql from 'mysql2/promise';

async function runTests() {
  console.log('==========================================');
  console.log(' TESTE DE ESCRITA E LEITURA VIA PROXYSQL');
  console.log('==========================================\n');

  let connection;

  try {
    connection = await mysql.createConnection({
      host: 'proxysql',
      port: 6033,
      user: 'app_user',
      password: 'app_password',
      database: 'myapp'
    });

    console.log('✅ Conectado ao ProxySQL');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS teste_crud (
        id INT AUTO_INCREMENT PRIMARY KEY,
        dado VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tabela teste_crud OK');

    const [insertResult] = await connection.execute(
      'INSERT INTO teste_crud (dado) VALUES (?)',
      ['teste via container node']
    );

    console.log(
      `✅ INSERT OK - ID: ${insertResult.insertId}`
    );

    const [rows] = await connection.query(`
      SELECT
        id,
        dado,
        criado_em
      FROM teste_crud
      ORDER BY id DESC
      LIMIT 10
    `);

    console.log('✅ SELECT OK');
    console.table(rows);

    const [backend] = await connection.query(`
      SELECT
        @@hostname AS backend,
        @@server_id AS server_id,
        @@read_only AS read_only
    `);

    console.log('✅ Backend utilizado:');
    console.table(backend);

  } catch (error) {
    console.error(
      '❌ Erro durante os testes:',
      error.message
    );

    process.exitCode = 1;

  } finally {
    if (connection) {
      await connection.end().catch(() => {});
    }
  }
}

runTests();