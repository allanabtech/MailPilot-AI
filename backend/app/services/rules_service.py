import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db.models import Rule, Email

class RulesEngine:
    """Evaluates and executes custom dynamic automation rules on incoming/indexed emails."""

    @staticmethod
    def evaluate_rules_for_account(db: Session, account_id: int) -> int:
        rules = db.query(Rule).filter_by(account_id=account_id, is_active=True).all()
        emails = db.query(Email).filter_by(account_id=account_id, is_deleted=False).all()

        total_actions_applied = 0

        for rule in rules:
            for email in emails:
                if RulesEngine.matches_condition(rule, email):
                    applied = RulesEngine.apply_action(db, rule, email)
                    if applied:
                        rule.trigger_count += 1
                        total_actions_applied += 1
        
        db.commit()
        return total_actions_applied

    @staticmethod
    def matches_condition(rule: Rule, email: Email) -> bool:
        field_val = ""
        if rule.condition_field == "sender":
            field_val = email.sender.lower()
        elif rule.condition_field == "subject":
            field_val = email.subject.lower()
        elif rule.condition_field == "category":
            field_val = email.category.lower()
        elif rule.condition_field == "age_days":
            age_days = (datetime.utcnow() - email.date).days
            if rule.condition_operator == "older_than":
                try:
                    target_days = int(rule.condition_value.split("_")[0]) if "_" in rule.condition_value else int(rule.condition_value)
                    return age_days >= target_days
                except ValueError:
                    return False
            return False

        cond_val = rule.condition_value.lower()
        if rule.condition_operator == "equals":
            return field_val == cond_val
        elif rule.condition_operator == "contains":
            return cond_val in field_val

        return False

    @staticmethod
    def apply_action(db: Session, rule: Rule, email: Email) -> bool:
        changed = False
        action = rule.action_type.lower()

        if action == "archive" and not email.is_archived:
            email.is_archived = True
            changed = True
        elif action == "star" and not email.is_starred:
            email.is_starred = True
            changed = True
        elif action == "delete" and not email.is_deleted:
            email.is_deleted = True
            changed = True
        elif action == "label" and rule.action_value:
            labels = json.loads(email.labels_json) if email.labels_json else []
            if rule.action_value not in labels:
                labels.append(rule.action_value)
                email.labels_json = json.dumps(labels)
                changed = True
        elif action == "category" and rule.action_value:
            if email.category != rule.action_value:
                email.category = rule.action_value
                changed = True

        return changed
