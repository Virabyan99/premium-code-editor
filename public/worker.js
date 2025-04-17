importScripts('/interpreter.js');
console.log('Worker: Script loaded');

self.onmessage = function (event) {
  console.log('Worker: Received message', event.data);
  const data = event.data;

  if (data.type !== 'execute') {
    console.log('Worker: Invalid message type');
    self.postMessage({ type: 'error', data: '[Error] Invalid message type' });
    return;
  }

  let output = '';
  const append = (message) => {
    output += message + '\n';
    self.postMessage({ type: 'output', data: output });
  };

  try {
    console.log('Worker: Starting interpreter');
    const interpreter = new self.Interpreter(data.code, (interpreter, scope) => {
      const consoleObj = interpreter.createObject(interpreter.OBJECT);
      interpreter.setProperty(scope, 'console', consoleObj);

      interpreter.setProperty(consoleObj, 'log', interpreter.createNativeFunction((...args) => {
        append('[log] ' + args.map(arg => interpreter.pseudoToNative(arg)).join(' '));
      }));

      interpreter.setProperty(consoleObj, 'error', interpreter.createNativeFunction((...args) => {
        append('[error] ' + args.map(arg => interpreter.pseudoToNative(arg)).join(' '));
      }));

      interpreter.setProperty(consoleObj, 'clear', interpreter.createNativeFunction(() => {
        output = '';
        self.postMessage({ type: 'output', data: '' });
      }));
    });

    let stepCount = 0;
    while (interpreter.step()) {
      stepCount++;
      if (stepCount > 10000) {
        throw new Error('Execution timed out');
      }
    }
    console.log('Worker: Interpreter finished');
    self.postMessage({ type: 'output', data: output || '✔️ Execution complete' });
  } catch (error) {
    console.log('Worker: Error', error.message);
    self.postMessage({ type: 'error', data: '[Error] ' + error.message });
  }
};