import autocannon from "autocannon";
 
const url = process.argv[2] || "http://localhost:3000/v1UhZ8";
const connections = Number(process.argv[3]) || 1000;
const duration = Number(process.argv[4]) || 10;
 
console.log(`Rodando: ${connections} conexões, ${duration}s, contra ${url}`);
console.log("maxRedirections: 0 (mede só a resposta do seu servidor, não segue o redirect)\n");
 
const instance = autocannon(
    {
        url,
        connections,
        duration,
        method: "GET",
        maxRedirections: 0,
    },
    (err, result) => {
        if (err) {
            console.error("Erro ao rodar o teste:", err);
            process.exit(1);
        }
        printReport(result);
    }
);
 
autocannon.track(instance, { renderProgressBar: true });
 
process.once("SIGINT", () => instance.stop());
 
function printReport(result) {
    const total = result.requests.total;
 
    const rows = [
        ["Requisições totais", total],
        ["Requisições/seg (média)", result.requests.average],
        ["Latência média (ms)", result.latency.average],
        ["Latência p99 (ms)", result.latency.p99],
    ];
 
    const statusRows = [
        ["2xx (sucesso)", result["2xx"] ?? 0],
        ["3xx (redirect — esperado no seu endpoint)", result["3xx"] ?? 0],
        ["4xx (erro do cliente)", result["4xx"] ?? 0],
        ["5xx (erro do servidor)", result["5xx"] ?? 0],
        ["errors (conexão recusada/reset)", result.errors ?? 0],
        ["timeouts", result.timeouts ?? 0],
    ];
 
    console.log("\n=== Resumo geral ===");
    for (const [label, value] of rows) {
        console.log(`${label.padEnd(28)}: ${value}`);
    }
 
    console.log("\n=== Classificação por status ===");
    for (const [label, value] of statusRows) {
        const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
        console.log(`${label.padEnd(45)}: ${value} (${pct}%)`);
    }
 
    const realFailures = (result["4xx"] ?? 0) + (result["5xx"] ?? 0) + (result.errors ?? 0) + (result.timeouts ?? 0);
 
    console.log("\n=== Diagnóstico ===");
    if (realFailures === 0) {
        console.log("✅ Nenhuma falha real. O que apareceu como 'non 2xx' era só o 302 do redirect (comportamento esperado).");
    } else {
        console.log(`⚠️  ${realFailures} falhas reais (4xx/5xx/errors/timeouts) de ${total} requisições — vale investigar logs do backend/MySQL/Redis nesse intervalo.`);
    }
}