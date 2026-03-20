from typing import Iterable


PROMPTS = {
    "flowkit/map-list": "Display locations on a map with a list. Required: locations(name, lat, lng).",
    "flowkit/quick-actions": "Display quick action buttons. Required: items(label).",
    "flowkit/metrics": "Display KPI cards. Required: items(label, value).",
}


def get_widget_prompts(widget_types: Iterable[str]) -> str:
    lines = []
    for widget_type in widget_types:
        if widget_type in PROMPTS:
            lines.append(f"{widget_type}: {PROMPTS[widget_type]}")
    return "\n".join(lines)
