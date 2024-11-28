import logging
import openai

from utils.clients_utils import ClientsUtils

logger = logging.getLogger(__name__)

class GeneratorAgentService:
    temperature = 0.7
    max_tokens = 1500

    @staticmethod
    def update_generation_parameters(temperature: float, max_tokens: int):
        """Update the generation parameters for the LLM."""
        try:
            logger.info(f"Updating generation parameters: temperature={temperature}, max_tokens={max_tokens}")
            GeneratorAgentService.temperature = temperature
            GeneratorAgentService.max_tokens = max_tokens
            return {"status": "success", "message": "Generation parameters updated successfully."}
        except Exception as e:
            logger.error(f"Error updating generation parameters: {e}")
            return {"status": "error", "message": str(e)}

    @staticmethod
    def generate_llm_output(user_message: str, context: str):
        try:
            logger.info(f"Generating LLM output for message: {user_message}")
            endpoint, api_key, deployment = ClientsUtils.get_client_config()
            client = openai.AzureOpenAI(
                azure_endpoint=endpoint,
                api_key=api_key,
                api_version="2024-02-01",
            )

            optimised_prompt = f"""
                                    Given the user message "{user_message}" and the following context, generate a concise and accurate response:

                                    Context: {context}

                                    Provide the response in strict JSON format:
                                    {{
                                        "response": "your answer here"
                                    }}
                                    """
            completion = client.chat.completions.create(
                model=deployment,
                messages=[{"role": "user", "content": optimised_prompt}],
                temperature=GeneratorAgentService.temperature,
                max_tokens=GeneratorAgentService.max_tokens
            )
            return completion.choices[0].message.content
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return {"error": str(e)}