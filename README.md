REFACTOR OF https://github.com/scenaristeur/heroku-spoggy (Polymer2) using Polymer3

# install :
```
git clone https://github.com/scenaristeur/spoggy3.git
npm install
npm run spoggy

```





[![Built with pwa–starter–kit](https://img.shields.io/badge/built_with-pwa–starter–kit_-blue.svg)](https://github.com/Polymer/pwa-starter-kit "Built with pwa–starter–kit")

# Books PWA

Books is a simple Google Books PWA. It uses [Google Books API](https://developers.google.com/books/docs/v1/reference/volumes/list) to search for books and [Embedded Viewer API](https://developers.google.com/books/docs/viewer/reference) to display book content.

Additionally it uses [OAuth 2.0](https://developers.google.com/identity/protocols/OAuth2UserAgent) authorization to retrieve a listing of the Favorites on the authenticated user's bookshelf. As well as add/remove favorite on the authenticated user's bookshelf.

The app is built using [PWA Starter Kit](https://github.com/Polymer/pwa-starter-kit). Using the starter-template as the starting point and the [wiki](https://github.com/Polymer/pwa-starter-kit/wiki) for configuring and personalizing.

![books screenshot](https://user-images.githubusercontent.com/116360/39160803-4d7a2696-4722-11e8-9ca2-d9b4dd1ac8f5.png)

## Features/highlights

- Show a basic search-list-detail flow.
- Use `fetch` to send request to Google Books API.
- Sign-in to Google account using [Google Sign-In Client API](https://developers.google.com/identity/sign-in/web/reference#googleauthsignin)
- OAuth 2.0 authorization to access Google APIs via [Google API Client Library](https://developers.google.com/api-client-library/javascript/reference/referencedocs)
- Display offline UI when fetch returns failure while offline.
- And once it comes back online, automatically re-fetch and update the page.
- Uses the [SpeechRecognition API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) to search by voice.
- Shimmer placeholder while content is loading.  
    ![shimmer](https://user-images.githubusercontent.com/116360/38531318-1ec79c38-3c24-11e8-8e8f-d2efdf190afa.gif)
- Update the browser URL programmatically without causing page reload. In the app, we want to append query param to the URL when the search input’s value is committed.
- Scroll to top on page change.
- `<book-rating>`: Simple rating element.
- `<book-image>`: Basic image element which fades in when the image is loaded. Also has a placeholder that can be used to put a base64 encoded data URL to create the “blur up” effect.
- `<book-input-decorator>`: Simple input decorator element in which the input's underline animates when the input is focused.

## Setup
```bash
$ npm i
$ npm start # or similar that serve index.html for all routes
```

#### Enable OAuth for list/add/remove favorites on the authenticated user's bookshelf
- Enable Books API and create OAuth client ID  
https://developers.google.com/identity/protocols/OAuth2UserAgent#prerequisites
- Set the OAuth client ID in the application [here](https://github.com/PolymerLabs/books/blob/master/src/actions/auth.js#L24)

## Build and deploy
```bash
$ npm run build:prpl-server
```
Download the [Google App Engine SDK](https://cloud.google.com/appengine/downloads) and follow the instructions to install and create a new project. This app uses the Python SDK.
```bash
$ gcloud app deploy server/app.yaml --project <project>
```




### #########################################################""
TODO :
- [x] catchurl pour recupérer les paramètres et determiner si on a des données a afficher ou si l'on doit se brancher sur un graph
- [ ]  spoggy-collab pour carte multi-utilisateurs
- [ ] connexion à un endpoint sparql pour query / update (virtuoso, fuseki, Semantic Forms... levelgraph, solid)









###########################

API Documentation [https://github.com/Polymer/lit-element](https://github.com/Polymer/lit-element)

    render() (protected): Implement to describe the element's DOM using lit-html. Ideally, the render implementation is a pure function using only the element's current properties to describe the element template. This is the only method that must be implemented by subclasses. Note, since render() is called by update(), setting properties does not trigger an update, allowing property values to be computed and validated.

    shouldUpdate(changedProperties) (protected): Implement to control if updating and rendering should occur when property values change or requestUpdate() is called. The changedProperties argument is a Map with keys for the changed properties pointing to their previous values. By default, this method always returns true, but this can be customized as an optimization to avoid updating work when changes occur, which should not be rendered.

    update(changedProperties) (protected): This method calls render() and then uses lit-html in order to render the template DOM. It also updates any reflected attributes based on property values. Setting properties inside this method will not trigger another update.

    firstUpdated(changedProperties): (protected) Called after the element's DOM has been updated the first time, immediately before updated() is called. This method can be useful for capturing references to rendered static nodes that must be directly acted upon, for example in updated(). Setting properties inside this method will trigger the element to update.

    updated(changedProperties): (protected) Called whenever the element's DOM has been updated and rendered. Implement to perform post updating tasks via DOM APIs, for example, focusing an element. Setting properties inside this method will trigger the element to update.

    updateComplete: Returns a Promise that resolves when the element has completed updating. The Promise value is a boolean that is true if the element completed the update without triggering another update. The Promise result is false if a property was set inside updated(). This getter can be implemented to await additional state. For example, it is sometimes useful to await a rendered element before fulfilling this Promise. To do this, first await super.updateComplete then any subsequent state.

    requestUpdate(name?, oldValue?): Call to request the element to asynchronously update regardless of whether or not any property changes are pending. This should be called when an element should update based on some state not triggered by setting a property. In this case, pass no arguments. It should also be called when manually implementing a property setter. In this case, pass the property name and oldValue to ensure that any configured property options are honored. Returns the updateComplete Promise which is resolved when the update completes.

    createRenderRoot() (protected): Implement to customize where the element's template is rendered by returning an element into which to render. By default this creates a shadowRoot for the element. To render into the element's childNodes, return this.

Advanced: Update Lifecycle

    A property is set (e.g. element.foo = 5).
    If the property's hasChanged(value, oldValue) returns false, the element does not update. If it returns true, requestUpdate() is called to schedule an update.
    requestUpdate(): Updates the element after awaiting a microtask (at the end of the event loop, before the next paint).
    shouldUpdate(changedProperties): The update proceeds if this returns true, which it does by default.
    update(changedProperties): Updates the element. Setting properties inside this method will not trigger another update.
        render(): Returns a lit-html TemplateResult (e.g. html`Hello ${world}`) to render element DOM. Setting properties inside this method will not trigger the element to update.
    firstUpdated(changedProperties): Called after the element is updated the first time, immediately before updated is called. Setting properties inside this method will trigger the element to update.
    updated(changedProperties): Called whenever the element is updated. Setting properties inside this method will trigger the element to update.
    updateComplete Promise is resolved with a boolean that is true if the element is not pending another update, and any code awaiting the element's updateComplete Promise runs and observes the element in the updated state.
