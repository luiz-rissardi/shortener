import cluster from "cluster";
import os from "os";

const processCount = os.cpus().length - 1;

async function primaryWorker() {
    for (let i = 0; i < processCount; i++) {
        const worker = cluster.fork();
        console.info(`a new Worker is spanw ${worker.process.pid}`)
    }

    cluster.on("exit", (worker, code, signal) => {
        const fork = cluster.fork();
        console.log(`worker died, new worker running at ${fork.process.pid}`);
    })
}

async function processWorker() {
    await import("../express/server-express.js");
}

cluster.isPrimary ? primaryWorker() : processWorker()
