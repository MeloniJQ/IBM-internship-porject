import os
import requests
from typing import Any, Dict, Optional


class GeminiError(Exception):
    pass


def ask_gemini(prompt: str, model: Optional[str] = None, max_tokens: int = 512) -> str:
    """Send a prompt to a configured Gemini-compatible or OpenRouter endpoint and return text."""
    api_url = os.environ.get('GEMINI_API_URL')
    api_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('OPENROUTER_API_KEY')

    if not api_url or not api_key:
        raise GeminiError('GEMINI_API_URL and GEMINI_API_KEY (or OPENROUTER_API_KEY) must be set in environment')

    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }

    payload = _build_payload(api_url, prompt, model, max_tokens)

    resp = requests.post(api_url, json=payload, headers=headers, timeout=30)

    try:
        resp.raise_for_status()
    except Exception as e:
        raise GeminiError(f'API request failed: {e} - {resp.text}')

    data = resp.json()
    return _extract_text_from_response(data)


def _build_payload(api_url: str, prompt: str, model: Optional[str], max_tokens: int) -> Dict[str, Any]:
    normalized_url = api_url.lower()
    model_value = model or os.environ.get('GEMINI_MODEL') or os.environ.get('OPENROUTER_MODEL')

    if 'openrouter.ai' in normalized_url:
        payload: Dict[str, Any] = {
            'model': model_value or 'google/gemma-4-26b-a4b-it:free',
            'messages': [{'role': 'user', 'content': prompt}],
            'max_tokens': int(max_tokens)
        }
    elif 'generativelanguage.googleapis.com' in normalized_url or 'googleapis.com' in normalized_url:
        payload = {
            'prompt': {'text': prompt},
            'max_output_tokens': int(max_tokens)
        }
        if model_value:
            payload['model'] = model_value
    else:
        payload = {
            'prompt': prompt,
            'max_output_tokens': int(max_tokens)
        }
        if model_value:
            payload['model'] = model_value

    return payload


def _extract_text_from_response(data: Any) -> str:
    if isinstance(data, dict):
        if 'candidates' in data and isinstance(data['candidates'], list) and data['candidates']:
            first = data['candidates'][0]
            if isinstance(first, dict):
                for key in ('content', 'output', 'text'):
                    if key in first and isinstance(first[key], str):
                        return first[key]
            if isinstance(first, str):
                return first

        if 'output' in data:
            output = data['output']
            if isinstance(output, str):
                return output
            if isinstance(output, list) and output:
                item = output[0]
                if isinstance(item, dict):
                    for key in ('content', 'text', 'message'):
                        if key in item and isinstance(item[key], str):
                            return item[key]

        if 'choices' in data and isinstance(data['choices'], list) and data['choices']:
            choice = data['choices'][0]
            if isinstance(choice, dict):
                if 'message' in choice and isinstance(choice['message'], dict):
                    for key in ('content', 'text'):
                        if key in choice['message'] and isinstance(choice['message'][key], str):
                            return choice['message'][key]
                for key in ('text', 'output', 'content'):
                    if key in choice and isinstance(choice[key], str):
                        return choice[key]

        for key in ('response', 'text', 'output'):
            if key in data and isinstance(data[key], str):
                return data[key]

        nested = data.get('result') or data.get('data')
        if isinstance(nested, dict):
            return _extract_text_from_response(nested)

    if isinstance(data, list) and data:
        first = data[0]
        if isinstance(first, dict):
            return _extract_text_from_response(first)
        if isinstance(first, str):
            return first

    return str(data)
