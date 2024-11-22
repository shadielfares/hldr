# Packages
import subprocess
from utils.analysis import analyze_code

# Runs through linkter and provides error if there
def main(file_path):
    """Function to run linter, then code analysis."""
    # Step 3: Run Code
    run_code_and_give_feedback(file_path)

def run_code_and_give_feedback(file_path):
    """Run the code and provide feedback based on output."""
    try:
        print(f"Analysis feedback: \n{analyze_file(file_path)}")
    except Exception as e:
        print(f"Error running the code: {e}")
    
# Reads through the file and gets all code inside of it
def analyze_file(file_path):
    try:
        with open(file_path, 'r') as file:
            code = file.read()
        return analyze_code(code)
    except FileNotFoundError:
        return [f"File not found: {file_path}"]
    except Exception as e:
        return [f"Error reading file: {e}"]
