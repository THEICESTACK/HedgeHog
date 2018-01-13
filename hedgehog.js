// HedgeHog.js  Hoping to create a modal with more accessible needs
(function() {
    // Constructor
    this.HhogModal = function() {

       // Create global element references
       this.closeButton = null;
       this.modal = null;
       this.overlay = null;

       // Determine proper prefix
       this.transitionEnd = transitionSelect();

       // Option Defaults
       var defaults = {
           autoOpen: false,
           className: 'fade-and-drop',
           closeButton: true,
           content: "",
           maxWidth: 600,
           minWidth: 280,
           overlay: true,
           keyboard: false
       }

        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }
       
        if(this.options.autoOpen === true) {
            this.open();
        }

    }

        // public methods
        HhogModal.prototype.open = function() {
            // build out modal dialog
            buildOut.call(this);

            // initialize modal event listeners
            initializeEvents.call(this);

            /* After adding elements to the DOM, use getComputedStyle
             * to force the browser to recalc and recognize the elements    
             * that we just added. This is so that CSS animation has a start point
             */
            window.getComputedStyle(this.modal).height;

            /* 
            * Add Open class and check if the modal is taller than the window
            * If so, our anchored class is also applied
            */
            this.modal.className = this.modal.className + 
                (this.modal.offsetHeight > window.innerHeight ?
                " scotch-open scotch-anchored" : " scotch-open");
            this.overlay.className = this.overlay.className + " scotch-open";

        }

        HhogModal.prototype.close = function() {
            // store the value of this 
            var _ = this;

            // remove the open class name 
            this.modal.className = this.modal.className.replace(" scotch-open", "");
            this.overlay.className = this.overlay.className.replace(" scotch-open", "");

            /* this will listen for CSS transitionend event and then
             * then remove the nodes from the DOM
            */
            this.modal.addEventListener(this.transitionEnd, function() {
                _.modal.parentNode.removeChild(_.modal);
            });
            this.overlay.addEventListener(this.transitionEnd, function() {
                if(_.overlay.parentNode){
                    _.overlay.parentNode.removeChild(_.overlay);
                }
            });


        }

        // private method

        function buildOut() {

            var content, contentHolder, docFrag;

            if(typeof this.options.content === "string"){
                content = this.options.content;
            }
            else {
                content = this.options.content.innerHtml;
            }

            docFrag = document.createDocumentFragment(); // method extract parts of your document, change, add, or delete, some of the content, and insert it back to your documents

            // create modal dialog elements
            this.modal = document.createElement("div"); // create wrapper div for modal
            this.modal.className = "scotch-modal " + this.options.className;  // add class name to modal div
            this.modal.style.minWidth = this.options.minWidth + "px"; // add minwidth style
            this.modal.style.maxWidth = this.options.maxWidth + "px"; // add maxWidth = 

            // if closeButton option is true then add a close button to modal
            if(this.options.closeButton === true) {
                this.closeButton = document.createElement("button") // create wrapper button for modal
                this.closeButton.className = "scotch-close close-button";
                this.closeButton.innerHTML = "x";
                this.modal.appendChild(this.closeButton);
            } 

            // if overlay option is true then add to modal
            if(this.options.overlay === true) {
                this.overlay = document.createElement("div"); // create overlay to modal
                this.overlay.className = "scotch-overlay " + this.options.className; // add class name to button element
                docFrag.appendChild(this.overlay);
            }

            // create modal content area and append to modal dialog
            contentHolder = document.createElement("div"); // div inside modal for content
            contentHolder.className = "scotch-content"; // div content class name
            contentHolder.innerHTML = content; // display content
            this.modal.appendChild(contentHolder); // add to modal dialog

            // append modal to DocumentFragment
            docFrag.appendChild(this.modal);

            // Append DocumentFragment to body of view page
            document.body.appendChild(docFrag);


        }

        // Utility method to extend defaults with user options
        function extendDefaults(source, properties) {
            var property;
            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    source[property] = properties[property];
                }
            }
            return source;
        }

        // attaching method events
        function initializeEvents() {

            if(this.closeButton) { // if closeButton exist/true
                this.closeButton.addEventListener('click', this.close.bind(this)); // if click, bind to close button
            }

            if (this.overlay) { // if overLay exist/true
                this.overlay.addEventListener('click', this.close.bind(this)); // if click, bind to outerlay
            }
        }

        // Utility method to determine which transitionEnd event is supported 
        function transitionSelect() {
            var el = document.createElement("div");
            if(el.style.webkitTransition)
                return "webkitTransitionEnd";
            if(el.style.OTransition)
                return "OTransitionEnd"
            
            return 'transitionend';
        }
            
        

}());
