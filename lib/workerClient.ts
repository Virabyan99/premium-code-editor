type WorkerMessage = { type: 'output' | 'error'; data: string };
let worker: Worker | null = null;

export function initWorker() {
  if (!worker) {
    worker = new Worker('/worker.js');
    console.log('Main: Worker initialized');
  }
  return worker;
}

export function executeCode(code: string, onMessage: (msg: WorkerMessage) => void): Promise<void> {
  return new Promise((resolve) => {
    const workerInstance = initWorker();
    workerInstance.onmessage = (event) => {
      console.log('Main: Received message from worker', event.data);
      const msg = event.data;
      if (msg && (msg.type === 'output' || msg.type === 'error')) {
        onMessage(msg);
        resolve();
      }
    };
    console.log('Main: Sending execute message');
    workerInstance.postMessage({ type: 'execute', code });
  });
}