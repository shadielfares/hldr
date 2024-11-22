from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from app.main import main

import time
import click

class ChangeHandler(FileSystemEventHandler):
    def __init__(self, file_to_watch):
        self.file_to_watch = file_to_watch
        self.last_modified_time = 0  # Timestamp of the last modification
        
    def on_modified(self, event):
        if event.src_path.endswith(self.file_to_watch):
            current_time = time.time()
            # Trigger linting only if sufficient time has passed since the last modification
            if current_time - self.last_modified_time > 1:  # 1 second debounce
                print(f'{self.file_to_watch} has been modified, running analysis...')
                lint_code(self.file_to_watch)
                self.last_modified_time = current_time

@click.command()
@click.argument('file_to_watch', default='solution.py', type=click.Path(exists=True))
def monitor_file(file_to_watch):
    """Monitor the specified Python file for changes."""
    event_handler = ChangeHandler(file_to_watch)
    observer = Observer()
    observer.schedule(event_handler, path='.', recursive=False)
    observer.start()
    
    print(f"Monitoring changes to {file_to_watch}... (Press Ctrl+C to stop)")

    try:
        while True:
            time.sleep(10)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    monitor_file()
