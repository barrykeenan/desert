class LoadingScreen {
    constructor() {
        this.initComponents();
        this.bindEvents();
    }

    initComponents() {
        this.el = document.querySelector('[data-loading-screen]');
    }

    bindEvents() {
        this.el.addEventListener('transitionend', this.destroy.bind(this));
    }

    hide() {
        this.el.classList.add('fade-out');
    }

    /**
     * Remove overlay from DOM
     */
    destroy() {
        this.el.remove();
    }
}

export { LoadingScreen };
