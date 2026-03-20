from typing import Any


def validate_widget(widget: dict[str, Any]) -> dict[str, Any]:
    errors: list[str] = []
    if "type" not in widget or not isinstance(widget["type"], str):
        errors.append("type is required and must be a string")
    if "data" not in widget or not isinstance(widget["data"], dict):
        errors.append("data is required and must be an object")
    return {"valid": len(errors) == 0, "errors": errors}
