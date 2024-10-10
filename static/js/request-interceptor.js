const loaderContainer = document.getElementById("loading-container");
const loaderBar = document.getElementById("loading-bar");

class RequestInterceptor {
    constructor(callback, trackProgress = false) {
        this.callback = callback;
        this.trackProgress = trackProgress; // Optional parameter to track progress
        this.initFetchInterceptor();
        this.initXHRInterceptor();
        //this.initPageLoadProgress();
    }

    // Method to handle request status and invoke the callback
    handleRequestStatus(ended, success = null, progress = null) {
        this.callback({ ended, success, progress });
    }

    // Fetch API interceptor (Progress tracking is not directly supported in Fetch)
    initFetchInterceptor() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            this.handleRequestStatus(false);  // Notify callback that request has started

            try {
                const response = await originalFetch(...args);
                
                // Clone the response to allow other consumers to use the stream
                const responseClone = response.clone();

                // If progress tracking is enabled and response body is a readable stream
                if (this.trackProgress && response.body && !response.body.locked && typeof response.body.getReader === 'function') {
                    const reader = response.body.getReader();
                    const contentLength = response.headers.get('Content-Length');
                    let receivedLength = 0;

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        receivedLength += value.length;
                        const progress = contentLength ? Math.floor((receivedLength / contentLength) * 100) : null;

                        // Notify progress if content length is known
                        if (progress) this.handleRequestStatus(false, null, progress);
                    }
                }

                // Notify the callback when the request ends
                this.handleRequestStatus(true, response.ok);
                
                // Return the cloned response so other consumers can use it
                return responseClone;
            } catch (error) {
                this.handleRequestStatus(true, false);  // Notify callback with failure status when ended
                throw error;
            }
        };
    }

    // XMLHttpRequest interceptor with progress tracking
    initXHRInterceptor() {
        const originalXhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (...args) {
            this.addEventListener('loadstart', () => {
                document.dispatchEvent(new Event('xhr-started'));
            });

            this.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const progress = Math.floor((event.loaded / event.total) * 100);
                    document.dispatchEvent(new CustomEvent('xhr-progress', { detail: { progress } }));
                }
            });

            this.addEventListener('loadend', () => {
                document.dispatchEvent(new CustomEvent('xhr-ended', { detail: { success: this.status >= 200 && this.status < 300 } }));
            });

            return originalXhrOpen.apply(this, args);
        };

        // Handle XHR request events
        document.addEventListener('xhr-started', () => {
            this.handleRequestStatus(false);  // Notify callback that request has started
        });

        document.addEventListener('xhr-progress', (event) => {
            if (this.trackProgress) {
                this.handleRequestStatus(false, null, event.detail.progress);  // Notify callback with progress
            }
        });

        document.addEventListener('xhr-ended', (event) => {
            this.handleRequestStatus(true, event.detail.success);  // Notify callback with success status when ended
        });
    }

    // Initialize page load progress bar handling
    initPageLoadProgress() {
        window.addEventListener('load', () => {

            loaderContainer.style.display = "block";
            // Create a loading effect that increases the width of the progress bar
            let progressInterval = setInterval(() => {
                if (document.readyState === 'loading') {
                    loaderBar.style.width = '40%';
                } else if (document.readyState === 'interactive') {
                    loaderBar.style.width = '80%';
                } else if (document.readyState === 'complete') {
                    loaderContainer.style.display = "none";
                    loaderBar.style.width = "0%";
                    clearInterval(progressInterval);  // Stop interval once the page is fully loaded
                }
            }, 20);  // Speed of progress increase (lower for faster progress)
        });
    }
}

// Usage Example: Instantiate the class and pass a callback function with progress tracking enabled
var loaderContainerTimeout;
new RequestInterceptor((status) => {
    if (!status.ended) {
        loaderContainer.style.display = "block";
        loaderBar.style.width = "40%";
    } else if (status.ended) {
        try {
            clearImmediate(loaderContainerTimeout);
        } catch(e){
            //
        }
        loaderBar.style.width = "100%";
        loaderContainerTimeout = setTimeout(()=>{
            loaderContainer.style.display = "none";
            loaderBar.style.width = "0%";
        }, 200);
    }
    if (status.progress !== null) {
        if(!status.ended && status.progress === 100) {
            loaderBar.style.width = "90%";
        } else {
            loaderBar.style.width = status.progress + "%";
        }
    } 
}, true);  // The second parameter enables progress tracking

