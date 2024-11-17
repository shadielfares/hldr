# hldr
This is a repo called HardLessonsDoneRight, basically I'm trying to make an AI coding mentor that actively helps you become a better programmer without spoon-feeding you info.

PLEASE REACH OUT IF U WANT TO HELP WITH THIS PROJECT

## Project Road-Map:

### Phase 1: Project Setup and Initial Foundation
Task 1: Initialize GitHub Repository
    
    Set up a GitHub repository for HLDR
    Ensure proper documentation (README, contribution guidelines).
    Set up basic folder structure for CLI and WebSocket server.

    **Completed**

Task 2: Build the WebSocket Server (Backend)

I realized, I don't have to make the websocket in Node.js. I can just use Python and FastAPI to perform the same functionality.

    Subtask 2.1: Create basic WebSocket server in Node.js.
        Set up ws library.
        Define endpoints for code analysis and suggestion generation.
    Subtask 2.2: Add functionality to parse and process incoming code from clients.
    Subtask 2.3: Create placeholder for AI code review logic (to be implemented later).
    Subtask 2.4: Implement basic response/suggestion mechanism (e.g., send dummy suggestion).

    **Completed**

Task 3: Create CLI Tool (For Vim & Terminal Users)

    Subtask 3.1: Set up CLI tool using Node.js or Python.
    Subtask 3.2: Implement basic CLI commands (e.g., hldr start, hldr check).
    Subtask 3.3: Connect CLI to WebSocket server to send code snippets.
    Subtask 3.4: Display WebSocket server's responses in the terminal.

        **Completed**


Task 4: Build the Vim Plugin (HLDR for Vim)
Note: No need for 4.2 or 4.3 as no longer need Webscoket and suggestoins are made once you save it, this is good for 2 reasons:
1.  Saves money for the amount of requests made to OpenAI Model
2.  Less bothersome as you can articulate code and thought process - only receiving feedback when you want and not have the feedback bothering you on every change/letter typed to your file.

```
   Subtask 4.1: Create basic Vim/Neovim plugin structure.
   ~~Subtask 4.2: Add event listener for buffer changes (trigger on code updates).~~
    ~~Subtask 4.3: Send code snippets to the WebSocket server via CLI.~~
    Subtask 4.4: Display suggestions within Vim (either in terminal or through split window).

  **Completed** the main step of 4.4, so now you type, and get good feedback.
```

Task 5: Build the VS Code Extension (HLDR for VS Code)

    Subtask 5.1: Set up basic VS Code extension using yo code generator.
    Subtask 5.2: Implement terminal creation to show suggestions.
    Subtask 5.3: Integrate WebSocket communication to receive suggestions.
    Subtask 5.4: Display suggestions in terminal or as notifications.

 ### Phase 2: AI Code Review Logic
Task 6: Implement Basic AI Code Review Logic
```
    Subtask 6.1: Research and select existing AI/code review libraries (e.g., GPT, OpenAI Codex).
    Subtask 6.2: Implement basic AI model or API integration for recognizing patterns like nested loops.
    Subtask 6.3: Design a system to handle common coding patterns (e.g., brute force vs optimized solutions).
~~Subtask 6.4: Connect AI suggestions to WebSocket server output.~~ - No longer need because we got rid of websocket

**Completed**
```

Task 7: Implement Code Parsing and Analysis

    Subtask 7.1: Implement a lightweight code parsing system (to identify common structures).
    Subtask 7.2: Add support for common languages (e.g., Python, JavaScript).
    Subtask 7.3: Integrate parsing results into AI feedback loop.

**Completed with Task 6**

### Phase 3: Advanced Features & Enhancements
Task 8: Add Support for Multiple Programming Languages

    Subtask 8.1: Expand parsing and analysis to support additional languages (e.g., Java, C++).
    Subtask 8.2: Tailor AI suggestions based on language syntax and conventions.



Task 9: Add Real-Time Feedback
```
~~Subtask 9.1: Add feature to send code in small chunks for real-time feedback.~~ Real-time feedback doesn't actually help all that much, as it is visually cluttering and deters from real learning.
    ~~Subtask 9.2: Implement WebSocket push notifications for immediate suggestions.~~ No more websocket...

**Completed**
```
### Phase 4: Collaboration & Open Source Development
Task 10: Prepare for Open Source Contribution

    Subtask 10.1: Write detailed contribution guidelines (how to set up the project, coding standards).
    Subtask 10.2: Set up issue tracker with tasks and bugs labeled for contributors.
    Subtask 10.3: Write unit tests for the WebSocket server and CLI tool.
    Subtask 10.4: Implement CI/CD pipeline to ensure code quality.

Task 11: Grow the Project

    Subtask 11.1: Share the project on relevant forums and open-source communities (GitHub, Reddit).
    Subtask 11.2: Create a project board for managing tasks (e.g., GitHub Projects, Trello).
    Subtask 11.3: Host a live demo or screencast showing HLDR in action to attract developers.

### Phase 5: Testing and Polishing
Task 12: Test and Debug Each Component

    Subtask 12.1: Test the CLI in various environments (Mac, Linux, Windows).
    Subtask 12.2: Test the Vim plugin for compatibility with different versions (Vim vs Neovim).
    Subtask 12.3: Test the VS Code extension with different projects and languages.
    Subtask 12.4: Fix bugs, improve performance, and enhance the user experience.

Task 13: Polish Documentation

    Subtask 13.1: Write detailed user documentation for the CLI, Vim plugin, and VS Code extension.
    Subtask 13.2: Create a wiki for advanced users and developers to customize HLDR.
