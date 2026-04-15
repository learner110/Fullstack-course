```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST /new_note_spa (new note data)
    activate server
    server-->>browser: JSON response (created note)
    deactivate server

    Note right of browser: JS updates notes list without reloading page
```