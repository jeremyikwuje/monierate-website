window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then(registration => {
                console.log('Service worker registration successful:', registration);

                // Listen for updates to the service worker
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;

                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                console.log('New content is available; please refresh.');
                            } else {
                                console.log('Content is cached for offline use.');
                            }
                        }
                    };
                };

                // Listen for changes in the service worker controller
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    console.log('Service worker controller has changed.');
                });

            })
            .catch(error => {
                console.error('Service worker registration failed:', error);
            });
    }
});
