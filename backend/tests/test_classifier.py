from app.services.classifier_service import EmailClassifier

def test_otp_classification():
    cat, conf, spam_s, phish_r = EmailClassifier.classify("auth@service.com", "Your login verification code is 582190", "Use code 582190 to login")
    assert cat == "OTP"
    assert conf > 0.9

def test_github_classification():
    cat, conf, spam_s, phish_r = EmailClassifier.classify("notifications@github.com", "[GitHub] Issue #42 updated", "Fix issue in backend")
    assert cat == "GitHub"

def test_phishing_detection():
    is_phish, risk = EmailClassifier.detect_phishing("fake@phish-bank.com", "URGENT: Verify password immediately", "Click here to verify credit card SSN")
    assert is_phish is True
    assert risk in ["High", "Critical"]
