# Kan Markdown Note

Kan is a Markdown Note built with Rust and React. It is a simple and lightweight application that allows you to write and save your not in markdown format. The application is built using the Tauri framework, which makes it cross-platform.

## Features
- Write your note in markdown format.
- Supports common markdown syntax like headers, emphasis, bold, code blocks, etc.
- Undo/Redo feature
- View the help icon on Kan for shortcuts
- Cross-platform support

## Getting Started
To get started with the Kan markdown editor, follow these steps:

### Prerequisites
- Rust
- Node.js

### Installation
1. Clone the repository
```shell
git clone https://github.com/Fanaperana/kan.git
```
2. Install the dependencies by navigating into the cloned directory and running:
```shell
npm install
```
3. To start the application, run:
```shell
npm run tauri dev
```

This will start both the frontend and backend servers.

## Usage
After starting the application, you can start writing your markdown in the editor. Some of the supported syntax includes:

### Headers
```md
# H1
## H2
### H3
```

### Emphasis
```md
*Italic*
**Bold**
```

### Code blocks
```md
`Inline code`
```

```md
    ```
    Multi-line code block
    ```
```

### Lists
```md
- Unordered list item
- Another unordered list item
```

```md
1. Ordered list item
2. Another ordered list item
```

### Links
```md
[Link text](https://www.example.com)
```

### Images
```md
![Alt text](https://www.example.com/image.jpg)
```

### Undo/Redo
To undo the last action, press `Ctrl + Z`. To redo, press `Ctrl + Shift + Z`.

### View Help Window
To view the help window on Kan, press F1.

### Saving
Note written in markdown are saved automatically. If you close Kan it will keep you notes.

### License
This project is licensed under the MIT License. See the LICENSE file for details.
