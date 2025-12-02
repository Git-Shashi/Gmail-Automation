"""
Logging Configuration

This file sets up application logging.

Purpose:
- Configure logging format and levels
- Set up file and console handlers
- Create logger instances for modules
- Track API requests and errors
- Debug OAuth and Gmail API calls

Log Levels:
- DEBUG: Detailed diagnostic info
- INFO: General informational messages
- WARNING: Warning messages (non-critical)
- ERROR: Error messages (handled)
- CRITICAL: Critical errors (system failure)

Log Format:
[TIMESTAMP] [LEVEL] [MODULE] - MESSAGE

Example:
[2024-12-02 10:30:45] [INFO] [auth_service] - User logged in: user@example.com
[2024-12-02 10:31:12] [ERROR] [gmail_service] - Gmail API error: Quota exceeded

Handlers:
1. Console Handler: Print to terminal (INFO and above)
2. File Handler: Write to logs/app.log (DEBUG and above)
3. Error File Handler: Write errors to logs/error.log

Usage in Modules:
from app.utils.logger import get_logger
logger = get_logger(__name__)
logger.info("Operation completed")
logger.error("Something went wrong", exc_info=True)
"""

# Will configure logging with dictConfig
# Will rotate log files daily
# Will include request IDs for tracing
# Will mask sensitive data (tokens, passwords)
