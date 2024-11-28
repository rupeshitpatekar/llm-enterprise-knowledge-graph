from dataclasses import dataclass

from werkzeug.sansio.multipart import File


@dataclass
class SegmentFileRequest:
    files: list[File]
    modelname: str