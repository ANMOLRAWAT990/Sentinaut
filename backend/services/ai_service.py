from abc import ABC, abstractmethod
import google.generativeai as genai
from google.generativeai.types import GenerationConfig
from tenacity import retry, stop_after_attempt, wait_exponential
import json
import logging
from config import config

logger = logging.getLogger(__name__)

class BaseAIProvider(ABC):
    @abstractmethod
    def generate_json(self, prompt: str) -> dict | list:
        pass

    @abstractmethod
    def generate_text(self, prompt: str) -> str:
        pass


class GeminiProvider(BaseAIProvider):
    def __init__(self):
        if not config.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not configured")
        genai.configure(api_key=config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True
    )
    def generate_json(self, prompt: str) -> dict | list:
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=GenerationConfig(response_mime_type="application/json")
            )
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Gemini API Error: {e}")
            raise e

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True
    )
    def generate_text(self, prompt: str) -> str:
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API Error: {e}")
            raise e


# Prompts
CLASSIFY_BATCH_PROMPT = """You are an expert hospitality analyst. I will provide a batch of guest reviews.
For each review, determine:
1. Sentiment: "Positive", "Negative", or "Neutral"
2. Tags: Select the most relevant tags from the provided custom tags list. If none fit, use general tags like "Experience", "Service", "Operations".
3. Suggested Action: If the review is Negative and mentions a specific problem (e.g. broken AC, rude staff), suggest a short, actionable task for the staff (e.g. "Inspect AC in Room 204"). Otherwise, set it to an empty string.

Custom Tags available: {custom_tags}

Reviews:
{reviews}

You must return a JSON array of objects, one for each review in the exact same order. Each object must follow this schema:
{{
  "sentiment": "Positive|Negative|Neutral",
  "tags": ["Tag1", "Tag2"],
  "suggested_action": "string or empty"
}}
"""


DRAFT_REPLY_PROMPT = """You are a professional hotel manager. Draft a polite, empathetic, and professional response to the following guest review.
Sentiment: {sentiment}
Review: {review}
Output only the drafted response text, no greetings to me, no quotes."""

INSIGHTS_PROMPT = """You are a hospitality strategy consultant. Analyze the following 30-day performance data for a hotel.
Data: {data}

Provide a JSON object with:
1. "summary": A brief 2-sentence executive summary.
2. "anomalies": An array of objects, each with "title" and "severity" (Low, Medium, High).
3. "tasks": An array of objects, each with "task" (actionable recommendation).

Return EXACTLY this JSON schema:
{{
  "summary": "string",
  "anomalies": [{{"title": "string", "severity": "High"}}],
  "tasks": [{{"task": "string"}}]
}}
"""

COMPETITOR_PROMPT = """You are a hotel market analyst. Compare our hotel's performance with competitors based on this data.
Data: {data}
Write a short, strategic paragraph summarizing our position and identifying one key opportunity. Output only the paragraph."""

TRANSLATE_PROMPT = """Translate the following review to English. If it is already in English, return it unchanged. Output ONLY the translation.
Review: {review}"""

class AIService:
    def __init__(self, provider: BaseAIProvider = None):
        self.provider = provider or GeminiProvider()

    def classify_review_batch(self, texts: list[str], custom_tags: list[str]) -> list[dict]:
        if not texts:
            return []
            
        reviews_text = "\n".join([f"[{i}] {t}" for i, t in enumerate(texts)])
        tags_text = ", ".join(custom_tags) if custom_tags else "None"
        
        prompt = CLASSIFY_BATCH_PROMPT.format(custom_tags=tags_text, reviews=reviews_text)
        return self.provider.generate_json(prompt)
        
    def draft_reply(self, review_text: str, sentiment: str) -> str:
        prompt = DRAFT_REPLY_PROMPT.format(review=review_text, sentiment=sentiment)
        return self.provider.generate_text(prompt).strip()
        
    def generate_strategic_insights(self, data: dict) -> dict:
        prompt = INSIGHTS_PROMPT.format(data=json.dumps(data))
        return self.provider.generate_json(prompt)
        
    def summarize_competitors(self, data: dict) -> str:
        prompt = COMPETITOR_PROMPT.format(data=json.dumps(data))
        return self.provider.generate_text(prompt).strip()
        
    def translate_text(self, text: str) -> str:
        prompt = TRANSLATE_PROMPT.format(review=text)
        return self.provider.generate_text(prompt).strip()
