from dataclasses import dataclass

@dataclass
class ModelConfigData:
    modelname: str
    epochs: int
    optimizername: str
    learningrate: float
    accuracyenhancer: str
    architecturetype: str