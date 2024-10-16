def analyze_code(code):
    if code.count('for') > 1:
        return [{"message": "The word 'for' appears more than once."}]
    else:
    # Simulated code analysis logic
    # HLDR Code Analysis Should live here
        return [
            {"line": 5, "suggestion": "Consider refactoring."},
            {"line": 10, "suggestion": "Simplify logic."}
        ]