const workerLogic = () => {
  self.onmessage = e => {
    const src = e.data;
    const sender = self;

    const onLoad = () => {
      sender.postMessage({success: true});
    };

    const onError = () => {
      sender.postMessage({success: false});
    };

    try {
      fetch(src, {mode: 'no-cors'})
        .then(onLoad)
        .catch(onError);
    } catch (err) {
      onError(err);
    }
  };
};

let code = workerLogic.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], {type: 'application/javascript'});
const workerScript = URL.createObjectURL(blob);

export default () => new Worker(workerScript);
