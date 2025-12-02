"""
Helper Utility Functions

This file contains reusable utility functions.

Functions:

1. validate_email(email: str) -> bool:
   Validates email address format
   
2. format_date(date_str: str) -> str:
   Formats email date to readable format
   Input: "Thu, 01 Dec 2024 10:30:00 +0000"
   Output: "Dec 1, 2024 10:30 AM"
   
3. truncate_text(text: str, max_length: int) -> str:
   Truncates text with ellipsis
   Used for email previews
   
4. extract_email_address(from_field: str) -> str:
   Extracts email from "Name <email@example.com>"
   Returns: "email@example.com"
   
5. sanitize_html(html: str) -> str:
   Removes HTML tags from email body
   Converts HTML to plain text
   
6. generate_random_string(length: int) -> str:
   Generates random string for tokens/IDs
   
7. retry_on_failure(func, max_retries=3, delay=1):
   Decorator for retrying failed API calls
   Useful for transient network errors
   
8. mask_sensitive_data(data: dict) -> dict:
   Masks tokens, passwords in logs
   Returns copy with masked fields
   
9. parse_gmail_query(query: str) -> dict:
   Parses Gmail search query into components
   Validates query syntax
   
10. calculate_confidence_score(ai_response: dict) -> float:
    Calculates confidence score from AI response
    Returns 0.0 to 1.0

Usage:
from app.utils.helpers import validate_email, format_date

if validate_email(user_input):
    # Process email
    
formatted = format_date(email.date)
"""

# Will use regex for validation
# Will handle edge cases gracefully
# Will be well-tested with unit tests
# Will include type hints
