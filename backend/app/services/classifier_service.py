import re
from typing import Tuple, List, Dict

CATEGORIES = [
    "Personal", "Finance", "Shopping", "Travel", "Education",
    "Social", "Forums", "Updates", "Promotions", "Spam",
    "Receipts", "Subscriptions", "GitHub", "Banking", "Government",
    "Healthcare", "OTP", "Security", "Work", "Custom"
]

class EmailClassifier:
    """Heuristic + Rule-based NLP classifier for 20 distinct email categories and Phishing Risk."""

    @staticmethod
    def classify(sender: str, subject: str, body: str) -> Tuple[str, float, float, str]:
        """
        Returns: (category, confidence_score, spam_score, phishing_risk)
        """
        text = f"{sender} {subject} {body}".lower()

        # 1. Check OTP / Security codes
        if re.search(r'\b(otp|verification code|one-time password|2fa|login code|security code|verify your email|confirm code)\b', text):
            return ("OTP", 0.98, 0.05, "Low")

        # 2. Check GitHub / Developer notifications
        if "github.com" in sender.lower() or re.search(r'\b(pull request|commit|issue #|merged|repository|actions run)\b', text):
            return ("GitHub", 0.99, 0.01, "Low")

        # 3. Check Banking & Finance
        if any(w in text for w in ["chase", "bank of america", "wells fargo", "citi", "capital one", "wire transfer", "bank statement", "account balance"]):
            phishing_risk = "Medium" if ("verify account details" in text or "account suspended" in text) else "Low"
            return ("Banking", 0.95, 0.02, phishing_risk)

        # 4. Check Phishing / Spam signals
        is_phishing, p_risk = EmailClassifier.detect_phishing(sender, subject, body)
        if is_phishing:
            return ("Spam", 0.96, 0.92, p_risk)

        # 5. Check Receipts & Shopping
        if re.search(r'\b(receipt|invoice|order confirmed|your order|order #|payment received|tracking number|shipped|amazon.com|apple.com/bill)\b', text):
            if "receipt" in subject.lower() or "invoice" in subject.lower():
                return ("Receipts", 0.96, 0.02, "Low")
            return ("Shopping", 0.94, 0.02, "Low")

        # 6. Check Subscriptions / Newsletters
        if "unsubscribe" in text or "manage preferences" in text or "view in browser" in text:
            return ("Subscriptions", 0.92, 0.10, "Low")

        # 7. Check Security alerts
        if re.search(r'\b(security alert|new login|password changed|suspicious activity|unauthorized access)\b', text):
            return ("Security", 0.95, 0.05, "Medium")

        # 8. Check Finance / Taxes
        if any(w in text for w in ["tax", "w2", "crypto", "dividend", "investment", "portfolio", "credit score"]):
            return ("Finance", 0.91, 0.03, "Low")

        # 9. Check Work
        if any(w in text for w in ["meeting", "agenda", "quarterly", "slack", "zoom link", "project update", "sprint", "jira"]):
            return ("Work", 0.90, 0.01, "Low")

        # 10. Check Healthcare / Government / Travel / Education
        if any(w in text for w in ["appointment", "doctor", "prescription", "lab results", "health"]):
            return ("Healthcare", 0.93, 0.01, "Low")
        if any(w in text for w in ["passport", "gov", "dmv", "tax return", "official notice"]):
            return ("Government", 0.93, 0.01, "Low")
        if any(w in text for w in ["flight", "hotel", "boarding pass", "reservation", "airbnb"]):
            return ("Travel", 0.94, 0.01, "Low")
        if any(w in text for w in ["course", "university", "assignment", "homework", "grade", "coursera"]):
            return ("Education", 0.92, 0.01, "Low")

        # 11. Check Promotions & Social
        if any(w in text for w in ["sale", "discount", "% off", "limited time", "deal", "coupon"]):
            return ("Promotions", 0.89, 0.15, "Low")
        if any(w in text for w in ["linkedin", "twitter", "facebook", "instagram", "followed you", "connection"]):
            return ("Social", 0.92, 0.05, "Low")
        if any(w in text for w in ["forum", "community", "discourse", "reddit", "digest"]):
            return ("Forums", 0.90, 0.05, "Low")

        # Default fallback
        return ("Updates", 0.85, 0.05, "Low")

    @staticmethod
    def detect_phishing(sender: str, subject: str, body: str) -> Tuple[bool, str]:
        """Detects if email is potential phishing and assigns risk level."""
        text = f"{subject} {body}".lower()
        phishing_indicators = 0

        # Urgent action required
        if re.search(r'\b(urgent|immediate action required|account will be suspended|locked|unusual login)\b', text):
            phishing_indicators += 1

        # Asking for credentials or payment verification
        if re.search(r'\b(verify password|click here to unlock|confirm credit card|ssn|social security)\b', text):
            phishing_indicators += 2

        # Mismatched domain spoofing (e.g. sender says paypal but email is xyz.com)
        if "paypal" in text and "paypal.com" not in sender.lower():
            phishing_indicators += 2
        if "google" in text and "account suspended" in text and "google.com" not in sender.lower():
            phishing_indicators += 2

        if phishing_indicators >= 3:
            return (True, "Critical")
        elif phishing_indicators == 2:
            return (True, "High")
        elif phishing_indicators == 1:
            return (False, "Medium")
        
        return (False, "Low")
