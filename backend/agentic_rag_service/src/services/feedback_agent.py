import logging
import json
import openai
from services.generator_agent import GeneratorAgentService
from services.retriever_agent import RetrieverAgentService

logger = logging.getLogger(__name__)

class FeedbackAgent:

    # Feedback Handling Methods
    @staticmethod
    def store_feedback(redis_client, user_message, context, response, feedback):
        """Store feedback on a given response."""
        try:
            logger.info(f"Storing feedback for message: {user_message}")
            feedback_data = {
                "user_message": user_message,
                "context": context,
                "response": response,
                "feedback": feedback,
            }

            # Store feedback in Redis (keyed by user_message for simplicity)
            feedback_key = f"feedback:{user_message}"
            redis_client.set(feedback_key, json.dumps(feedback_data))
            redis_client.expire(feedback_key, 86400)  # Feedback expires in 1 day

            return {"status": "success", "message": "Feedback stored successfully."}
        except Exception as e:
            logger.error(f"Error storing feedback: {e}")
            return {"status": "error", "message": str(e)}

    @staticmethod
    def analyze_feedback(redis_client):
        """Analyze all feedback stored in Redis to identify patterns."""
        try:
            logger.info("Analyzing feedback...")
            feedback_keys = redis_client.keys("feedback:*")
            all_feedback = []

            for key in feedback_keys:
                feedback_data = json.loads(redis_client.get(key))
                all_feedback.append(feedback_data)

            # Example: Aggregate feedback counts
            feedback_summary = {}
            for feedback in all_feedback:
                feedback_type = feedback["feedback"]
                feedback_summary[feedback_type] = feedback_summary.get(feedback_type, 0) + 1

            return {"status": "success", "summary": feedback_summary, "details": all_feedback}
        except Exception as e:
            logger.error(f"Error analyzing feedback: {e}")
            return {"status": "error", "message": str(e)}

    @staticmethod
    def improve_system(redis_client):
        """Leverage feedback to improve retriever and generator performance."""
        try:
            logger.info("Improving system based on feedback...")
            feedback_analysis = FeedbackAgent.analyze_feedback(redis_client)
            if feedback_analysis["status"] == "success":
                summary = feedback_analysis["summary"]

                # Adjust retriever ranking parameters
                if summary.get("not helpful", 0) > 10:
                    logger.info(
                        "Adjusting retriever ranking parameters to boost relevance for key benefits or AI applications...")
                    # Example: Boost ranking for specific keywords
                    retriever_keywords = ["benefit", "AI", "application"]
                    RetrieverAgentService.update_ranking_parameters(retriever_keywords)

                # Adjust generator parameters
                if summary.get("inaccurate", 0) > 5:
                    logger.info("Adjusting generator parameters to improve accuracy...")
                    # Example: Adjust temperature and max tokens
                    GeneratorAgentService.update_generation_parameters(temperature=0.7, max_tokens=1500)

                # Retrain models if necessary
                if summary.get("outdated", 0) > 3:
                    logger.info("Retraining models to incorporate latest data...")
                    # Example: Retrain models with new data
                    new_training_data = FeedbackAgent.collect_new_training_data(redis_client)
                    openai.FineTune.create(training_file=new_training_data)

                return {"status": "success", "message": "System improved based on feedback."}
            else:
                return {"status": "error", "message": "No feedback to analyze."}
        except Exception as e:
            logger.error(f"Error improving system: {e}")
            return {"status": "error", "message": str(e)}

    @staticmethod
    def collect_new_training_data(redis_client):
        """Collect new training data based on feedback."""
        feedback_keys = redis_client.keys("feedback:*")
        new_training_data = []

        for key in feedback_keys:
            feedback_data = json.loads(redis_client.get(key))
            new_training_data.append({
                "prompt": feedback_data["user_message"],
                "completion": feedback_data["response"]
            })

        # Save new training data to a file
        with open("new_training_data.jsonl", "w") as f:
            for data in new_training_data:
                f.write(json.dumps(data) + "\n")

        return "new_training_data.jsonl"