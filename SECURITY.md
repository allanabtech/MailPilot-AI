# Security Policy

## Privacy & Local Processing First
MailPilot AI is designed with strict local processing principles:
- **AES-256 Token Encryption**: OAuth refresh tokens stored at rest in SQLite/PostgreSQL are encrypted using Fernet keys derived from environment secrets.
- **Zero Telemetry**: MailPilot AI collects zero usage data or email contents.
- **No Third-Party AI Data Leaks**: Email classification and rules evaluation occur entirely in-process on your hardware.

## Reporting Vulnerabilities
If you discover a potential security issue in MailPilot AI, please report it confidentially rather than filing a public issue.

Email security reports to: `security@mailpilot-ai.dev`
We aim to acknowledge reports within 48 hours.
