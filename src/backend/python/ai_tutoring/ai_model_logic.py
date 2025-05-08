# Placeholder for AI Tutoring Logic

# In a real implementation, you would integrate with:
# 1. A local model (e.g., using Hugging Face Transformers, TensorFlow, PyTorch).
# 2. An external AI API (like OpenAI's GPT, Google Gemini - potentially via Genkit if Python SDK available, or directly via REST).
# 3. Custom rule-based systems or knowledge graphs.

import time
import random

def get_answer(question: str, context: dict = None) -> str:
    """
    Generates an answer to a student's question using placeholder logic.

    Args:
        question: The student's question.
        context: Optional dictionary containing context like user history, course, topic.

    Returns:
        An AI-generated answer string.
    """
    print(f"  [AI Logic] Received question: '{question}'")
    print(f"  [AI Logic] Context: {context}")

    # Simulate AI processing time
    time.sleep(random.uniform(0.5, 2.0))

    # --- Placeholder Response Logic ---
    question_lower = question.lower()

    if "python loop" in question_lower:
        response = """
Python has two main loop types: `for` and `while`.

A `for` loop iterates over a sequence (like a list, tuple, or string) or other iterable object:
```python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
  print(fruit)
```

A `while` loop repeats as long as a condition is true:
```python
count = 0
while count < 5:
  print(f"Count is: {count}")
  count += 1 # Important: Update the condition variable!
```
Remember to avoid infinite loops with `while` by ensuring the condition eventually becomes false.
"""
    elif "recursion" in question_lower:
        response = """
Recursion is when a function calls itself to solve a smaller version of the same problem.
Key parts:
1.  **Base Case:** The simplest condition where the function returns a value directly without calling itself again. This stops the recursion.
2.  **Recursive Step:** The part where the function calls itself with modified input, moving closer to the base case.

Example (Factorial):
```python
def factorial(n):
  # Base case
  if n == 0 or n == 1:
    return 1
  # Recursive step
  else:
    return n * factorial(n - 1)

print(factorial(5)) # Output: 120
```
Be careful with recursion, as deep or infinite recursion can cause a 'Stack Overflow' error.
"""
    elif "binary search" in question_lower:
        response = """
Binary search is an efficient algorithm for finding an item in a **sorted** list. It works by repeatedly dividing the search interval in half.

Steps:
1. Compare the target value with the middle element of the list.
2. If they match, you've found the item.
3. If the target is less than the middle element, search the left half of the list.
4. If the target is greater than the middle element, search the right half.
5. Repeat steps 1-4 until the value is found or the interval is empty.

Because it halves the search space each time, its time complexity is O(log n), which is very fast for large lists.
"""
    elif "css" in question_lower or "style" in question_lower:
         response = "Could you be more specific about your CSS question? Are you asking about selectors, properties, layout (like Flexbox or Grid), or something else?"

    else:
        response = f"I understand you asked about '{question}'. This is a placeholder response. A real AI tutor would provide a more detailed explanation, potentially checking your course context ({context.get('course', 'N/A')}) if available."
    # --- End Placeholder ---

    print("  [AI Logic] Generated response.")
    return response


# Example usage (for testing)
if __name__ == '__main__':
    test_question = "How does a python loop work?"
    test_context = {"course": "Intro to Programming", "user_level": "beginner"}
    answer = get_answer(test_question, test_context)
    print("\n--- Test ---")
    print(f"Q: {test_question}")
    print(f"A: {answer}")

    test_question_2 = "explain recursion simply"
    answer_2 = get_answer(test_question_2)
    print("\n--- Test 2 ---")
    print(f"Q: {test_question_2}")
    print(f"A: {answer_2}")
```