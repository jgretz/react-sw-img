import React, {Component} from 'react';
import createImageWorker from './createImageWorker';

export default class WorkerImage extends Component {
  constructor(props) {
    super(props);

    this.initializeWorker();
    this.state = {src: null};
  }

  componentDidMount() {
    this.mounted = true;

    this.loadImage();
  }

  componentDidUpdate(prevProps) {
    if (this.props.src !== prevProps.src) {
      this.loadImage();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  // helpers
  initializeWorker() {
    const onMessage = ({data: {success}}) => {
      if (success) {
        this.onLoad();
        return;
      }

      this.onError(null, true);
    };

    this.worker = createImageWorker();
    this.worker.onmessage = onMessage.bind(this);
  }

  loadImage() {
    const {mounted, worker, props: {src}} = this;

    if (!mounted) {
      return;
    }

    try {
      worker.postMessage(src);
    } catch (err) {
      // this is likely due to this browser or user not supporting webworkers, so try the main thread
      this.loadImageInMainThread();
    }
  }

  loadImageInMainThread() {
    const image = new Image();
    image.onload = this.onLoad.bind(this);
    image.onerror = this.onError.bind(this);
    image.src = this.props.src;
  }

  // event handlers
  onLoad() {
    const {src, onLoad} = this.props;

    this.setState({src});
    if (onLoad) {
      onLoad();
    }
  }

  onError(err, tryInMainThread) {
    if (tryInMainThread) {
      this.loadImageInMainThread();
      return;
    }

    const {onError} = this.props;
    if (onError) {
      onError(err);
    }
  }

  // render
  renderImage(src, {className, width, height, style}) {
    const extra = {className, width, height, style};

    return (
      <img src={src} {...extra} />
    );
  }

  renderBackgroundImage(src, {className, style, children}) {
    const extra = {className, style: {
      ...(style || {}),
      backgroundImage: `url('${src}')`,
    }};

    return (
      <div {...extra}>
        {children}
      </div>
    );
  }

  render() {
    const {src} = this.state;
    const {placeholder, background} = this.props;
    const render = background ? this.renderBackgroundImage : this.renderImage;

    if (!src && !placeholder) {
      return null;
    }

    return render(src || placeholder, this.props);
  }
}
