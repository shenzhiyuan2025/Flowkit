from dataclasses import dataclass, field
from typing import Any


@dataclass
class FlowKitResponse:
    text: str
    widgets: list[dict[str, Any]] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        payload: dict[str, Any] = {"role": "assistant", "content": self.text}
        if self.widgets:
            payload["widgets"] = self.widgets
        return payload
