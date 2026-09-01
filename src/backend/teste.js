import Redis from 'ioredis';

const redis = new Redis({
  sentinels: [
    { host: 'sentinel-1', port: 26379 },
    { host: 'sentinel-2', port: 26379 },
    { host: 'sentinel-3', port: 26379 }
  ],
  name: 'mymaster',
  password: 'redispassword',

  retryStrategy: (times) =>
    Math.min(times * 200, 3000),
  maxRetriesPerRequest: 10
});

redis.on('connect', () => {
  console.log('✅ Conectado ao Sentinel');
});

redis.on('ready', () => {
  console.log('✅ Redis pronto');
});

redis.on('reconnecting', () => {
  console.log('🔄 Reconectando...');
});

redis.on('error', (err) => {
  console.error('❌ Redis:', err.message);
});

async function main() {
  try {
    console.log('PING:', await redis.ping());

    await redis.set(
      'teste:failover',
      new Date().toISOString()
    );

    console.log(
      'GET:',
      await redis.get('teste:failover')
    );

    const info =
      await redis.info('replication');

    const role =
      info.match(/role:(\w+)/)?.[1] ||
      'desconhecido';

    console.log(
      'ROLE:',
      role
    );

  } catch (err) {
    console.error(
      '❌ Falha:',
      err.message
    );

    process.exitCode = 1;
  }
}

main();