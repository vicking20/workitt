# utils/ai_providers.py
import sys
sys.path.insert(0, "libs")
from utils.key import decrypt_config_value
from utils.config import load_config
from openai import AzureOpenAI, OpenAI

class BaseProvider:
    def call_model(self, system_prompt, user_payload, max_tokens=800):
        raise NotImplementedError

class AzureProvider(BaseProvider):
    def __init__(self, api_key, endpoint, deployment):
        self.client = AzureOpenAI(
            api_key=api_key,
            azure_endpoint=endpoint,
            api_version="2024-12-01-preview"
        )
        self.deployment = deployment

    def call_model(self, system_prompt, user_payload, max_tokens=1500, parse_yaml=False):
        import yaml
        yaml_payload = yaml.dump(user_payload, default_flow_style=True)
        
        print(f"[AI] Calling Azure with max_tokens={max_tokens}")
        print(f"[AI] Payload length: {len(yaml_payload)} chars")
        
        response = self.client.chat.completions.create(
            model=self.deployment,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": yaml_payload}
            ],
            max_completion_tokens=max_tokens
        )
        
        print(f"[AI] Response finish_reason: {response.choices[0].finish_reason}")
        print(f"[AI] Response usage: {response.usage}")
        
        raw_text = response.choices[0].message.content
        
        if raw_text is None:
            print("[AI] ERROR: AI returned None content")
            raw_text = ""
        
        print(f"[AI] Raw text length: {len(raw_text)}")
        
        if parse_yaml:
            try:
                parsed = yaml.safe_load(raw_text)
            except Exception as e:
                print(f"[AI] YAML parse error: {str(e)}")
                parsed = {"error": "unable_to_parse_yaml", "raw": raw_text}
            return {"raw": raw_text, "parsed": parsed}
        return {"raw": raw_text}

class OpenAIProvider(BaseProvider):
    def __init__(self, api_key, model="gpt-4o-mini"):
        self.client = OpenAI(api_key=api_key)
        self.model = model

    def call_model(self, system_prompt, user_payload, max_tokens=1500, parse_yaml=False):
        import yaml
        yaml_payload = yaml.dump(user_payload, default_flow_style=True)
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": yaml_payload}
            ],
            max_tokens=max_tokens
        )
        raw_text = response.choices[0].message.content
        if parse_yaml:
            try:
                parsed = yaml.safe_load(raw_text)
            except Exception:
                parsed = {"error": "unable_to_parse_yaml", "raw": raw_text}
            return {"raw": raw_text, "parsed": parsed}
        return {"raw": raw_text}

class ProviderFactory:
    @staticmethod
    def get_provider():
        config = load_config()
        ai_conf = config.get("artificial_intelligence", {})
        platform = ai_conf.get("platform")
        encrypted_key = ai_conf.get("api_key")
        if not encrypted_key:
            raise ValueError("AI API key not set in config.")
        api_key = decrypt_config_value(encrypted_key)

        if platform == "azure":
            endpoint = ai_conf["endpoint"]
            deployment = ai_conf["deployment"]
            return AzureProvider(api_key, endpoint, deployment)
        elif platform == "openai":
            model = ai_conf.get("model", "gpt-4o-mini")
            return OpenAIProvider(api_key, model)
        else:
            raise RuntimeError(f"Unsupported AI platform: {platform}")
